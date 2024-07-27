import { getSearchResult } from "@/controllers/search";
import { NextApiRequest, NextApiResponse } from "next";

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const searchTerms = (req.query.query as string).split(" ");
  const queryType = req.query.type as string;
  const pageNumber = parseInt(req.query.page as string);
  const searchOrder = req.query.order as string;
  const invalidSymbol = [
    "`",
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "[",
    "]",
    "{",
    "}",
    "|",
    "\\",
    '"',
    "'",
    ";",
    "<",
    ">",
    ",",
    "?",
    "(",
    ")",
  ];
  for (let i = 0; i < searchTerms.length; i++) {
    for (let j = 0; j < invalidSymbol.length; j++) {
      searchTerms[i] = searchTerms[i].replaceAll(invalidSymbol[j], "");
    }
  }
  const resData = await getSearchResult(
    searchTerms,
    queryType,
    pageNumber,
    searchOrder,
  );
  return res.json(resData);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case "GET": {
      return handleGetRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: "Route not found",
      });
    }
  }
}
