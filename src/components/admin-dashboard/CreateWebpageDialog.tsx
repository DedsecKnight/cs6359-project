import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from '../ui/label';
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface CreateWebpageDialogProps {
  onSubmit: (url: string, description: string) => Promise<void>;
}

export default function CreateWebpageDialog({ onSubmit }: CreateWebpageDialogProps) {
  const [url, setUrl] = useState<string>("");
  const [description, setDesc] = useState<string>("");
  

  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Add new Webpage</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Webpage</DialogTitle>
        <DialogDescription>
          Create new Webpage. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="url" className="text-right">
            URL
          </Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            type="description"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={async () => {
          await onSubmit(url, description);
          alert("Update successful");
        }}>Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}