import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type newBid = {
  bid: number;
  productId: string;
};

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in" });
  }

  const userId = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    select: {
      id: true,
    },
  });

  const data: newBid = JSON.parse(req.body);

  await prisma.bid.update({
    where: {
      auctionId: data.productId,
    },
    data: {
      actual_bid: data.bid,
      buyerId: userId!.id,
    },
  });

  res.status(200).json({ message: "All fine" });
}
