import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from '../ui/label';
import { Input } from "../ui/input";

interface ModifyUserDialogProps {
  userId: number;
  defaultUsername: string;
  onSubmit: (id: number, username: string, password: string) => Promise<void>;
}

export default function ModifyUserDialog({ userId, defaultUsername, onSubmit }: ModifyUserDialogProps) {
  const [username, setUsername] = useState<string>(defaultUsername);
  const [password, setPassword] = useState<string>("");

  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Modify User</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modify User</DialogTitle>
        <DialogDescription>
          Make changes to user info. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={async () => {
          await onSubmit(userId, username, password);
          alert("Update successful");
        }}>Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}