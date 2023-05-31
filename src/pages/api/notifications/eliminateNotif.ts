import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Notification } from "../../../../types";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Notification[]>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in " });
  }

  const data: string = JSON.parse(req.body);

  await prisma.notification.delete({
    where: {
      id: data,
    },
  });

  res.status(200).json({ message: "Notification Deleted!" });
}
