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
    if (isLoggingIn) return;
    
    setError(null);
    setSuccessMessage(null);

    try {
      await login(formData);
      setSuccessMessage("Login Successful!");
      window.location.href = "/";
    } catch (error) {
      const message = getErrorMessage(error, "Login failed. Please check your connection.");
      setError(message);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#171717] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] bg-[#222124] border border-[#292929] p-8">
        <div className="flex flex-col items-center text-center pb-8">
          <div className='bg-[#383838] p-3 mb-4'>
            <LogIn size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign in with email</h1>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className='relative'>
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
          
          <div className='relative'>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-[#858585]" />
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

          {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
          {successMessage && <p className="text-sm text-green-500 mt-2 text-center">{successMessage}</p>}

          <button 
            className="w-full py-2.5 px-4 mt-6 text-sm font-medium text-white bg-[#171717] hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-blue-500/50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit" 
            disabled={isLoggingIn} 
          >
            {isLoggingIn ? "Logging in..." : "Log in"}
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
    aria-label="Toggle password visibility"
  >
    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);