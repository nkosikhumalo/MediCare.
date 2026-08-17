// Auth calls are mocked out for frontend development.
// Swap these back to real API calls when reconnecting the backend.

export async function login(_email, _password) {
  return { token: "mock-token", user: { id: 1, username: "dev", email: _email } };
}

export async function register(_formData) {
  return { success: true };
}
