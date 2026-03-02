import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorHelpers";
import FormInput from "../components/FormInput";
import { UserPlus, User, Mail, Lock, EyeOff, Eye } from 'lucide-react';

export default function Register() {
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) return;

    setError(null);
    setSuccessMessage(null);

    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(formData);
      setSuccessMessage("Registration Successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login/");
      }, 2000);
    } catch (error) {
      const message = getErrorMessage(error, "Registration failed. Please try again.");
      setError(message);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#171717] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] bg-[#222124] border border-[#292929] p-8">
        <div className="flex flex-col items-center text-center pb-8">
          <div className='bg-[#383838] p-3 mb-4'>
            <UserPlus size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className='relative'>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User size={18} className="text-[#858585]" />
            </div>
            <FormInput
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail size={18} className="text-[#858585]" />
            </div>
            <FormInput
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-[#858585]" />
            </div>
            <FormInput
              type={showPassword ? 'text' : 'password'}
              name="password1"
              placeholder="Password"
              value={formData.password1}
              onChange={handleChange}
            />
            <PasswordToggle isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-[#858585]" />
            </div>
            <FormInput
              type={showPassword ? 'text' : 'password'}
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
          {successMessage && <p className="text-sm text-green-500 mt-2 text-center">{successMessage}</p>}

          <button
            className="w-full py-2.5 px-4 mt-6 text-sm font-medium text-white bg-[#171717] hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-blue-500/50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit" 
            disabled={isRegistering}
          >
            {isRegistering ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

const PasswordToggle = ({ isVisible, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#858585] hover:text-white transition-colors"
  >
    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);