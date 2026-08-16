/**
 * Claims Controller — FNOL (First Notice of Loss) & Document Management
 *
 * Handles:
 *   GET  /api/claims/checklist          — returns the required document list
 *   POST /api/claims                    — creates a pending FNOL claim ticket
 *   GET  /api/claims/:claimId           — get claim status
 *   POST /api/claims/:claimId/documents — upload + AI-validate a document
 */

const db = require("../database/db");
const { proxyMultipartToJava } = require("../services/proxyService");

// ─── Document checklist ───────────────────────────────────────────────────────

exports.getChecklist = (_req, res) => {
    res.json({
        title: "Required Documents for a Death Claim",
        documents: [
            {
                id: "DEATH_CERTIFICATE",
                name: "Certified Copy of Death Certificate",
                description: "Original or certified copy issued by the Department of Home Affairs (Form BI-1663 / DHA-1663).",
                required: true,
            },
            {
                id: "DHA_1663",
                name: "BI-1663 / DHA-1663 — Notice of Death Form",
                description: "The official Notice of Death form completed at Home Affairs.",
                required: true,
            },
            {
                id: "ID_DOCUMENT",
                name: "Certified Copy of Deceased's & Claimant's South African ID",
                description: "Both IDs must be certified within the last 3 months.",
                required: true,
            },
            {
                id: "BANK_STATEMENT",
                name: "Claimant's Bank Statement",
                description: "A recent bank statement (not older than 3 months) for payout verification.",
                required: true,
            },
        ],
        note: "All documents must be clear, unobstructed photos or scanned PDFs. Blurry or cropped images will be flagged for re-upload.",
    });
};

// ─── Create FNOL claim ticket ─────────────────────────────────────────────────

exports.createClaim = async (req, res) => {
    try {
        const { claimant_name, deceased_name, deceased_id_number, date_of_death, notes } = req.body;
        const userId = req.user?.id;
        const policyId = req.user?.policyId || "unknown";

        if (!claimant_name) {
            return res.status(400).json({ message: "claimant_name is required." });
        }

        const result = await db.query(
            `INSERT INTO claims
               (user_id, policy_id, claimant_name, deceased_name, deceased_id_number, date_of_death, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING *`,
            [userId, policyId, claimant_name, deceased_name || null,
                deceased_id_number || null, date_of_death || null, notes || null]
        );

        const claim = result.rows[0];

        res.status(201).json({
            message: "Your claim has been registered. Our team will review it shortly.",
            claim,
            nextStep: "Please upload the required documents using POST /api/claims/:claimId/documents",
        });

    } catch (err) {
        console.error("[Claims] createClaim error:", err);
        res.status(500).json({ message: "Failed to create claim." });
    }
};

// ─── Get claim status ─────────────────────────────────────────────────────────

exports.getClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        const userId = req.user?.id;

        const result = await db.query(
            `SELECT c.*, 
                    json_agg(cd ORDER BY cd.created_at) FILTER (WHERE cd.id IS NOT NULL) AS documents
             FROM claims c
             LEFT JOIN claim_documents cd ON cd.claim_id = c.id
             WHERE c.id = $1 AND c.user_id = $2
             GROUP BY c.id`,
            [claimId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Claim not found." });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error("[Claims] getClaim error:", err);
        res.status(500).json({ message: "Failed to retrieve claim." });
    }
};

// ─── Upload & validate a document ────────────────────────────────────────────
// Proxies the file + metadata to Java for AI document scanning,
// then persists the validation result in PostgreSQL.

exports.uploadDocument = async (req, res) => {
    const { claimId } = req.params;
    const userId = req.user?.id;

    // Verify the claim belongs to this user before accepting the upload
    try {
        const check = await db.query(
            "SELECT id FROM claims WHERE id = $1 AND user_id = $2",
            [claimId, userId]
        );
        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Claim not found." });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database error." });
    }

    // Forward the multipart file to Java for AI scanning
    // Java returns { isValid, docType, extractedId, matchesPolicy, feedback, qualityIssue }
    proxyMultipartToJava(req, res, `/api/claims/${claimId}/validate-document`, async (javaResponse) => {
        try {
            const { isValid, docType, extractedId, matchesPolicy, feedback, qualityIssue } = javaResponse;

            const docType_ = docType || req.body?.docType || "OTHER";
            const fileName = req.file?.originalname || "unknown";
            const mimeType = req.file?.mimetype || "application/octet-stream";
            const notes = feedback || (qualityIssue ? "Quality issue: " + qualityIssue : null);

            // Persist the document record
            const inserted = await db.query(
                `INSERT INTO claim_documents
                   (claim_id, doc_type, file_name, mime_type, is_valid, validation_notes)
                 VALUES ($1,$2,$3,$4,$5,$6)
                 RETURNING *`,
                [claimId, docType_, fileName, mimeType, isValid, notes]
            );

            // If all required docs for this claim are valid, mark it as docs-collected
            const docsResult = await db.query(
                `SELECT COUNT(*) FILTER (WHERE is_valid = true) AS valid_count
                 FROM claim_documents WHERE claim_id = $1`,
                [claimId]
            );
            const validCount = parseInt(docsResult.rows[0].valid_count, 10);
            if (validCount >= 4) {
                await db.query(
                    `UPDATE claims SET documents_validated = true, updated_at = NOW() WHERE id = $1`,
                    [claimId]
                );
            }

            res.status(isValid ? 200 : 422).json({
                document: inserted.rows[0],
                isValid,
                docType: docType_,
                extractedId,
                matchesPolicy,
                feedback: notes,
                qualityIssue,
            });

        } catch (err) {
            console.error("[Claims] uploadDocument persist error:", err);
            res.status(500).json({ message: "Failed to save document record." });
        }
    });
};
