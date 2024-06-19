import { Input } from '@/components/ui/input'
import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  return (
    <div className="mx-auto w-full">
      <div className="w-full flex flex-col justify-between">
        <h1 className="text-3xl">Welcome to Cyberminer</h1>
        <Input className='w-full my-8 rounded-xl' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <Button onClick={() => {
        const params = new URLSearchParams();
        params.set("value", searchTerm);
        router.push(`/search?${params.toString()}`);
      }}>Search</Button>
    </div>
  );
}
