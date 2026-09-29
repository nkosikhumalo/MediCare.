const isProduction = process.env.NODE_ENV === "production";

const sessionCookieName = isProduction ? "__Host-candor_session" : "candor_session";

function sessionCookieOptions(maxAge = 30 * 24 * 60 * 60 * 1000) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge,
  };
}

function clearSessionCookie(res) {
  const { maxAge, ...options } = sessionCookieOptions();
  res.clearCookie(sessionCookieName, options);
}

module.exports = { sessionCookieName, sessionCookieOptions, clearSessionCookie };
