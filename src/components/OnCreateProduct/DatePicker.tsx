import React, { useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { useSpring, animated } from "react-spring";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export default function DatePickerFunction({
  startDate,
  handleTime,
  isError,
  handleIsErrorFalse,
}: {
  startDate: Date;
  handleTime: (date: Date | null) => void;
  isError: boolean;
  handleIsErrorFalse: () => void;
}) {
  const animationProps = useSpring({
    transform: isError ? "translateX(-4px)" : "translateX(0px)",
    config: { friction: 10, tension: 1300 },
    onRest: () => {
      if (isError) {
        handleIsErrorFalse();
      }
    },
  });

  return (
    <animated.div style={animationProps}>
      <DatePicker
        className={`border-2 border-blue-400 rounded-full text-center py-1 font-semibold ${
          isError == true ? "border-red-500" : ""
        }`}
        selected={startDate}
        onChange={handleTime}
      />
    </animated.div>
  );
}
