import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/Button";

export default function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"", referral:"" });
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await api("/auth/register", { method: "POST", body: form });
      alert("Registered! Check your email for verification.");
      nav("/login");
    } catch (e) { setErr(e.error || "Signup failed"); }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6">Create account</h2>
      <form className="space-y-4" onSubmit={submit}>
        <input className="input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="input" placeholder="Phone (optional)" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <input className="input" placeholder="Referral code (optional)" value={form.referral} onChange={e=>setForm({...form, referral:e.target.value})}/>
        </div>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <Button type="submit" className="w-full">Sign up</Button>
      </form>
    </div>
  );
      }
