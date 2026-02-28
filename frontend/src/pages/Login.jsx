import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorHelpers";
import FormInput from "../components/FormInput";

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

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
      navigate("/");
    }
    catch (error) {
      const message = getErrorMessage(error, "Login failed. Please check your connection.");
      setError(message);
    }
  };
  return (
    <div className="flex justify-center pt-16 bg-[#0D1821]">
      <div className="w-full max-w-3xl rounded-md bg-[#0D1821] p-12 border border-gray-700 text-white">
        <h2 className="text-3xl font-bold text-center pb-4">Log in to account</h2>
        <form className="flex flex-col max-w-sm m-auto">
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
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button className="mt-3 rounded-3xl bg-[#73E2A7] font-bold cursor-pointer p-3" type="submit" disabled={isLoggingIn} onClick={handleSubmit}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}