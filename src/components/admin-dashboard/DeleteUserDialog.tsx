import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

interface DeleteUserDialogProps {
  userId: number;
  onSubmit: (id: number) => Promise<void>;
}

export default function DeleteUserDialog({ userId, onSubmit }: DeleteUserDialogProps) {
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="destructive">Delete User</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={async () => {
          await onSubmit(userId);
          alert("Delete successful");
        }}>Delete User</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}