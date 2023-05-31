import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Data = {
  message: string;
};

type infoProduct = {
  id: string;
  listed: boolean;
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

  const data: infoProduct = await JSON.parse(req.body);

  try {
    const checkWatchlist = await prisma.watchlist.findUnique({
      where: {
        userId: userId?.id,
      },
    });

    if (!checkWatchlist) {
      await prisma.watchlist.create({
        data: {
          userId: userId!.id,
          products: {
            connect: {
              id: data.id,
            },
          },
        },
      });

      res.status(200).json({ message: "all done" });
    } else {
      if (data.listed == true) {
        console.log("hehe");

        await prisma.watchlist.update({
          where: {
            userId: userId?.id,
          },
          data: {
            products: {
              disconnect: {
                id: data.id,
              },
            },
          },
        });
        res.status(200).json({ message: "all done" });
      } else {
        await prisma.watchlist.update({
          where: {
            userId: userId?.id,
          },
          data: {
            products: {
              connect: {
                id: data.id,
              },
            },
          },
        });
        res.status(200).json({ message: "all done" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
}
