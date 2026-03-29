import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);

      alert("Login successful");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Login</h1>

      <input
        placeholder="Email"
        className="border p-2 w-full"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        className="border p-2 w-full"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-emeraldAccent text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
