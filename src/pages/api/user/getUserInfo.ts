import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "..//auth/[...nextauth]";
import { User } from "../../../../types";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Data = {
  response: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | User>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ response: "You must be logged in " });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });

  if (!user) {
    res.status(404).json({ response: "User not found" });
    return;
  }

  res.status(200).json(user as User);
}
