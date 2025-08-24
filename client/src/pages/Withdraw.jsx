import React, { useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [addr, setAddr] = useState("");
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (Number(amount) < 60) { setMsg("Minimum withdrawal $60"); return; }
    try {
      const r = await api("/transactions/withdraw", { method:"POST", body: { amount: Number(amount), toAddress: addr } });
      setMsg(r.message || "Withdrawal requested");
      setAmount("");
      setAddr("");
    } catch (e) { setMsg(e.error || "Error"); }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-extrabold mb-4">Withdraw</h2>
      <form className="space-y-4" onSubmit={submit}>
        <input className="input" type="number" placeholder="Amount (USD)" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input className="input" placeholder="Destination wallet address" value={addr} onChange={e=>setAddr(e.target.value)} />
        <Button type="submit" className="w-full">Request Withdraw</Button>
      </form>
      {msg && <div className="mt-3 text-slate-700">{msg}</div>}
    </div>
  );
}
