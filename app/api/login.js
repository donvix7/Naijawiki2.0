export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const response = await fetch("http://wiki-server.giguild.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.message || "Login failed" });
    }

    // Set httpOnly cookie with token
    res.setHeader("Set-Cookie", `token=${data.token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Strict; Secure`);

    return res.status(200).json({ role: data.role, message: data.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
