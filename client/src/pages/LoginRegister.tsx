import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function LoginRegister() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regYear, setRegYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginEmail, password: loginPassword }), credentials: "include" });
      const data = await res.json();
      if (res.ok) { window.location.href = "/"; } else { setError(data.message || "Invalid credentials"); }
    } catch { setError("Something went wrong."); } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (regPassword !== regConfirmPassword) { setError("Passwords do not match!"); return; }
    if (regPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: regEmail, password: regPassword, firstName: regFirstName, lastName: regLastName, schoolName: regSchool, yearLevel: regYear ? parseInt(regYear) : null }), credentials: "include" });
      const data = await res.json();
      if (res.ok) { window.location.href = "/"; } else { setError(data.message || "Registration failed"); }
    } catch { setError("Something went wrong."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C7DCFF] via-[#FFFFFF] to-[#FFD0FD] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🏥</div>
          <h1 className="text-3xl font-bold text-[#0080FF]">CKalingaLink</h1>
          <p className="text-gray-500 text-sm mt-1">Connecting Care, Courage, and Community</p>
        </div>
        <div className="flex bg-white rounded-2xl p-1 mb-4 shadow-sm border border-gray-100">
          <button onClick={() => { setMode("login"); setError(""); }} className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all " + (mode === "login" ? "bg-[#0080FF] text-white shadow" : "text-gray-500")}>Login</button>
          <button onClick={() => { setMode("register"); setError(""); }} className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all " + (mode === "register" ? "bg-[#0080FF] text-white shadow" : "text-gray-500")}>Register</button>
        </div>
        <Card className="shadow-2xl rounded-2xl bg-white/80 backdrop-blur-md border-0">
          <CardContent className="pt-5 pb-6 px-6">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            {mode === "login" ? (
              <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email or Username</label>
                  <Input type="text" placeholder="Enter email or username" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="rounded-xl border-gray-200 h-11" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Password</label>
                  <div className="relative">
                    <Input type={showLoginPw ? "text" : "password"} placeholder="Enter password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="rounded-xl border-gray-200 h-11 pr-10" required />
                    <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#0080FF] hover:bg-[#0066cc] text-white font-semibold rounded-xl h-11">{loading ? "Logging in..." : "Login"}</Button>
                <p className="text-center text-gray-400 text-xs">No account? <button type="button" onClick={() => setMode("register")} className="text-[#0080FF] font-semibold">Register here</button></p>
              </motion.form>
            ) : (
              <motion.form key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3" onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">First Name</label>
                    <Input type="text" placeholder="Juan" value={regFirstName} onChange={e => setRegFirstName(e.target.value)} className="rounded-xl border-gray-200 h-11" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Last Name</label>
                    <Input type="text" placeholder="dela Cruz" value={regLastName} onChange={e => setRegLastName(e.target.value)} className="rounded-xl border-gray-200 h-11" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email Address</label>
                  <Input type="email" placeholder="juan@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="rounded-xl border-gray-200 h-11" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">School / University</label>
                  <Input type="text" placeholder="e.g. UP Manila College of Nursing" value={regSchool} onChange={e => setRegSchool(e.target.value)} className="rounded-xl border-gray-200 h-11" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Year Level</label>
                  <select value={regYear} onChange={e => setRegYear(e.target.value)} className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#0080FF] bg-white text-gray-700">
                    <option value="">Select year level</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">Graduate / Board Taker</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Password</label>
                  <div className="relative">
                    <Input type={showRegPw ? "text" : "password"} placeholder="Minimum 8 characters" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="rounded-xl border-gray-200 h-11 pr-10" required minLength={8} />
                    <button type="button" onClick={() => setShowRegPw(!showRegPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Input type={showConfirmPw ? "text" : "password"} placeholder="Re-enter password" value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} className={"rounded-xl h-11 border pr-10 " + (regConfirmPassword && regPassword !== regConfirmPassword ? "border-red-400" : "border-gray-200")} required />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regConfirmPassword && regPassword !== regConfirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#0080FF] hover:bg-[#0066cc] text-white font-semibold rounded-xl h-11 mt-1">{loading ? "Creating account..." : "Create Account"}</Button>
                <p className="text-center text-gray-400 text-xs">Have an account? <button type="button" onClick={() => setMode("login")} className="text-[#0080FF] font-semibold">Login here</button></p>
              </motion.form>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-gray-400 text-xs mt-4">For PNLE and NCLEX Board Exam Review</p>
      </div>
    </div>
  );
}