import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationRead,
} from "../services/apiServices";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: notificationsLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  // Debug API response
  console.log("NOTIFICATIONS API RESPONSE:", data);

  // Always ensure notifications is an array
  const notifications = Array.isArray(data)
    ? data
    : Array.isArray(data?.notifications)
    ? data.notifications
    : Array.isArray(data?.results)
    ? data.results
    : [];

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  return {
    // Notification data
    notifications,

    // Unread count
    unreadCount: notifications.filter(
      (notification) => !notification.is_read
    ).length,

    // Loading state
    notificationsLoading,

    // Error state
    notificationsError: error,

    // Actions
    markAsRead: markAsReadMutation.mutate,

    isMarkingAsRead:
      markAsReadMutation.isPending,
  };
};

export default useNotifications;