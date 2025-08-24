import React from "react";
import Card from "../components/Card";

export default function About() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold">About ProfitBliss</h2>
      <p className="text-slate-700">
        ProfitBliss is a fintech platform focused on crypto investment plans with transparent, daily ROI.
        Our mission is to provide a simple, secure experience for everyday investors.
      </p>
      <Card>
        <h3 className="font-semibold">Location</h3>
        <p className="text-slate-700">ProfitBliss LLC — 125 Park Avenue, New York, NY 10017, USA</p>
      </Card>
    </div>
  );
}
