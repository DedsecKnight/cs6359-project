import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GetServerSideProps } from 'next';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';

const FormSchema = z.object({
  searchTerm: z.string({ required_error: "Search term is required" }).default(""),
  queryType: z.union([z.literal("and"), z.literal("or"), z.literal("not")])
})

interface HomePageProps {
  tagList: Array<{ id: number; tag: string }>;
}

export default function Home({ tagList }: HomePageProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchTerm: "",
    }
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
              render={({ field }) => (<FormItem>
                  <FormLabel></FormLabel>
                <Command className="rounded-lg border shadow-md">
                  <FormControl>
                    <CommandInput value={field.value} onValueChange={field.onChange} placeholder="Enter search term here" />
                  </FormControl>
                  <CommandList>
                    {field.value.length > 0 && (
                      <CommandGroup>
                        {tagList.map((tag, idx) => (
                          <div key={idx} onClick={() => form.setValue("searchTerm", tag.tag)}>
                            <CommandItem>
                              <span>{tag.tag}</span>
                            </CommandItem>
                          </div>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const protocol = ctx.req.headers.referer?.split('://')[0] || 'http';
  const res = await fetch(`${protocol}://${ctx.req.headers.host}/api/autofill`, {
    method: "GET",
  });
  const data = await res.json();
  return {
    props: {
      tagList: data.autofillKeywords
    }
  }
}