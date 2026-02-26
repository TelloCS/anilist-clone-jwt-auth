import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Login() {
	const { setLoggedIn, setUsername, setEmail } = useAuth();
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
	const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null)
	
    const handleSubmit = async (e) => {
		e.preventDefault();
        if (isLoading) {
            return
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", formData);
            console.log("Success!", response.data);
            setSuccessMessage("Login Successful!");
			localStorage.clear();
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);

			setLoggedIn(true);
			setUsername(response.data.username)
			setEmail(response.data.email)
			navigate("/");
        }
        catch(error) {
            console.log("Error during login!", error.response?.data);
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach(field => {
                    const errorMessages = error.response.data[field];
                    if (errorMessages && errorMessages.length > 0) {
                        setError(errorMessages[0]);
                    }
                })
            }
        }
        finally {
            setIsLoading(false)
        }

	};
	return (
		<div className="flex justify-center pt-16 bg-[#0D1821]">
			<div className="w-full max-w-3xl rounded-md bg-[#0D1821] p-12 border border-gray-700 text-white">
				<h2 className="text-3xl font-bold text-center pb-4">Log in to account</h2>
				<form className="flex flex-col max-w-sm m-auto">
					<label className="text-sm font-bold">Email address</label>
					<input
						className="mb-3 p-2 rounded-md border-2 border-gray-700 focus:outline-none"
						type="email"
						name="email"
						placeholder="name@domain.com"
						value={formData.email}
						onChange={handleChange}
					></input>{" "}
					<label className="text-sm font-bold">Password</label>
					<input
						className="mb-3 p-2 rounded-md border-2 border-gray-700 focus:outline-none"
						type="password"
						name="password"
						placeholder="Password"
						value={formData.password}
						onChange={handleChange}
					></input>{" "}
					{error && <p style={{color:"red"}}>{error}</p>}
					{successMessage && <p style={{color:"green"}}>{successMessage}</p>}
					<button className="mt-3 rounded-3xl bg-[#73E2A7] font-bold cursor-pointer p-3" type="submit" disabled={isLoading} onClick={handleSubmit}>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}