import React, { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function AdminLogin() {
  const [form, setForm] = useState({ email:"", password:"" });
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const data = await api("/auth/login", { method:"POST", body: form });
    if (data.user.isAdmin) {
      localStorage.setItem("pb_token", data.token);
      localStorage.setItem("pb_user", JSON.stringify(data.user));
      nav("/admin");
    } else {
      alert("Not an admin");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-extrabold mb-4">Admin Login</h2>
      <form className="space-y-4" onSubmit={submit}>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
}
