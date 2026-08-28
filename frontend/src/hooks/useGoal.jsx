import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/apiErrors";
import { keepPreviousData } from "@tanstack/react-query";
import { clearClientSession } from "../utils/session";

const API_URL = {
  goals: "/goals",
  isCompleted: "/goals/is-completed",
  isMarkedAsFav: "/goals/is-marked-fav",
};

export const useGoal = () => {
  const queryClient = useQueryClient();
  const handleGoalError = (error) => {
    toast.error(getErrorMessage(error));
    if ([401, 403].includes(error.response?.status)) {
      clearClientSession(queryClient).then(() => window.location.replace("/login"));
    }
  };

  const useGoals = ({ search = "", page = 1, completed, favorite } = {}) =>
    useQuery({
      queryKey: ["goals", { search, page, completed, favorite }],
      queryFn: async () => {
        try {
          const { data } = await api.get(API_URL.goals, {
            params: { search, page, limit: 8, completed, favorite },
          });
          return data;
        } catch (error) {
          toast.error(getErrorMessage(error));
          if ([401, 403].includes(error.response?.status)) {
            await clearClientSession(queryClient);
            window.location.replace("/login");
          }
          throw error;
        }
      },
      retry: false,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      placeholderData: keepPreviousData,
    });

  const useCreateGoal = () =>
    useMutation({
      mutationFn: async (params) => {
        const { title, desc } = params;
        const { data } = await api.post(API_URL.goals, { title, desc });
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        toast.success(data.message || "Goal created");
      },
      onError: (error) => {
        handleGoalError(error);
      },
    });

  const useUpdateGoal = () =>
    useMutation({
      mutationFn: async (params) => {
        const { id, title, desc } = params;
        const { data } = await api.patch(`${API_URL.goals}/${id}`, {
          title,
          desc,
        });
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        toast.success(data.message || "Goal updated");
      },
      onError: handleGoalError,
    });

  const useDeleteGoal = () =>
    useMutation({
      mutationFn: async ({ id }) => {
        const { data } = await api.delete(`${API_URL.goals}/${id}`);
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        toast.success(data.message || "Goal deleted");
      },
      onError: handleGoalError,
    });

  const useToggleGoalCompleted = () =>
    useMutation({
      mutationFn: async ({ id }) => {
        const { data } = await api.post(`${API_URL.isCompleted}/${id}`);
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        toast.success(data.message || "Goal status updated");
      },
      onError: handleGoalError,
    });

  const useToggleGoalFavorite = () =>
    useMutation({
      mutationFn: async ({ id }) => {
        const { data } = await api.post(`${API_URL.isMarkedAsFav}/${id}`);
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        toast.success(data.message || "Favorite status updated");
      },
      onError: handleGoalError,
    });

  return {
    useGoals,
    useCreateGoal,
    useUpdateGoal,
    useDeleteGoal,
    useToggleGoalCompleted,
    useToggleGoalFavorite,
  };
};
