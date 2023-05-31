import Image from "next/image";
import Layout from "./layout";
import { Auction } from "../../../types";
import { useRouter } from "next/router";
import FrontCountdown from "../countdown/frontCountown";
import { Toaster } from "react-hot-toast";

export default function DisplayAuctions({ auctions }: { auctions: Auction[] }) {
  const router = useRouter();

  const handleFinishTime = async (id: string) => {
    const response = await fetch("/api/auction/finishAuction", {
      method: "POST",
      body: JSON.stringify(id),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  };

  return (
    <Layout>
      <ul className="mx-4 ">
        {auctions?.map((auction) => (
          <li
            key={auction.id}
            onClick={() => router.push(`/posts/${auction.id}`)}
            className="grid grid-cols-2 p-6 items-center"
          >
            <div className="items-center justify-center">
              <div className="bg-gradient-to-b from-blue-500 to-blue-200 h-56 w-3.5 absolute mt-5 ml-8"></div>
              <div className="p-2 ml-2 sm:ml-20 lg:ml-32 mr-9">
                <h3 className="text-3xl font-bold mb-6">{auction.product}</h3>
                <p className="mb-5">{auction.description}</p>
                <p className="text-gray-700 font-bold text-xl mb-3">
                  ${auction.bid.actual_bid}
                </p>
                <FrontCountdown
                  FinishTime={auction.finishTime}
                  handleFinishTime={handleFinishTime}
                  auctionId={auction.id}
                  isFinished={auction.finished}
                />
              </div>
            </div>
            <div className="items-center justify-center">
              <Image
                src={auction.image}
                alt={auction.product}
                width={250}
                height={250}
                style={{
                  width: "350px",
                  height: "350px",
                  objectFit: "contain",
                }}
                className="object-cover rounded-t-lg pt-4 ml-28"
              />
            </div>
          </li>
        ))}
      </ul>
      <Toaster />
    </Layout>
  );
}
