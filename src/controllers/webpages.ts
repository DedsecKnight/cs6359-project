import { db } from "@/db/db";
import { tagTable, webTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export function validateURL(url: string) {
  const regExpMatcher = new RegExp(
    "^(http://|https://)?(www.)?([a-zA-Z0-9_.-]*)(.)(edu|com|org|net|gov)$",
  );
  return regExpMatcher.test(url);
}

export async function incrementNumAccessOfPage(pageId: number) {
  const webPage = await db
    .select({ numAccessed: webTable.numAccessed })
    .from(webTable)
    .where(eq(webTable.id, pageId))
    .limit(1);
  if (webPage.length === 0) {
    return {
      statusCode: 400,
      msg: "Page not found",
    };
  }
  await db
    .update(webTable)
    .set({
      numAccessed: webPage[0].numAccessed + 1,
    })
    .where(eq(webTable.id, pageId));
  return {
    statusCode: 200,
    msg: "Done",
  };
}

export async function updatePageInfo(
  pageId: number,
  pageDescription: string,
  pageUrl: string,
  pageTag: string,
) {
  if (!validateURL(pageUrl)) {
    return { statusCode: 400, msg: "Invalid URL" };
  }
  await db
    .update(webTable)
    .set({
      url: pageUrl,
      description: pageDescription,
    })
    .where(eq(webTable.id, pageId));
  await db
    .update(tagTable)
    .set({
      webpageId: pageId,
      tagName: pageTag,
    })
    .where(eq(tagTable.webpageId, pageId));
  return { statusCode: 200, msg: "Successful" };
}

export async function deletePage(pageId: number) {
  await db.delete(webTable).where(eq(webTable.id, pageId));
  return { statusCode: 200, msg: "Successful" };
}

export async function addNewPage(
  description: string,
  url: string,
  pageTag: string,
) {
  if (!validateURL(url)) {
    return { statusCode: 400, msg: "Invalid URL" };
  }
  const res = await db
    .insert(webTable)
    .values({
      url,
      description,
    })
    .returning({ id: webTable.id });
  await db.insert(tagTable).values({
    webpageId: res[0].id,
    tagName: pageTag,
  });
  return { statusCode: 200, msg: "Successful" };
}
