import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LoginRegister() {
  const handleGoogleLogin = () => {
    window.location.href = '/api/login';
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
            <Button 
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl py-3 border border-gray-300 flex items-center justify-center gap-3"
              data-testid="button-google-login"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </Button>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <form className="space-y-4">
              <Input
                type="text"
                placeholder="Email or username"
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
                data-testid="input-email"
              />
              <Input
                type="password"
                placeholder="Password"
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
                data-testid="input-password"
              />

              <Button className="w-full bg-[#0080FF] hover:bg-[#0066cc] text-white font-semibold rounded-xl py-3" data-testid="button-login">
                Login
              </Button>

              <p className="text-center text-gray-500 mt-2 text-sm">
                Don't have an account? <a href="#register" className="text-[#0080FF] font-medium">Register</a>
              </p>
            </form>

            <div className="my-6 border-t border-gray-200"></div>

            <form className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
                data-testid="input-fullname"
              />
              <Input
                type="text"
                placeholder="Email or username"
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
                data-testid="input-register-email"
              />
              <Input
                type="password"
                placeholder="Create password"
                className="p-3 rounded-xl border-gray-300 focus:border-[#0080FF]"
                data-testid="input-register-password"
              />

              <Button className="w-full bg-[#FFD0FD] hover:bg-[#ffb7fa] text-[#0080FF] font-semibold rounded-xl py-3" data-testid="button-register">
                Register
              </Button>
            </form>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
