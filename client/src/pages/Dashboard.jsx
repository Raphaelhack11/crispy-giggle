import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("pb_user") || "null"));
  const [balance, setBalance] = useState(user?.balance || 0);
  const [plans, setPlans] = useState([]);

  useEffect(() => { (async () => { try { const p = await api("/plans"); setPlans(p.plans);} catch {} })(); }, []);

  function requireLogin() {
    const u = JSON.parse(localStorage.getItem("pb_user") || "null");
    if (!u) { nav("/login"); return null; }
    return u;
  }

  async function subscribe(planId) {
    const u = requireLogin(); if (!u) return;
    try {
      await api("/plans/subscribe", { method:"POST", body: { planId } });
      alert("Subscribed successfully!");
      nav("/plans/active");
    } catch (e) {
      if (e.error === "Insufficient balance") {
        if (confirm("Insufficient balance. Go to deposit?")) nav("/deposit");
      } else { alert(e.error || "Subscription failed"); }
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="text-sm text-slate-500">Account Balance</div>
        <div className="text-4xl font-extrabold">${Number(balance).toFixed(2)}</div>
        <div className="mt-4 flex gap-3">
          <Button as="a" href="/deposit" className="">Deposit</Button>
          <Button as="a" href="/withdraw" className="bg-slate-900 hover:bg-slate-800">Withdraw</Button>
        </div>
      </Card>

      <section className="space-y-3">
        <h3 className="text-2xl font-bold">Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(p => (
            <Card key={p.id}>
              <div className="font-bold text-xl">{p.name}</div>
              <div className="text-slate-600">Stake: ${p.stake}</div>
              <div className="text-brand-700 font-semibold">Daily ROI: {Math.round(p.dailyRoi * 100)}%</div>
              <div className="text-slate-600">Duration: {p.durationDays} days</div>
              <Button className="mt-3" onClick={() => subscribe(p.id)}>Subscribe</Button>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold">Active Plans</h3>
        <Link to="/plans/active" className="link">View current plans →</Link>
      </section>
    </div>
  );
  }
