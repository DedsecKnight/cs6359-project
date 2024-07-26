import { useState } from "react";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface CreateAdvertisementDialogProps {
  onSubmit: (creditCardNumber: string) => Promise<void>;
}

export default function CreateAdvertisementDialog({
  onSubmit,
}: CreateAdvertisementDialogProps) {
  const [creditCardNumber, setCreditCardNumber] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new billing account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new Billing Account</DialogTitle>
          <DialogDescription>
            Add a new billing account. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="creditcardno" className="text-right">
              Credit Card Number
            </Label>
            <Input
              id="creditcardno"
              value={creditCardNumber}
              onChange={(e) => setCreditCardNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              await onSubmit(creditCardNumber);
              alert("Update successful");
            }}
          >
            Create Billing Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
