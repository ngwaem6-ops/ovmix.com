import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || "Registration failed");
      }
      // Redirect to sign-in
      router.push("/api/auth/signin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-ovmixIndigo mb-4">Create an account</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <div>
          <label className="mr-2">
            <input type="radio" name="role" value="customer" checked={role === "customer"} onChange={() => setRole("customer")} />
            <span className="ml-2">Customer</span>
          </label>
          <label className="ml-4">
            <input type="radio" name="role" value="merchant" checked={role === "merchant"} onChange={() => setRole("merchant")} />
            <span className="ml-2">Merchant</span>
          </label>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button className="bg-ovmixIndigo text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
