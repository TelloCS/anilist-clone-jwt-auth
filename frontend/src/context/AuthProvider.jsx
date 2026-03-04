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

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user || data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user || data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
      window.location.href = "/login/";
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
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
      queryClient.setQueryData(["currentUser"], null);
      window.location.href = "/login/";
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      username: user?.username || "",
      email: user?.email || "",
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