import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorHelpers";
import FormInput from "../components/FormInput";
import { LogIn, Mail, Lock, EyeOff, Eye } from 'lucide-react';

export default function Login() {
  const { login, isLoggingIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoggingIn) {
      return
    }
    setError(null);
    setSuccessMessage(null);

    try {
      await login(formData);
      console.log("Success!");
      setSuccessMessage("Login Successful!");
      // Force a reload to ensure AuthContext picks up the new cookies and fetches user data
      window.location.href = "/";
    }
    catch (error) {
      const message = getErrorMessage(error, "Login failed. Please check your connection.");
      setError(message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center bg-[#171717] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] bg-white border border-neutral-200 p-8 mt-24 rounded-3xl shadow-sm">
        <div className="flex flex-col items-center text-center pb-8">
          <div className='bg-neutral-100 p-3 rounded-2xl mb-4'>
            <LogIn size={28} className="text-neutral-700" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Sign in with email</h1>
        </div>
        <form className="space-y-4">
          <div className='relative'>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail size={18} className="text-neutral-400" />
            </div>
            <FormInput
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className='relative'>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-neutral-400" />
            </div>
            <FormInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <PasswordToggle isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
        </form>
        {error && <p className="text-xs my-2" style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button className="w-full py-2.5 px-4 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 focus:ring-4 focus:outline-none focus:ring-neutral-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          type="submit" disabled={isLoggingIn} onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
}

const PasswordToggle = ({ isVisible, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
  >
    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);