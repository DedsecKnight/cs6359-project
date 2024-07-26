import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from '../ui/label';
import { Input } from "../ui/input";

interface ModifyWebpageDialogProps {
  urlId: number;
  defaultUrl: string;
  defaultDesc: string;
  defaultTags: string;
  onSubmit: (urlId: number, url: string, description: string, tags: string) => Promise<void>;
}

export default function ModifyWebpageDialog({ urlId, defaultUrl, defaultDesc, defaultTags, onSubmit }: ModifyWebpageDialogProps) {
  const [url, setUrl] = useState<string>(defaultUrl);
  const [description, setDesc] = useState<string>(defaultDesc);
  const [tags, setTags] = useState<string>(defaultTags)

  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Modify</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modify Webpage</DialogTitle>
        <DialogDescription>
          Make changes to webpage info. Click save when you&apos;re done.
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tags" className="text-right">
            Tags
          </Label>
          <Input
            id="tags"
            type="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={async () => {
          await onSubmit(urlId, url, description, tags);
          alert("Update successful");
        }}>Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

}