import React, { useEffect, useState } from "react";

export default function VerifyPage() {
  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) { setMsg("Invalid token"); return; }
    fetch(`/api/auth/verify/${token}`)
      .then(r => { if (!r.redirected) setMsg("Verification complete — you may login."); })
      .catch(() => setMsg("Verification failed"));
  }, []);

  return <div className="max-w-xl mx-auto"><h2 className="text-2xl font-semibold">{msg}</h2></div>;
}
