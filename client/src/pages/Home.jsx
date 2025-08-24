import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Grow your <span className="text-brand-700">crypto</span> daily, simply.
        </motion.h1>
        <p className="text-lg text-slate-600">
          ProfitBliss offers transparent investment plans with daily ROI, built for clarity and ease.
        </p>
        <div className="flex gap-3">
          <Button as="a" href="/signup">Get Started</Button>
          <Button className="bg-slate-900 hover:bg-slate-800" as="a" href="/about">Learn More</Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge">Secure</span>
          <span className="badge">Transparent</span>
          <span className="badge">Simple</span>
        </div>
      </div>
      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Basic", stake: 50, roi: 20 },
            { title: "Gold", stake: 100, roi: 35 },
            { title: "Premium", stake: 200, roi: 50 },
            { title: "Pro", stake: 500, roi: 60 }
          ].map((p, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="text-sm text-slate-500">{p.title}</div>
              <div className="text-2xl font-bold">${p.stake}</div>
              <div className="text-sm text-brand-700 font-semibold">{p.roi}% daily ROI</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
              }
