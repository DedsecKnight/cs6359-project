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

interface ModifyBillingAccountDialogProps {
  billingAccountId: number;
  defaultCreditCardNumber: string;
  onSubmit: (id: number, creditCardNumber: string) => Promise<void>;
}

export default function ModifyBillingAccountDialog({
  billingAccountId,
  defaultCreditCardNumber,
  onSubmit,
}: ModifyBillingAccountDialogProps) {
  const [creditCardNumber, setCreditCardNumber] = useState<string>(
    defaultCreditCardNumber,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Modify Billing Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modify Billing Account</DialogTitle>
          <DialogDescription>
            Make changes to billing account info. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Credit Card Number
            </Label>
            <Input
              id="content"
              value={creditCardNumber}
              onChange={(e) => setCreditCardNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              await onSubmit(billingAccountId, creditCardNumber);
              alert("Update successful");
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
