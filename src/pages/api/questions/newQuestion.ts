import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type comment = {
  question: string;
  productId: string;
};

type Data = {
  message: string;
};

export type questionType = {
  id: string;
  userId: string;
  comment: string;
  productId: string;
  answer: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | questionType>
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

  const data: comment = JSON.parse(req.body);

  const question = await prisma.comment.create({
    data: {
      userId: userId!.id,
      comment: data.question,
      productId: data.productId,
    },
  });

  res.status(200).json(question);
}
