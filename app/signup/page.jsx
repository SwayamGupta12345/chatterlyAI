"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Reusable password rule component
const PasswordCheck = ({ label, valid }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <span className="text-green-600 font-bold">✔</span>
      ) : (
        <span className="text-red-500 font-bold">✘</span>
      )}
      <span className={valid ? "text-green-600" : "text-red-500"}>{label}</span>
    </div>
  );
};

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Password validation rules
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password && password === confirmPassword,
  };

  const allGood =
    passwordChecks.length &&
    passwordChecks.upper &&
    passwordChecks.number &&
    passwordChecks.special &&
    passwordChecks.match;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!agreed) {
      setError("You must agree to the Terms of Use and Privacy Policy.");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!allGood) {
      setError("Password requirements not met.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
    // const callbackUrl = process.env.NODE_ENV === "production"
    //   ? `${window.location.origin}/dashboard`
    //   : "http://localhost:3000/dashboard";
    signIn("google", { callbackUrl, redirect: true });
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

        {/* Signup Card */}
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
              Join ChatterlyAI
            </h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          {/* Google login */}
          <div className="my-2 text-center">
            {/* Demo Warning */}
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl mb-4 text-sm text-center">
              ⚠️ <strong>Educational Demo Only</strong><br />
              Do not use real passwords or personal information.
            </div>
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full bg-white border border-gray-400 text-gray-700 py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-gray-300/70 transition-all duration-300 flex items-center justify-center"
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
            <p className="text-gray-500 mt-4 mb-2">or sign up with</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-2">
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
                  className={`w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12
                   ${password.length === 0
                      ? "border border-gray-200 focus:ring-purple-500"
                      : allGood
                        ? "border border-green-500 focus:ring-green-500"
                        : "border border-red-500 focus:ring-red-500"
                    }`}
                  placeholder="Create a password"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                   ${confirmPassword.length === 0
                      ? "border border-gray-200 focus:ring-purple-500"
                      : passwordChecks.match
                        ? "border border-green-500 focus:ring-green-500"
                        : "border border-red-500 focus:ring-red-500"
                    }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Password Rules */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <PasswordCheck
                  label="At least 8 characters"
                  valid={passwordChecks.length}
                />
                <PasswordCheck
                  label="One uppercase letter"
                  valid={passwordChecks.upper}
                />
                <PasswordCheck
                  label="One number"
                  valid={passwordChecks.number}
                />
                <PasswordCheck
                  label="One special character"
                  valid={passwordChecks.special}
                />
                <PasswordCheck
                  label="Passwords match"
                  valid={passwordChecks.match}
                />
              </div>
            )}

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

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 mt-0 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
