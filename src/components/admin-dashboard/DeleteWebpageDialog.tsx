import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

interface DeleteWebpageDialogProps {
  urlId: number;
  onSubmit: (urlId: number) => Promise<void>;
}

export default function DeleteWebpageDialog({ urlId, onSubmit }: DeleteWebpageDialogProps) {
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="destructive">Delete Webpage</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Webpage</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the webpage data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={async () => {
          await onSubmit(urlId);
          alert("Delete successful");
        }}>Delete Webpage</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}