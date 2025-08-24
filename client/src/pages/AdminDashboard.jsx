import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function AdminDashboard() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [messages, setMessages] = useState([]);

  async function load() {
    try {
      const d = await api("/admin/pending/deposits"); setDeposits(d.pending);
      const w = await api("/admin/pending/withdrawals"); setWithdrawals(w.pending);
      const m = await api("/admin/messages"); setMessages(m.messages);
    } catch {}
  }
  useEffect(() => { load(); }, []);

  async function approveDeposit(id) { await api(`/admin/deposits/${id}/approve`, { method:"POST" }); load(); }
  async function approveWithdraw(id) { await api(`/admin/withdrawals/${id}/approve`, { method:"POST" }); load(); }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-extrabold">Admin Dashboard</h2>

      <Card>
        <h3 className="font-bold mb-3">Pending Deposits</h3>
        {deposits.map(d => (
          <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 mb-2">
            <div className="text-slate-700">{d.email} — <b>${d.amount}</b></div>
            <Button onClick={()=>approveDeposit(d.id)}>Approve</Button>
          </div>
        ))}
        {deposits.length === 0 && <div className="text-slate-500">No pending deposits</div>}
      </Card>

      <Card>
        <h3 className="font-bold mb-3">Pending Withdrawals</h3>
        {withdrawals.map(w => (
          <div key={w.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 mb-2">
            <div className="text-slate-700">{w.email} — <b>${w.amount}</b></div>
            <Button onClick={()=>approveWithdraw(w.id)}>Approve</Button>
          </div>
        ))}
        {withdrawals.length === 0 && <div className="text-slate-500">No pending withdrawals</div>}
      </Card>

      <Card>
        <h3 className="font-bold mb-3">Latest Messages</h3>
        <div className="space-y-2 max-h-64 overflow-auto">
          {messages.map(m => (
            <div key={m.id} className="rounded-xl border border-slate-200 p-3">
              <div className="text-sm text-slate-500">{m.email}</div>
              <div className="text-slate-800">{m.body}</div>
              <div className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
          }
