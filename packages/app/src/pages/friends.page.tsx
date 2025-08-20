import { Link } from "react-router-dom";
import { useFriends } from "../hooks/useFriends";
import type { User } from "../types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FriendsLayout } from "@/components/friends-layout";

const FriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { friendsQuery, pendingRequestsQuery, searchUsersMutation, sendFriendRequestMutation, acceptFriendRequestMutation, rejectFriendRequestMutation } = useFriends();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      const results = await searchUsersMutation.mutateAsync(e.target.value);
      setSearchResults(results);
    }
  };

  return (
    <FriendsLayout>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>My Friends</CardTitle>
              </CardHeader>
              <CardContent>
                {friendsQuery.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : friendsQuery.isError ? (
                  <p>Error loading friends.</p>
                ) : (
                  friendsQuery.data && friendsQuery.data.map((friendship) => (
                    <div key={friendship.id} className="flex items-center justify-between p-2">
                      <Link to={`/dashboard/profile/${friendship.friend?.id}`} className="hover:underline">
                        <p>{friendship.friend?.fullName}</p>
                      </Link>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequestsQuery.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : pendingRequestsQuery.isError ? (
                  <p>Error loading requests.</p>
                ) : (
                  pendingRequestsQuery.data && pendingRequestsQuery.data.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-2">
                      <p>{request.user?.fullName}</p>
                      <div>
                        <Button onClick={() => acceptFriendRequestMutation.mutate(request.id)} size="sm" className="mr-2 bg-emerald-600 hover:bg-emerald-700">Accept</Button>
                        <Button onClick={() => rejectFriendRequestMutation.mutate(request.id)} size="sm" variant="destructive">Reject</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Find Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input type="text" placeholder="Search by email or name" value={searchQuery} onChange={handleSearch} onFocus={() => setIsInputFocused(true)} onBlur={() => setTimeout(() => setIsInputFocused(false), 200)} />
              </div>
              {isInputFocused && (
                searchUsersMutation.isPending ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : searchUsersMutation.isError ? (
                  <p>Error searching users.</p>
                ) : (
                  searchResults && searchResults.map((user:User) => (
                    <div key={user.id} className="flex items-center justify-between p-2">
                      <Link to={`/profile/${user.id}`} className="hover:underline">
                        <div>
                          <p className="font-bold">{user.fullName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </Link>
                      <Button onClick={() => sendFriendRequestMutation.mutate(user.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-700">Send Request</Button>
                    </div>
                  ))
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FriendsLayout>
  );
};

export default FriendsPage;
