import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/apiErrors";
import { clearClientSession } from "../utils/session";

const API_URL = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  getMe: "/auth/me",
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const saveAuthData = (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    queryClient.setQueryData(["me"], data.user || data);
  };

  const useGetMe = () =>
    useQuery({
      queryKey: ["me"],
      queryFn: async () => {
        try {
          const { data } = await api.get(API_URL.getMe);
          return data;
        } catch (error) {
          if (error.response?.status === 401) {
            await clearClientSession(queryClient);
          } else {
            toast.error(getErrorMessage(error));
          }
          throw error;
        }
      },
      retry: false,
      enabled: Boolean(localStorage.getItem("token")),
      refetchOnWindowFocus: false,
      onError: (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          queryClient.removeQueries({ queryKey: ["me"] });
        }
      },
    });

  const useLogin = () =>
    useMutation({
      mutationFn: async (params) => {
        await clearClientSession(queryClient);
        const { username, password } = params;
        const { data } = await api.post(API_URL.login, { username, password });
        return data;
      },
      onSuccess: (data) => {
        saveAuthData(data);
        toast.success(data.message || "Logged in successfully");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });

  const useRegister = () =>
    useMutation({
      mutationFn: async (params) => {
        const { name, username, password, email } = params;
        const { data } = await api.post(API_URL.register, {
          name,
          username,
          password,
          email,
        });
        return data;
      },
      onSuccess: (data) => {
        toast.success(data.message || "Account created successfully");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });

  const useLogout = () =>
    useMutation({
      mutationFn: async () => {
        const { data } = await api.post(API_URL.logout);
        return data;
      },
      onSuccess: () => {
        clearClientSession(queryClient).then(() => {
          toast.success("Logged out successfully");
          window.location.replace("/login");
        });
      },
      onError: (error) => {
        clearClientSession(queryClient).then(() => {
          toast.error(getErrorMessage(error));
          window.location.replace("/login");
        });
      },
    });

  const useForgotPassword = () =>
    useMutation({
      mutationFn: async ({ email }) =>
        (await api.post("/auth/forgot-password", { email })).data,
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const useVerifyEmail = () =>
    useMutation({
      mutationFn: async (params) =>
        (await api.post("/auth/verify-email", params)).data,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        toast.success(data.message || "Email verified successfully");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const useResendVerification = () =>
    useMutation({
      mutationFn: async ({ email }) =>
        (await api.post("/auth/resend-verification", { email })).data,
      onSuccess: (data) =>
        toast.success(data.message || "Verification code sent"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const useRequestVerification = () =>
    useMutation({
      mutationFn: async () =>
        (await api.post("/auth/request-verification")).data,
      onSuccess: (data) =>
        toast.success(data.message || "Verification code sent"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const useResetPassword = () =>
    useMutation({
      mutationFn: async (params) =>
        (await api.post("/auth/reset-password", params)).data,
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const useResendResetPassword = () =>
    useMutation({
      mutationFn: async ({ email }) => (await api.post("/auth/resend-reset-password", { email })).data,
      onSuccess: (data) => toast.success(data.message || "Reset code sent"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const useUpdateProfile = () =>
    useMutation({
      mutationFn: async (params) =>
        (await api.patch("/auth/profile", params)).data,
      onSuccess: (data) => {
        if (data.user) queryClient.setQueryData(["me"], data);
        else queryClient.invalidateQueries({ queryKey: ["me"] });
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const useChangePassword = () =>
    useMutation({
      mutationFn: async (params) =>
        (await api.patch("/auth/change-password", params)).data,
      onSuccess: (data) =>
        toast.success(data.message || "Password changed successfully"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  return {
    useGetMe,
    useLogin,
    useRegister,
    useLogout,
    useForgotPassword,
    useVerifyEmail,
    useResendVerification,
    useRequestVerification,
    useResetPassword,
    useResendResetPassword,
    useUpdateProfile,
    useChangePassword,
  };
};
