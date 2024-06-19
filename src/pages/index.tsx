import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <div className="mx-auto w-full flex flex-col justify-between">
      <h1 className="text-3xl">Welcome to Cyberminer</h1>
      <Input className='w-full my-8 rounded-xl' />
    </div> 
  );
}
