import { useState } from "react";
import { User, Mail, Phone, Shield, Edit2, Save, X } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";

export default function BuyerProfile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  });

  const handleSave = () => {
    updateUser(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your buyer profile details.</p>
      </div>

      {/* Avatar + Name Banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-3xl font-bold uppercase flex-shrink-0">
              {user?.username?.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user?.username}
              </h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <Badge className="mt-2 uppercase">{user?.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Account Details</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-slate-500">
              <User className="h-4 w-4" /> Username
            </Label>
            {isEditing ? (
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-white pl-1">
                {user?.username || "—"}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-slate-500">
              <Mail className="h-4 w-4" /> Email
            </Label>
            {isEditing ? (
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-white pl-1">
                {user?.email || "—"}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-slate-500">
              <Phone className="h-4 w-4" /> Phone Number
            </Label>
            {isEditing ? (
              <Input
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              />
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-white pl-1">
                {user?.phone_number || "—"}
              </p>
            )}
          </div>

          {/* Role (read-only) */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-slate-500">
              <Shield className="h-4 w-4" /> Role
            </Label>
            <p className="text-sm font-medium text-slate-900 dark:text-white pl-1 capitalize">
              {user?.role || "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}