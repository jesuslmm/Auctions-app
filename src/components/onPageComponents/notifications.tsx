import { useState, useEffect, useRef } from "react";
import { BellIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Notification } from "../../../types";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [notifications, setNotifications] = useState<
    Notification[] | undefined
  >();
  const [newNotifications, setNewNotifications] = useState<boolean>();

  const [listRef] = useAutoAnimate();
  const router = useRouter();

  const handleOnClick = async () => {
    setIsOpen(!isOpen);

    if (newNotifications == true) {
      const response = await fetch("/api/notifications/setCheckedNotifs");

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (newNotifications == true) {
        setNewNotifications(false);
      }
    }
  };

  const handleEliminateNotif = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const response = await fetch(`/api/notifications/eliminateNotif`, {
      method: "PUT",
      body: JSON.stringify(id),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const modifiedNotifications = notifications!.filter(
      (notif) => notif.id !== id
    );

    setNotifications(modifiedNotifications);
  };

  useEffect(() => {
    async function GetNotifications() {
      const response = await fetch("/api/notifications/getNotifs");
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setNotifications(data);
    }

    GetNotifications();

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

  function handleOpenNotification(id: string) {
    router.push(`/posts/${id}`);
  }

  useEffect(() => {
    if (notifications) {
      const hasUncheckedNotifications = notifications?.some(
        (notification) => !notification.checked
      );
      if (hasUncheckedNotifications) {
        return setNewNotifications(true);
      } else {
        return setNewNotifications(false);
      }
    }
    return setNewNotifications(false);
  }, [notifications]);

  return (
    <div className="relative z-50">
      <button
        ref={btnRef}
        className="flex items-center text-gray-700 hover:text-gray-900"
        onClick={() => handleOnClick()}
      >
        <span>
          {newNotifications === true ? (
            <>
              <span className="relative flex h-3 w-3 ml-3 -mb-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>{" "}
            </>
          ) : null}
          <BellIcon className="h-7 w-7 text-gray-500 ml-3 hover:cursor-pointer hover:scale-105  transition-all" />
        </span>
      </button>
      {isOpen && (
        <div className="absolute border-2 border-gray-400 right-0 mt-2 w-96 bg-white rounded-lg shadow-xl">
          <ul className="py-1 " ref={listRef}>
            {notifications?.length ? (
              notifications!.map((notif) => (
                <li
                  key={notif.id}
                  className="flex p-4 border-t-2 border-gray-100 hover:cursor-pointer  hover:bg-blue-200  transition-all"
                >
                  <p onClick={() => handleOpenNotification(notif.auctionId)}>
                    {notif.notification}{" "}
                    <span className="font-bold text-lg">
                      {notif.productName}
                    </span>
                  </p>
                  <p
                    onClick={(event) => handleEliminateNotif(notif.id, event)}
                    className="ml-6 hover:scale-125 transition-all hover:text-red-500"
                  >
                    <TrashIcon className="ml-2 mt-2" height="15" width="15" />
                  </p>
                </li>
              ))
            ) : (
              <p className="text-center p-2 font-bold">No notifications!</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
