import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LoginRegister() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/";
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const [firstName, ...rest] = regName.split(" ");
      const lastName = rest.join(" ");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          firstName,
          lastName,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/";
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C7DCFF] via-[#FFFFFF] to-[#FFD0FD] p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl bg-white/70 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#0080FF]">
            CKalingaLink
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Connecting Care, Courage, and Community
          </p>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleLogin}>
              <Input
                type="text"
                placeholder="Email or username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0080FF] hover:bg-[#0066cc] text-white font-semibold rounded-xl py-3"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-center text-gray-500 mt-2 text-sm">
                Don't have an account?{" "}
                <a href="#register" className="text-[#0080FF] font-medium">
                  Register
                </a>
              </p>
            </form>
            <div className="my-6 border-t border-gray-200"></div>
            <form className="space-y-4" onSubmit={handleRegister} id="register">
              <Input
                type="text"
                placeholder="Full Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
              />
              <Input
                type="text"
                placeholder="Email address"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
              />
              <Input
                type="password"
                placeholder="Create password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD0FD] hover:bg-[#ffb7fa] text-[#0080FF] font-semibold rounded-xl py-3"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
