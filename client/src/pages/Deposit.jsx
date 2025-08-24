import React, { useState } from "react";
import { api } from "../lib/api";
import { QRCodeCanvas } from "qrcode.react";
import Card from "../components/Card";
import Button from "../components/Button";

const WALLETS = {
  BTC: "bc1q4c6f7xzsekkpvd2guwkaww4m7se9yjlrxnrjc7",
  ETH: "0x08cFE6DDC3b58B0655dD1c9214BcfdDBD3855CCA",
  LTC: "ltc1qattx7q06hrjs7x8jkruyhjw7pavklwetg0j3wl",
  USDT_ERC20: "0x08cFE6DDC3b58B0655dD1c9214BcfdDBD3855CCA"
};

export default function Deposit() {
  const [amount, setAmount] = useState(50);
  const [msg, setMsg] = useState(null);
  const [method, setMethod] = useState("USDT_ERC20");

  async function submit(e) {
    e.preventDefault();
    try {
      if (Number(amount) < 50) return setMsg("Minimum deposit is $50");
      const r = await api("/transactions/deposit", { method:"POST", body:{ amount, currency: "USD" }});
      setMsg(r.message || "Deposit pending");
    } catch (e) { setMsg(e.error || "Error"); }
  }

  const address = WALLETS[method];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <h2 className="text-2xl font-extrabold mb-4">Deposit (Minimum $50)</h2>
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm text-slate-600">Payment Method</label>
              <select className="input" value={method} onChange={e=>setMethod(e.target.value)}>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="LTC">Litecoin (LTC)</option>
                <option value="USDT_ERC20">Tether USDT (ERC-20)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-slate-600">Amount (USD)</label>
              <input className="input" type="number" min={50} value={amount} onChange={e=>setAmount(Number(e.target.value))}/>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="text-sm text-slate-500 mb-1">Send to Address</div>
              <div className="font-mono break-all text-slate-900">{address}</div>
            </Card>
            <div className="flex items-center justify-center bg-white border border-slate-200 rounded-2xl">
              <QRCodeCanvas value={address} size={180} includeMargin />
            </div>
          </div>

          <Button type="submit">I have sent the payment</Button>
        </form>
        {msg && <div className="mt-3 text-slate-700">{msg}</div>}
      </Card>
    </div>
  );
              }
