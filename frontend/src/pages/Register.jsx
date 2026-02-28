import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorHelpers";
import FormInput from "../components/FormInput";

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
        navigate("/login");
      }, 2000);
    }
    catch (error) {
      const message = getErrorMessage(error, "Registration failed. Please try again.");
      setError(message);
    }
  };
  return (
    <div className="flex justify-center pt-16 bg-[#0D1821]">
      <div className="w-full max-w-3xl rounded-md bg-[#0D1821] p-12 border border-gray-700 text-white">
        <h2 className="text-3xl font-bold text-center pb-4">Register your account</h2>
        <form className="flex flex-col max-w-sm m-auto">
          <FormInput
            label="Username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <FormInput
            label="Email address"
            type="email"
            name="email"
            placeholder="name@domain.com"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            type="password"
            name="password1"
            placeholder="Password"
            value={formData.password1}
            onChange={handleChange}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button className="mt-3 rounded-3xl bg-[#73E2A7] font-bold cursor-pointer p-3" type="submit" disabled={isRegistering} onClick={handleSubmit}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}