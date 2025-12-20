// "use client"

// import { useEffect, useState } from "react"
// import { Eye, EyeOff,ArrowLeft } from "lucide-react"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import { signIn } from "next-auth/react";

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [isEmailLoading, setIsEmailLoading] = useState(false)
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false)
//   const [error, setError] = useState("")
//   const router = useRouter()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsEmailLoading(true)
//     setError("")

//     try {
//       const response = await fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         router.push("/dashboard")
//       }
//       else {
//         setError(data.message || "Login failed")
//       }
//     } catch (err) {
//       setError("Network error. Please try again.")
//     } finally {
//       setIsEmailLoading(false)
//     }
//   }
//   const handleGoogleLogin = () => {
//     setIsGoogleLoading(true)
//     signIn("google", { callbackUrl: `${window.location.origin}/dashboard` });
//     // const callbackUrl = process.env.NODE_ENV === "production"
//     //   ? `${window.location.origin}/dashboard`
//     //   : "http://localhost:3000/dashboard";
//     signIn("google", { callbackUrl, redirect: true });
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms of Use and Privacy Policy.");
      setIsLoading(false);
      return;
    }
    setIsEmailLoading(true);

    try {
      // Use NextAuth credentials sign-in (no UI change)
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (!res) {
        setError("Something went wrong");
        return;
      }

      if (res?.error) {
        setError(res.error || "Login failed");
      } else {
        // success
        await new Promise((r) => setTimeout(r, 300));
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("SignIn error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // Single call, fixed callback URL
    signIn("google", { callbackUrl: `${window.location.origin}/dashboard` });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-2.5">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <img
                  src="/chatterly_logo.png"
                  alt="logo"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="my-2 text-center">
            {/* Demo Warning */}
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl mb-4 text-sm text-center">
              ⚠️ <strong>Educational Demo Only</strong><br />
              This is a student-built collaborative AI chat project.<br />
              <strong>Do NOT use real passwords or personal information.</strong>
            </div>
            {/* <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm text-center mb-3">
              Demo project — do not use real credentials.
            </div> */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full bg-white border border-gray-400 text-gray-700 py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-gray-300/70 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  Continue with Google
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Google login is used only for demo authentication.
            </p>

            <p className="text-gray-500 mb-2 mt-4">or sign in with</p>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            <button
              type="submit"
              disabled={isEmailLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isEmailLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
