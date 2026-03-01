import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../api/authService";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isLoggedIn = !!user;
  const username = user?.username || "";
  const email = user?.email || "";

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      // Registration usually doesn't log you in immediately with JWT, so we don't set user data here
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
    },
  });

  const login = async (formData) => {
    return await loginMutation.mutateAsync(formData);
  };

  const register = async (formData) => {
    return await registerMutation.mutateAsync(formData);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      console.log("Log out successful!");
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      username,
      email,
      login,
      register,
      handleLogout,
      loading: isLoading,
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;