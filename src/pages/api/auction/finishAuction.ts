import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data: string = JSON.parse(req.body);

  const checkAuction = await prisma.auction.findUnique({
    where: {
      id: data,
    },
  });

  if (checkAuction!.finished !== true) {
    await prisma.auction.update({
      where: {
        id: data,
      },
      data: {
        finished: true,
      },
    });

    const auction = await prisma.auction.findUnique({
      where: {
        id: data,
      },
      select: {
        userId: true,
        product: true,
      },
    });

    const winner = `Congrats! you're the winner of`;
    const listed = `This auction is finished: `;

    await prisma.notification.create({
      data: {
        auctionId: data,
        userId: auction!.userId,
        notification: winner,
        productName: auction!.product,
      },
    });

    const users = await prisma.watchlist.findMany({
      where: {
        products: {
          some: {
            id: data,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    console.log(users);

    const userIds = users.map((user) => user.user.id);

    console.log(userIds);

    for (let i = 0; i < userIds.length; i++) {
      const id = userIds[i];

      await prisma.notification.create({
        data: {
          userId: id,
          auctionId: data,
          productName: auction!.product,
          notification: listed,
        },
      });
    }

    res.status(200).json({ message: "All fine" });
  }
}
