import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const { isLoggingIn, login } = useAuthStore();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prevData) => ({ ...prevData, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        await login(formData);
      } catch (error) {
        toast.error(error.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Image or Illustration */}
      <AuthImagePattern
        title="Welcome Back"
        subtitile="Log in to continue and explore amazing features."
      />

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-6">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <label className="floating-label relative">
              <span>Email</span>
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="input validator input-md w-full pl-12"
                required
                title="Must be a valid email address"
              />
              <p className="validator-hint">Must be a valid email address</p>
            </label>

            {/* Password */}
            <label className="floating-label relative">
              <span>Password</span>
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="input validator input-md w-full pl-12"
                required
                minlength="6"
                title="Must be at least 6 characters"
              />
              <p className="validator-hint">Must be at least 6 characters</p>
            </label>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="checkbox checkbox-primary"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isLoggingIn ? "loading" : ""
                }`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging In..." : "Log In"}
              </button>
            </div>
          </form>

          {/* Don't have an account */}
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
