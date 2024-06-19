import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from '../ui/label';
import { Input } from "../ui/input";

interface ModifyAdvertisementDialogProps {
  advertisementId: number;
  defaultContent: string;
  onSubmit: (id: number, content: string) => Promise<void>;
}

export default function ModifyAdvertisementDialog({ advertisementId, defaultContent, onSubmit }: ModifyAdvertisementDialogProps) {
  const [content, setContent] = useState<string>(defaultContent);

  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Modify Advertisement</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modify Advertisement</DialogTitle>
        <DialogDescription>
          Make changes to advertisement. Click save when you're done.
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
      </div>
      <DialogFooter>
        <Button onClick={async () => {
          await onSubmit(advertisementId, content);
          alert("Update successful");
        }}>Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}