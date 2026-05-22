import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPendingUsers, approveUser, rejectUser } from "../../services/apiServices";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PendingUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["pendingUsers"],
    queryFn: async () => {
      const res = await fetchPendingUsers();
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pendingUsers"] })
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pendingUsers"] })
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Pending User Approvals</h2>
      <Card>
        <CardHeader>
          <CardTitle>Needs Attention</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">Loading pending users...</TableCell>
                </TableRow>
              )}
              {!isLoading && users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">No pending users found.</TableCell>
                </TableRow>
              )}
              {!isLoading && users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => approveMutation.mutate(user.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reject this user?")) {
                          rejectMutation.mutate(user.id);
                        }
                      }}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
