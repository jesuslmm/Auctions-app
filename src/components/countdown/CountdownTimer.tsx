import { useState, useEffect } from "react";
import GetRemainingTime from "./utils/CountdownTimerUtils";

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
  days: "00",
};

export default function CountdownTimer({
  countdownTimestamps,
  handleFinishTime,
  isFinished,
}: {
  countdownTimestamps: string;
  handleFinishTime: () => void;
  isFinished: boolean;
}) {
  const [remainingTime, setReaminingTime] = useState(defaultRemainingTime);
  const [countdownFinished, setIsCountdownFinished] = useState(isFinished);

  function updateRemainingTime(countdown: string) {
    setReaminingTime(GetRemainingTime(countdown));
  }

  useEffect(() => {
    const now = Date.now();
    const deadline = Date.parse(countdownTimestamps);
    if (now >= deadline && !countdownFinished) {
      handleFinishTime();
      setIsCountdownFinished(true);
      return;
    }
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestamps);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdownTimestamps, handleFinishTime, remainingTime, countdownFinished]);

  return (
    <div className=" items-center justify-center">
      <h1 className="text-center  text-2xl mb-3 font-extralight">
        This auction will finish in
      </h1>
      <div className="text-5xl text-center flex w-full items-center justify-center">
        <div className="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
          <div className="font-mono leading-none" x-text="days">
            {remainingTime.days}
          </div>
          <div className="font-mono uppercase text-sm leading-none">Days</div>
        </div>
        <div className="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
          <div className="font-mono leading-none" x-text="hours">
            {remainingTime.hours}
          </div>
          <div className="font-mono uppercase text-sm leading-none">Hours</div>
        </div>
        <div className="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
          <div className="font-mono leading-none" x-text="minutes">
            {remainingTime.minutes}
          </div>
          <div className="font-mono uppercase text-sm leading-none">
            Minutes
          </div>
        </div>
        <div className="text-2xl mx-1 font-extralight">and</div>
        <div className="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
          <div className="font-mono leading-none" x-text="seconds">
            {remainingTime.seconds}
          </div>
          <div className="font-mono uppercase text-sm leading-none">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}
