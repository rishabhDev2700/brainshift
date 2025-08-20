
import { useFriends } from "../hooks/useFriends";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const Leaderboard = () => {
  const { leaderboardQuery } = useFriends();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-emerald-600">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboardQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : leaderboardQuery.isError ? (
          <p>Error loading leaderboard.</p>
        ) : (
          leaderboardQuery.data && (
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left bg-emerald-600 text-white p-2 rounded-tl-md">Rank</TableHead>
                    <TableHead className="text-left bg-emerald-600 text-white p-2">User</TableHead>
                    <TableHead className="text-left bg-emerald-600 text-white p-2">Goals Completed</TableHead>
                    <TableHead className="text-left bg-emerald-600 text-white p-2">Tasks Completed</TableHead>
                    <TableHead className="text-left bg-emerald-700 text-white p-2 rounded-tr-md">Time Spent (minutes)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardQuery.data.map((user, index) => (
                    <TableRow key={user.userId} className="border-b last:border-b-0">
                      <TableCell className="p-2">{index + 1}</TableCell>
                      <TableCell className="p-2">{user.fullName}</TableCell>
                      <TableCell className="p-2">{user.goalsCompleted}</TableCell>
                      <TableCell className="p-2">{user.tasksCompleted}</TableCell>
                      <TableCell className="p-2 font-bold text-emerald-600">{user.timeSpent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;