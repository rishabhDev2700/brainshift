import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataClient } from "../services/api-service";
import type { User } from "../types";
import { toast } from "sonner";

export interface Friendship {
  id: number;
  userId?: number;
  friendId?: number;
  status: "pending" | "accepted" | "blocked";
  friend?: User;
  user?: User;
}



const fetchFriends = async () => {
  const response = await dataClient.get("/friends");
  return response.data;
};

const fetchPendingRequests = async () => {
  const response = await dataClient.get("/friends/pending");
  return response.data;
};

const searchUsers = async (query: string) => {
  const response = await dataClient.get(`/friends/search?query=${query}`);
  return response.data;
};

const sendFriendRequest = async (friendId: number) => {
  const response = await dataClient.post("/friends/request", { friendId });
  return response.data;
};

const acceptFriendRequest = async (friendshipId: number) => {
  const response = await dataClient.put(`/friends/accept/${friendshipId}`);
  return response.data;
};

const rejectFriendRequest = async (friendshipId: number) => {
  const response = await dataClient.delete(`/friends/reject/${friendshipId}`);
  return response.data;
};

const fetchLeaderboard = async () => {
  const response = await dataClient.get("/friends/leaderboard");
  return response.data;
};

export const useFriends = () => {
  const queryClient = useQueryClient();

  const friendsQuery = useQuery<Friendship[]>({ queryKey: ["friends"], queryFn: fetchFriends });

  const pendingRequestsQuery = useQuery<Friendship[]>({ queryKey: ["pending-requests"], queryFn: fetchPendingRequests });

  const searchUsersMutation = useMutation({
    mutationFn: searchUsers,
  });

  const sendFriendRequestMutation = useMutation({ mutationFn: sendFriendRequest, onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["pending-requests"]});
    // TODO: Add toast notification here
  } });

  const acceptFriendRequestMutation = useMutation({ mutationFn: acceptFriendRequest, onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["friends"]});
    queryClient.invalidateQueries({ queryKey: ["pending-requests"]});
    toast.success("Friend request accepted!");
  } });

  const rejectFriendRequestMutation = useMutation({ mutationFn: rejectFriendRequest, onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["pending-requests"]});
    toast.success("Friend request rejected!");
  } });

  const leaderboardQuery = useQuery<any[]>({ queryKey: ["leaderboard"], queryFn: fetchLeaderboard });

  return {
    friendsQuery,
    pendingRequestsQuery,
    searchUsersMutation,
    sendFriendRequestMutation,
    acceptFriendRequestMutation,
    rejectFriendRequestMutation,
    leaderboardQuery,
  };
};