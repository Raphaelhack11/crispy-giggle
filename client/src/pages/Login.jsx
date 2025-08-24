import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/Button";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api("/auth/login", { method:"POST", body: form });
      localStorage.setItem("pb_token", data.token);
      localStorage.setItem("pb_user", JSON.stringify(data.user));
      nav("/dashboard");
    } catch (e) { setErr(e.error || "Login failed"); }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold mb-6">Login</h2>
      <form className="space-y-4" onSubmit={submit}>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
}
