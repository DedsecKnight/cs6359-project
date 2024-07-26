import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface DeleteBillingAccountDialogProps {
  billingAccountId: number;
  onSubmit: (id: number) => Promise<void>;
}

export default function DeleteBillingAccountDialog({
  billingAccountId,
  onSubmit,
}: DeleteBillingAccountDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Billing Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Billing Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            billing account from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={async () => {
              await onSubmit(billingAccountId);
              alert("Delete successful");
            }}
          >
            Delete Billing Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
