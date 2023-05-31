import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Data = {
  message: string | boolean;
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

  const { productId } = req.query;

  const listed = await prisma.watchlist.findMany({
    where: {
      userId: userId?.id,
    },
    include: {
      products: true,
    },
  });

  const isListed = listed.some((item) =>
    item.products.some((product) => product.id === productId)
  );

  if (isListed) {
    return res.status(200).json({ message: true });
  } else {
    return res.status(200).json({ message: false });
  }
}
