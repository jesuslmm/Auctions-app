import moment from "moment";
import { useEffect, useState, useRef } from "react";
import GetRemainingTime from "./utils/CountdownTimerUtils";

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
  days: "00",
};

export default function FrontCountdown({
  FinishTime,
  handleFinishTime,
  auctionId,
  isFinished,
}: {
  FinishTime: string;
  handleFinishTime: (id: string) => void;
  auctionId: string;
  isFinished: boolean;
}) {
  const [remainingTime, setReaminingTime] = useState(defaultRemainingTime);
  const [countdownFinished, setIsCountdownFinished] = useState(isFinished);

  const diffTime = moment(FinishTime).diff(moment());

  function updateRemainingTime(countdown: string) {
    setReaminingTime(GetRemainingTime(countdown));
  }

  const duration = moment.duration(diffTime);

  const isHandleFinishTimeCalledRef = useRef(false);

  useEffect(() => {
    const now = Date.now();
    const deadline = Date.parse(FinishTime);

    if (
      now >= deadline &&
      !countdownFinished &&
      !isHandleFinishTimeCalledRef.current
    ) {
      handleFinishTime(auctionId);
      setIsCountdownFinished(true);
      isHandleFinishTimeCalledRef.current = true;
      return;
    }
    const intervalId = setInterval(() => {
      updateRemainingTime(FinishTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [
    FinishTime,
    remainingTime,
    countdownFinished,
    auctionId,
    handleFinishTime,
  ]);

  if (duration.asSeconds() < 60) {
    return (
      <p className="text-red-600 font-extrabold mt-3 animate-pulse text-lg ">
        1 minute left
      </p>
    );
  } else if (duration.asMinutes() < 10) {
    return (
      <p className="text-red-600 font-bold mt-3 animate-pulse text-lg">
        10 minutes left
      </p>
    );
  } else if (duration.asMinutes() < 30) {
    return (
      <p className="text-red-600 font-semibold mt-3 animate-pulse text-lg">
        30 minutes left
      </p>
    );
  } else if (duration.asMinutes() < 60) {
    return (
      <p className="text-red-600 font-medium mt-3 animate-pulse text-lg">
        1 hour left
      </p>
    );
  } else if (duration.asHours() < 12) {
    return (
      <p className="text-green-600 font-medium mt-3 text-lg">
        {Math.round(duration.asHours())} hours left
      </p>
    );
  } else if (duration.asHours() < 24 && duration.asHours() > 12) {
    return (
      <p className=" text-green-500 font-medium mt-3 text-lg">1 day left</p>
    );
  } else {
    return (
      <p className="text-green-500 font-medium mt-3">
        {Math.round(duration.asDays())} days left
      </p>
    );
  }
}
