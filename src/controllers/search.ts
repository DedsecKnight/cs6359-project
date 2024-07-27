import { db } from "@/db/db";
import {
  advertisementTable,
  advertisementTierTable,
  webTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSearchResult(
  searchTerms: string[],
  queryType: string,
  pageNumber: number,
  searchOrder: string,
) {
  const webpages = await db.select().from(webTable);
  const numResultPerPage = parseInt(process.env.SEARCH_RESULT_PER_PAGE!);
  const numPages = Math.ceil(webpages.length / numResultPerPage);
  const filteredWebpages = webpages.filter((webpage) => {
    if (queryType === "or") {
      return webpage.description
        .split(" ")
        .some((keyword) => searchTerms.indexOf(keyword) !== -1);
    }
    const parsedDescription = webpage.description.split(" ");
    if (queryType === "and") {
      return searchTerms.every(
        (term) => parsedDescription.indexOf(term) !== -1,
      );
    }
    return searchTerms.every((term) => parsedDescription.indexOf(term) === -1);
  });
  const advertisements = await db
    .select({
      content: advertisementTable.content,
    })
    .from(advertisementTable)
    .innerJoin(
      advertisementTierTable,
      eq(advertisementTable.advertisementTierId, advertisementTierTable.id),
    )
    .orderBy(advertisementTierTable.tierRank);
  return {
    searchResult: filteredWebpages
      .sort((a, b) =>
        searchOrder === "alphabet"
          ? a.url > b.url
            ? 1
            : b.url > a.url
              ? -1
              : 0
          : b.numAccessed - a.numAccessed,
      )
      .splice((pageNumber - 1) * numResultPerPage, numResultPerPage),
    numPages,
    advertisements,
  };
}
