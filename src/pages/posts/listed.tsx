import { useState, useEffect } from "react";
import { Auction } from "../../../types";
import DisplayAuctions from "@/components/onPageComponents/AuctionsDisplay";

export default function Listed() {
  const [auctionsList, setAuctionsList] = useState<Auction[] | undefined>();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/auction/listed/getList");
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setAuctionsList(data);
    }
    fetchData();
  }, []);

  return <DisplayAuctions auctions={auctionsList as Auction[]} />;
}
