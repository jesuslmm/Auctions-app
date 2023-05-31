import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = req.query.q as string;
    const products = await prisma.auction.findMany({
      where: {
        finished: false,
        product: {
          contains: query,
          mode: "insensitive",
        },
      },
      distinct: ["product"],
    });
    res.status(200).json(products);
  } else {
    res.status(405).end();
  }
}
