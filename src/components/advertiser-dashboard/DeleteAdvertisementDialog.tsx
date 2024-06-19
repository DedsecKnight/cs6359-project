import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

interface DeleteAdvertisementDialogProps {
  advertisementId: number;
  onSubmit: (id: number) => Promise<void>;
}

export default function DeleteAdvertisementDialog({ advertisementId, onSubmit }: DeleteAdvertisementDialogProps) {
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="destructive">Delete Advertisement</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Advertisement</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the advertisement from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={async () => {
          await onSubmit(advertisementId);
          alert("Delete successful");
        }}>Delete Advertisement</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}