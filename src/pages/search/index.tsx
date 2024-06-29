import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SearchPageProps {
  searchTerm: string;
  searchResult: Array<{
    url: string;
    description: string;
  }>
}

export default function SearchPage({ searchTerm, searchResult }: SearchPageProps) {
  const router = useRouter();
  const { status, data: session } = useSession();
  if (status === "loading") return <LoadingSpinner />;
  return <div className="mx-auto w-full relative">
    <Navbar userAuthenticated={status === "authenticated"} userIsAdmin={session?.user.role !== undefined && session.user.role === "admin"} />
    <h1 className="text-xl">Search result for <span className="font-bold">{searchTerm}</span></h1>
    <div className="flex flex-col items-center my-8">
      {searchResult.length === 0 ? (
        <div className="w-full">
          <h1 className="text-xl">No result found</h1>
        </div>
      ) : searchResult.map((result, idx) => (
        <div key={idx} className="border rounded-lg w-full p-4 my-3">
          <h1 className="text-lg">
            <span className="font-bold">URL: </span>
            <Link href={result.url} passHref><Button variant="link" className="text-lg">{result.url}</Button></Link>
          </h1>
          <h1 className="text-lg"><span className="font-bold">Description: </span>{result.description}</h1>
        </div>
      ))}
    </div>
    <Button variant="outline" onClick={() => router.push("/")}>Go back to search</Button>
  </div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const protocol = ctx.req.headers.referer?.split('://')[0] || 'http';
  const urlParams = new URLSearchParams();
  urlParams.set("query", ctx.query.value! as string);
  urlParams.set("type", ctx.query.type! as string);
  const res = await fetch(`${protocol}://${ctx.req.headers.host}/api/search?${urlParams.toString()}`, {
    method: "GET",
  })
  const data = await res.json();
  return {
    props: {
      searchTerm: ctx.query.value!,
      searchResult: data.searchResult
    }
  }
}