const languageMap = {
    EN: "en-ZA",
    AF: "af-ZA",
    ZU: "zu-ZA",
    XH: "xh-ZA",
    ST: "st-ZA",
    TN: "tn-ZA",
    SS: "ss-ZA",
    VE: "ve-ZA",
    TS: "ts-ZA",
    NR: "nr-ZA",
    NSO: "nso-ZA"
};

export function speak(text, language = "EN") {

    // Voice disabled
    if (localStorage.getItem("voice") === "off") {

        return;

    }

    if (!window.speechSynthesis) {

        return;

    }

    // Stop any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = languageMap[language] || "en-ZA";

    utterance.rate = 1;

    utterance.pitch = 1;

    utterance.volume = 1;

    // Try to use a matching installed voice
    const voices = window.speechSynthesis.getVoices();

    const matchingVoice = voices.find(

        voice =>

            voice.lang
                .toLowerCase()
                .startsWith(
                    utterance.lang.substring(0,2).toLowerCase()
                )

    );

    if (matchingVoice) {

        utterance.voice = matchingVoice;

    }

    window.speechSynthesis.speak(utterance);

}