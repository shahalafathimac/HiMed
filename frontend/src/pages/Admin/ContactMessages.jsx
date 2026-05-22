import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchContactMessages, replyContactMessage, resolveContactMessage } from "../../services/apiServices";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function ContactMessages() {
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState({});

  const { data: messages, isLoading } = useQuery({
    queryKey: ["adminMessages"],
    queryFn: async () => {
      const res = await fetchContactMessages();
      return res.data;
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }) => replyContactMessage(id, { reply }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      setReplyText(prev => ({ ...prev, [variables.id]: "" }));
    }
  });

  const resolveMutation = useMutation({
    mutationFn: (id) => resolveContactMessage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMessages"] })
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Support Messages</h2>
      
      {isLoading && <div className="text-center py-12 text-slate-500">Loading messages...</div>}
      
      {!isLoading && messages?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>No messages require attention.</CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {!isLoading && messages?.map(msg => (
          <Card key={msg.id} className={msg.status === 'resolved' ? 'opacity-70' : 'border-l-4 border-l-primary'}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-xl">{msg.subject}</CardTitle>
                <CardDescription className="mt-1">From: <span className="font-medium text-slate-700 dark:text-slate-300">{msg.name}</span> ({msg.email})</CardDescription>
              </div>
              <Badge variant={msg.status === 'resolved' ? 'success' : 'secondary'} className="uppercase">
                {msg.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">
                {msg.message}
              </div>

              {msg.admin_reply && (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-sm text-primary-900 mb-4">
                  <span className="font-semibold block mb-1">Your Reply:</span>
                  <span className="whitespace-pre-wrap">{msg.admin_reply}</span>
                </div>
              )}

              {msg.status !== 'resolved' && (
                <div className="mt-4 space-y-4">
                  <textarea 
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    rows={3}
                    placeholder="Write a reply to the user..."
                    value={replyText[msg.id] || ""}
                    onChange={(e) => setReplyText({...replyText, [msg.id]: e.target.value})}
                  />
                  <div className="flex space-x-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => replyMutation.mutate({ id: msg.id, reply: replyText[msg.id] })}
                      disabled={!replyText[msg.id] || replyMutation.isPending}
                    >
                      {replyMutation.isPending && replyMutation.variables?.id === msg.id ? "Sending..." : "Send Reply"}
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => resolveMutation.mutate(msg.id)}
                      disabled={resolveMutation.isPending}
                    >
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
