import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from '../ui/label';
import { Input } from "../ui/input";

interface CreateAdvertisementDialogProps {
  onSubmit: (content: string) => Promise<void>;
}

export default function CreateAdvertisementDialog({ onSubmit }: CreateAdvertisementDialogProps) {
  const [content, setContent] = useState<string>("");

  return <Dialog>
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
      </div>
      <DialogFooter>
        <Button onClick={async () => {
          await onSubmit(content);
          alert("Update successful");
        }}>Create Advertisement</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}