import { useState, useEffect, useRef } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    router.push("/api/auth/signout");
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (btnRef.current && !btnRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50">
      <button
        ref={btnRef}
        className="flex items-center text-gray-700 hover:text-gray-900"
        onClick={() => handleOnClick()}
      >
        <UserIcon className="h-7 w-7 text-gray-500 ml-3 hover:cursor-pointer hover:scale-105  transition-all" />
      </button>
      {isOpen && (
        <div className="absolute border-2 border-gray-300 right-0 mt-2 w-32 bg-white rounded-lg font-semibold shadow-xl">
          <ul>
            <li
              onClick={() => router.push("/posts/selfAuctions")}
              className="p-3 border-b-2 border-gray-100 hover:bg-blue-300 hover:text-white hover:cursor-pointer transition-all"
            >
              My auctions
            </li>
            <li
              onClick={() => handleSignOut()}
              className="p-3 border-gray-400 hover:bg-red-300 hover:text-white  hover:cursor-pointer transition-all"
            >
              Sign Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
