import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Card from "../components/Card";

export default function ActivePlans() {
  const [active, setActive] = useState([]);
  useEffect(() => { (async () => { try { const r = await api("/plans/active"); setActive(r.active);} catch {} })(); }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-4">Active Plans</h2>
      <div className="space-y-3">
        {active.map(a => (
          <Card key={a.id}>
            <div className="font-bold">{a.name}</div>
            <div className="text-slate-600">Stake: ${a.stake}</div>
            <div className="text-brand-700 font-semibold">Daily ROI: {Math.round(a.dailyRoi*100)}%</div>
            <div className="text-slate-500">Ends: {new Date(a.endAt).toLocaleString()}</div>
          </Card>
        ))}
        {active.length === 0 && <div className="text-slate-500">No active plans.</div>}
      </div>
    </div>
  );
}
