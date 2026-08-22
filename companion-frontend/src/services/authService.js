const NKOSI_USER = {
  id: 1,
  username: "Nkosi",
  email: "Nkosi_10@outlook.com",
  role: "ROLE_POLICYHOLDER",
  policyId: "POL-NKOSI-1001",
};

export async function login() {
  return { token: "frontend-demo-token", user: NKOSI_USER };
}

export async function register() {
  return { success: true };
}
