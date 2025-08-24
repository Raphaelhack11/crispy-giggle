import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ActivePlans from "./pages/ActivePlans";
import VerifyPage from "./pages/VerifyPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home/></Layout>} />
        <Route path="/signup" element={<Layout><Signup/></Layout>} />
        <Route path="/login" element={<Layout><Login/></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard/></Layout>} />
        <Route path="/deposit" element={<Layout><Deposit/></Layout>} />
        <Route path="/withdraw" element={<Layout><Withdraw/></Layout>} />
        <Route path="/about" element={<Layout><About/></Layout>} />
        <Route path="/contact" element={<Layout><Contact/></Layout>} />
        <Route path="/plans/active" element={<Layout><ActivePlans/></Layout>} />
        <Route path="/verify" element={<Layout><VerifyPage/></Layout>} />
        <Route path="/admin/login" element={<Layout><AdminLogin/></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard/></Layout>} />
      </Routes>
    </BrowserRouter>
  );
                                                 }
