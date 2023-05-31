import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryPicker from "./headerProps/categoryPicker";
import SearchBar from "./Search";
import { useRouter } from "next/router";
import Notifications from "./notifications";
import Profile from "./headerProps/profile";

interface Product {
  id: string;
  product: string;
}

export default function Header() {
  const router = useRouter();

  const handleSearch = (product: Product) => {
    router.push(`posts/searched/${product.product}`);
  };

  return (
    <header className="flex justify-between items-center p-4 max-w-6xl m-auto">
      <h1 className="font-bold ml-5 text-xl">
        <Link href="/">
          ZIALE
          <span className="transition-all font-light hover:opacity-60">
            AUCTIONS
          </span>
        </Link>
      </h1>
      <nav>
        <ul className="flex flex-row-reverse gap-3">
          <li>
            <Notifications />
          </li>
          <li>
            <Profile />
          </li>
          <li>
            <SearchBar onSearch={handleSearch} />{" "}
          </li>
          <li>
            <CategoryPicker />
          </li>
          <li className="p-1 font-semibold text-gray-500 hover:text-gray-800 hover:scale-105 transition">
            <Link href={`/posts/listed`}> Listed</Link>
          </li>
          <li className="p-1 font-semibold text-gray-500 hover:text-gray-800 hover:scale-105 transition">
            <Link href="/newAuction">Offer</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
