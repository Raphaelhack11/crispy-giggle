import React, { useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Contact() {
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      await api("/messages", { method:"POST", body:{ body } });
      setMsg("Message sent");
      setBody("");
    } catch (e) { setMsg(e.error || "Error"); }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold">Contact</h2>
      <Card>
        <p>Email: <a className="link" href="mailto:marshabills9@gmail.com">marshabills9@gmail.com</a></p>
        <p>Phone: +1 (703) 940-2611</p>
      </Card>
      <form className="space-y-3" onSubmit={submit}>
        <textarea className="input h-32" placeholder="Your message" value={body} onChange={e=>setBody(e.target.value)} />
        <Button type="submit" className="w-full">Send</Button>
      </form>
      {msg && <div className="text-slate-700">{msg}</div>}
    </div>
  );
}
