import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type comment = {
  answer: string;
  id: string;
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
    res.status(401).json({ message: "You must be logged in " });
  }

  const data: comment = JSON.parse(req.body);

  await prisma.comment.update({
    where: {
      id: data.id,
    },
    data: {
      answer: data.answer,
    },
  });

  res.status(200).json({ message: "all fine" });
}
