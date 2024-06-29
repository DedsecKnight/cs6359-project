import { Input } from '@/components/ui/input'
import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const FormSchema = z.object({
  searchTerm: z.string({ required_error: "Search term is required" }),
  queryType: z.union([z.literal("and"), z.literal("or"), z.literal("not")])
})

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams();
    params.set("value", data.searchTerm);
    params.set("type", data.queryType);
    router.push(`/search?${params.toString()}`);
  }

  const router = useRouter();
  const { data: session, status } = useSession();
  return (
    <div className="mx-auto w-full relative">
      <Navbar userAuthenticated={status === "authenticated"} userIsAdmin={session?.user.role === "admin"} />
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col justify-between gap-y-2 mb-6">
            <h1 className="text-3xl mb-3">Welcome to Cyberminer</h1>
            <FormField
              control={form.control}
              name="queryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query Type</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select search type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Query Type</SelectLabel>
                        <SelectItem value="and">AND</SelectItem>
                        <SelectItem value="or">OR</SelectItem>
                        <SelectItem value="not">NOT</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter search term here'
                      className='w-full my-8 rounded-xl h-[50px]'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Search</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
