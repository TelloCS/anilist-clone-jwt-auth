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

    if (isRegistering) {
      return
    }

    setError(null);
    setSuccessMessage(null);

    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await register(formData);
      console.log("Success!", data)
      setSuccessMessage("Registration Successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login/");
      }, 2000);
    }
    catch (error) {
      const message = getErrorMessage(error, "Registration failed. Please try again.");
      setError(message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center bg-[#171717] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] bg-white border border-neutral-200 p-8 mt-24 rounded-3xl shadow-sm">
        <div className="flex flex-col items-center text-center pb-8">
          <div className='bg-neutral-100 p-3 rounded-2xl mb-4'>
            <UserPlus size={28} className="text-neutral-700" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Create Account</h1>
        </div>
        <form className="space-y-4">
          <div className='relative'>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail size={18} className="text-neutral-400" />
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
              <User size={18} className="text-neutral-400" />
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
              <Lock size={18} className="text-neutral-400" />
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
              <Lock size={18} className="text-neutral-400" />
            </div>
            <FormInput
              type={showPassword ? 'text' : 'password'}
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-xs my-2" style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 focus:ring-4 focus:outline-none focus:ring-neutral-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            type="submit" disabled={isRegistering} onClick={handleSubmit}>
            Register
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
    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
  >
    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);