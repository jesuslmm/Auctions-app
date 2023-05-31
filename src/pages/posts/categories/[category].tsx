import { GetStaticProps, GetStaticPaths } from "next";
import { Auction } from "../../../../types";
import DisplayAuctions from "@/components/onPageComponents/AuctionsDisplay";

import { CategoryType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function Category({ auctions }: { auctions: Auction[] }) {
  return <DisplayAuctions auctions={auctions} />;
}

export const getStaticPaths: GetStaticPaths = () => {
  const categories = Object.values(CategoryType);

  const paths = categories.map((category) => {
    return { params: { category } };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const category = context.params?.category as CategoryType;

    const auctions = await prisma.auction.findMany({
      where: {
        category: category,
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
