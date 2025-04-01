import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Lock } from "lucide-react"; // Import các icon cần dùng
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { toast } from "react-hot-toast"; // Import react-hot-toast

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { signUp, isSigningUp } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Full Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signUp(formData)
        .then(() => {
          toast.success("Sign-up successful! Welcome aboard.");
        })
        .catch((error) => {
          toast.error(error.message || "Sign-up failed. Please try again.");
        });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Image or Illustration */}
      <AuthImagePattern
        title="Welcome to Our App"
        subtitile="Join us and explore the amazing features we offer."
      />

      {/* Right Side: Sign Up Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-6">Sign Up</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto mb-4 text-yellow-500 animate-custom transition-transform duration-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <label className="floating-label relative">
              <span>Full Name</span>
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="input validator input-md w-full pl-12"
                required
                title="Full Name is required"
              />
              <p className="validator-hint">Full Name is required</p>
            </label>

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
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
              <p className="validator-hint">
                Must be more than 6 characters, including
              </p>
            </label>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isSigningUp ? "loading" : ""
                }`}
                disabled={isSigningUp}
              >
                {isSigningUp ? "Signing Up..." : "Register"}
              </button>
            </div>
          </form>

          {/* Already have an account */}
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
