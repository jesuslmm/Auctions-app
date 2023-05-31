import { useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Auction } from "../../../../types";
import DisplayAuctions from "@/components/onPageComponents/AuctionsDisplay";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function Searched({ auctions }: { auctions: Auction[] }) {
  return <DisplayAuctions auctions={auctions} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await prisma.auction.findMany({
    select: {
      product: true,
    },
    distinct: ["product"],
  });

  const paths = response.map((auction) => {
    return {
      params: {
        name: auction.product,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const name = context.params?.name as string;

    const auctions = await prisma.auction.findMany({
      where: {
        finished: false,
        product: {
          contains: name,
        },
      },
      include: {
        bid: true,
      },
    });

    if (!auctions) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        auctions,
      },
    };
  } catch (err) {
    console.error((err as Error).message);
    return {
      props: {
        errors: (err as Error).message,
      },
    };
  }
};
