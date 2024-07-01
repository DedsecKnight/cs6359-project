import { db } from "@/db/db";
import { webTable } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const searchTerms = (req.query.query as string).split(" ");
  const queryType = (req.query.type as string);
  let invalidSymbol = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "[", "]", "{", "}", "|", "\\", "\"", "'", ";", ":", "<", ">", ",", ".", "?", "/"];
  for (let i = 0; i < searchTerms.length; i++){
    for (let j = 0; j < invalidSymbol.length; j++){
      searchTerms[i] = searchTerms[i].replaceAll(invalidSymbol[j], "");
    }
  }
  
  if (searchTerms.length === 0) {
    return res.json({
      searchResult: []
    })
  };
  const webpages = await db.select().from(webTable);
  const filteredWebpages = webpages.filter((webpage) => {
    if (queryType === "or") return webpage.description.split(" ").some((keyword) => searchTerms.indexOf(keyword) !== -1);
    const parsedDescription = webpage.description.split(" ");
    if (queryType === "and") {
      return searchTerms.every((term) => parsedDescription.indexOf(term) !== -1);
    }
    return searchTerms.every((term) => parsedDescription.indexOf(term) === -1);
  });
  return res.json({
    searchResult: filteredWebpages.map(({ id, ...rest }) => rest).sort()
  });
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: "Route not found"
      })
    }
  }
}