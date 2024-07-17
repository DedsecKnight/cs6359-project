import { db } from "@/db/db";
import { webTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const webPage = await db
    .select({ numAccessed: webTable.numAccessed })
    .from(webTable)
    .where(eq(webTable.id, req.body.pageId))
    .limit(1);
  if (webPage.length === 0) {
    return res.status(400).json({ msg: "Page not found" });
  }
  await db
    .update(webTable)
    .set({
      numAccessed: webPage[0].numAccessed + 1,
    })
    .where(eq(webTable.id, req.body.pageId));
  return res.status(200).json({ msg: "done" });
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case "POST": {
      return handlePostRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: "Route not found",
      });
    }
  }
}
