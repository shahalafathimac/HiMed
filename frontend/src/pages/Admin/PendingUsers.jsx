import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPendingUsers,
  approveUser,
  rejectUser,
  fetchAllUsers,
} from "../../services/apiServices";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, XCircle, Users, Store, ShoppingBag } from "lucide-react";

export default function PendingUsers() {
  const queryClient = useQueryClient();

  const { data: pendingUsers = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["pendingUsers"],
    queryFn: async () => {
      const res = await fetchPendingUsers();
      return res.data;
    }
  });

  const { data: allUsers = [], isLoading: allUsersLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await fetchAllUsers();
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    }
  });

  const buyers = allUsers.filter((u) => u.role === "buyer");
  const suppliers = allUsers.filter((u) => u.role === "supplier");

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">User Management</h2>

      {/* ── Pending Approvals ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Pending Approvals
            {pendingUsers.length > 0 && (
              <Badge className="ml-2 bg-amber-100 text-amber-700">
                {pendingUsers.length} waiting
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!pendingLoading && pendingUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No pending users found.
                  </TableCell>
                </TableRow>
              )}
              {!pendingLoading && pendingUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || "—"}</TableCell>
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
                        if (window.confirm("Reject this user?")) {
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

      {/* ── Approved Buyers ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-500" />
            Registered Buyers
            <Badge className="ml-2 bg-blue-100 text-blue-700">
              {buyers.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsersLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!allUsersLoading && buyers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    No buyers registered yet.
                  </TableCell>
                </TableRow>
              )}
              {!allUsersLoading && buyers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || "—"}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">Approved</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Approved Suppliers ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-purple-500" />
            Registered Suppliers
            <Badge className="ml-2 bg-purple-100 text-purple-700">
              {suppliers.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsersLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!allUsersLoading && suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    No suppliers registered yet.
                  </TableCell>
                </TableRow>
              )}
              {!allUsersLoading && suppliers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || "—"}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">Approved</Badge>
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