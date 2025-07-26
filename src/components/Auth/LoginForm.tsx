import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Eye,
  EyeOff,
  Users,
  GraduationCap,
  UserCheck,
  Shield,
  Bus,
} from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: "Student",
      email: "student@college.edu",
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      role: "Faculty",
      email: "faculty@college.edu",
      icon: Users,
      color: "bg-green-500",
    },
    {
      role: "Admin",
      email: "admin@college.edu",
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      role: "Staff",
      email: "staff@college.edu",
      icon: UserCheck,
      color: "bg-orange-500",
    },
    {
      role: "Transport",
      email: "transport@college.edu",
      icon: Bus,
      color: "bg-indigo-500",
    },
  ];

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Campus Management Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your comprehensive platform for campus services and resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              {onSwitchToRegister && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={onSwitchToRegister}
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      Create a new account
                    </button>
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Demo Accounts */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Demo Accounts
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Try different user roles to explore the system. Password:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">password123</code>
            </p>

            <div className="space-y-3">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.role}
                    onClick={() => handleDemoLogin(account.email)}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                  >
                    <div
                      className={`w-10 h-10 ${account.color} rounded-full flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">
                        {account.role}
                      </p>
                      <p className="text-sm text-gray-500">{account.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Campus Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
