import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface SearchPageProps {
  searchTerm: string;
  searchResult: Array<{
    id: number;
    url: string;
    description: string;
  }>;
  pageNumber: number;
  query: string;
  type: string;
  numPages: number;
  sortOrder: "alphabet" | "numAccess";
}

export default function SearchPage({
  searchTerm,
  searchResult: initSearchResult,
  pageNumber,
  query,
  type,
  sortOrder,
  numPages,
}: SearchPageProps) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [searchResultOrder, setSearchResultOrder] = useState<
    "alphabet" | "numAccess"
  >(sortOrder);
  const redirectToPage = (newPageNumber: number) => {
    const urlParams = new URLSearchParams();
    urlParams.set("value", query);
    urlParams.set("type", type);
    urlParams.set("page", newPageNumber.toString());
    urlParams.set("order", searchResultOrder);
    router.push(`/search?${urlParams.toString()}`);
  };
  const [searchResult, setSearchResult] =
    useState<typeof initSearchResult>(initSearchResult);

  const handlePageAccess = (pageData: (typeof initSearchResult)[0]) => {
    fetch("/api/access", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        pageId: pageData.id,
      }),
    })
      .then(async (res) => {
        if (res.status >= 500) throw new Error("Internal Server Error");
        router.push(pageData.url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams();
    urlParams.set("query", query);
    urlParams.set("type", type);
    urlParams.set("page", pageNumber.toString());
    urlParams.set("order", searchResultOrder);
    fetch(`/api/search?${urlParams.toString()}`, {
      method: "GET",
    })
      .then(async (res) => {
        const data = await res.json();
        setSearchResult(data.searchResult);
      })
      .catch((err) => {
        console.error(err);
        alert("Internal Server Error. Please try again later...");
      });
  }, [searchResultOrder]);

  if (status === "loading") return <LoadingSpinner />;
  return (
    <div className="mx-auto w-full relative">
      <Navbar
        userAuthenticated={status === "authenticated"}
        userIsAdmin={
          session?.user.role !== undefined && session.user.role === "admin"
        }
      />
      <h1 className="text-xl my-3">
        Search result for <span className="font-bold">{searchTerm}</span>
      </h1>
      <Select
        value={searchResultOrder}
        onValueChange={(newSearchOrder) =>
          setSearchResultOrder(newSearchOrder as typeof searchResultOrder)
        }
      >
        <SelectTrigger className="w-[260px]">
          <SelectValue placeholder="Sort result by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="alphabet">
              Sort result by Alphabetical Order
            </SelectItem>
            <SelectItem value="numAccess">
              Sort result by Popularity order
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex flex-col items-center my-8">
        {searchResult.length === 0 ? (
          <div className="w-full">
            <h1 className="text-xl">No result found</h1>
          </div>
        ) : (
          searchResult.map((result, idx) => (
            <div key={idx} className="border rounded-lg w-full p-4 my-3">
              <h1 className="text-lg">
                <span className="font-bold">URL: </span>
                <Link href={result.url} passHref>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageAccess(result);
                    }}
                    variant="link"
                    className="text-lg"
                  >
                    {result.url}
                  </Button>
                </Link>
              </h1>
              <h1 className="text-lg">
                <span className="font-bold">Description: </span>
                {result.description}
              </h1>
            </div>
          ))
        )}
      </div>
      <Button variant="outline" onClick={() => router.push("/")}>
        Go back to search
      </Button>
      <Pagination>
        <PaginationContent>
          {pageNumber > 1 && (
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => redirectToPage(Math.max(pageNumber - 1, 1))}
              />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink>{pageNumber}</PaginationLink>
          </PaginationItem>
          {pageNumber < numPages && (
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => redirectToPage(pageNumber + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const protocol = ctx.req.headers.referer?.split("://")[0] || "http";
  const urlParams = new URLSearchParams();
  const pageNumber = (ctx.query.page as string | undefined) || "1";
  const sortOrder = (ctx.query.order as string | undefined) || "alphabet";
  urlParams.set("query", ctx.query.value! as string);
  urlParams.set("type", ctx.query.type! as string);
  urlParams.set("page", pageNumber);
  urlParams.set("order", sortOrder);
  const res = await fetch(
    `${protocol}://${ctx.req.headers.host}/api/search?${urlParams.toString()}`,
    {
      method: "GET",
    },
  );
  const data = await res.json();
  return {
    props: {
      searchTerm: ctx.query.value!,
      searchResult: data.searchResult,
      pageNumber: parseInt(pageNumber),
      query: urlParams.get("query")!,
      type: urlParams.get("type")!,
      numPages: data.numPages,
      sortOrder,
    },
  };
};
