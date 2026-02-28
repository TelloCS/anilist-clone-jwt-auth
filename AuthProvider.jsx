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
      handleLogout,
      loading: isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;