// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import { PrismaClient, CategoryType } from "@prisma/client";
const prisma = new PrismaClient();

type Data = {
  message: string;
};

export interface NewAuction {
  product: string;
  image: string;
  price: number;
  finishTime: string;
  category: CategoryType;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in " });
  }

  const userId = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    select: {
      id: true,
    },
  });

  const data: NewAuction = JSON.parse(req.body);

  const { product, image, finishTime, category, description } = data;

  const auction = {
    product: product,
    userId: userId!.id,
    image: image,
    finishTime: finishTime,
    category: category,
    description: description,
  };

  const auctionAdded = await prisma.auction.create({
    data: auction,
  });

  const bid = {
    actual_bid: +data.price,
    auctionId: auctionAdded.id,
  };

  await prisma.bid.create({
    data: bid,
  });

  res.status(200).json({ message: "All fine" });
}
