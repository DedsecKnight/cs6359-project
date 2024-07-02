import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SearchPageProps {
  searchTerm: string;
  searchResult: Array<{
    url: string;
    description: string;
  }>;
  pageNumber: number;
  query: string;
  type: string;
  numPages: number;
}

export default function SearchPage({ searchTerm, searchResult, pageNumber, query, type, numPages }: SearchPageProps) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const redirectToPage = (newPageNumber: number) => {
    const urlParams = new URLSearchParams();
    urlParams.set("value", query);
    urlParams.set("type", type);
    urlParams.set("page", newPageNumber.toString());
    router.push(`/search?${urlParams.toString()}`);
  }

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
    <Pagination>
      <PaginationContent>
        {pageNumber > 1 && <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => redirectToPage(Math.max(pageNumber - 1, 1))}
          />
        </PaginationItem>}
        <PaginationItem>
          <PaginationLink>{pageNumber}</PaginationLink>
        </PaginationItem>
        {pageNumber < numPages && <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => redirectToPage(pageNumber + 1)}
          />
        </PaginationItem>}
      </PaginationContent>
    </Pagination>
  </div>
  
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const protocol = ctx.req.headers.referer?.split('://')[0] || 'http';
  const urlParams = new URLSearchParams();
  const pageNumber = (ctx.query.page as string | undefined) || "1";
  urlParams.set("query", ctx.query.value! as string);
  urlParams.set("type", ctx.query.type! as string);
  urlParams.set("page", pageNumber);
  const res = await fetch(`${protocol}://${ctx.req.headers.host}/api/search?${urlParams.toString()}`, {
    method: "GET",
  })
  const data = await res.json();
  return {
    props: {
      searchTerm: ctx.query.value!,
      searchResult: data.searchResult,
      pageNumber: parseInt(pageNumber),
      query: urlParams.get("query")!,
      type: urlParams.get("type")!,
      numPages: data.numPages
    }
  }
}