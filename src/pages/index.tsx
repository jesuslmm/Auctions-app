import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { Auction } from "../../types";
import { useState } from "react";
import DisplayAuctions from "@/components/onPageComponents/AuctionsDisplay";
import { useRouter } from "next/router";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function Home({ allAuctions }: { allAuctions: Auction[] }) {
  const [auctions] = useState(allAuctions);

  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return <p>loading</p>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  return <DisplayAuctions auctions={auctions} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await prisma.auction.findMany({
    where: {
      finished: false,
    },
    include: {
      bid: true,
    },
  });

  return {
    props: {
      allAuctions: response,
    },
  };
};
