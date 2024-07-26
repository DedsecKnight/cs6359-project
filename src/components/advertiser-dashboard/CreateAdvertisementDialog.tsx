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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CreateAdvertisementDialogProps {
  tierList: Array<{
    id: number;
    tierName: string;
    tierPrice: number;
  }>;
  billingAccounts: Array<{
    id: number;
    creditCardNumber: string;
  }>;
  onSubmit: (
    content: string,
    tierInfo: {
      id: number;
      tierName: string;
      tierPrice: number;
    },
    billingAccount: {
      id: number;
      creditCardNumber: string;
    },
  ) => Promise<void>;
}

export default function CreateAdvertisementDialog({
  onSubmit,
  tierList,
  billingAccounts,
}: CreateAdvertisementDialogProps) {
  const [content, setContent] = useState<string>("");
  const [currentTier, setCurrentTier] = useState<string | undefined>(undefined);
  const [currentBillingAccount, setCurrentBillingAccount] = useState<
    string | undefined
  >(undefined);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new advertisement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Advertisement</DialogTitle>
          <DialogDescription>
            Create new advertisement. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tier" className="text-right">
              Tier
            </Label>
            <div id="tier">
              <Select
                value={currentTier}
                onValueChange={(value) => {
                  setCurrentTier(value);
                  setCurrentPrice(
                    tierList.filter((tier) => tier.tierName === value)[0]
                      .tierPrice,
                  );
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tier</SelectLabel>
                    {tierList.map((tier, idx) => (
                      <SelectItem key={idx} value={tier.tierName}>
                        {tier.tierName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="billing" className="text-right">
              Billing Account
            </Label>
            <div id="billing">
              <Select
                value={currentBillingAccount}
                onValueChange={(value) => setCurrentBillingAccount(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Billing Account</SelectLabel>
                    {billingAccounts.map((account, idx) => (
                      <SelectItem key={idx} value={account.creditCardNumber}>
                        {account.creditCardNumber}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mx-auto">
            <Label className="text-right">Total: ${currentPrice}</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              const tierObj = tierList.filter(
                (tier) => tier.tierName === currentTier,
              )[0];
              const billingAccountObj = billingAccounts.filter(
                (account) => account.creditCardNumber === currentBillingAccount,
              )[0];
              await onSubmit(content, tierObj, billingAccountObj);
              alert("Update successful");
            }}
          >
            Create Advertisement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
