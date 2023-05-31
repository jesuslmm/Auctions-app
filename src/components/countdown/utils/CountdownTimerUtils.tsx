import dayjs, { Dayjs } from "dayjs";

export default function GetRemainingTime(timestamp: string) {
  const timestampDayjs: Dayjs = dayjs(timestamp);
  const nowDayjs: Dayjs = dayjs();
  return {
    seconds: getRemainingSeconds(nowDayjs, timestampDayjs),
    minutes: getRemainingMinutes(nowDayjs, timestampDayjs),
    hours: getRemainingHours(nowDayjs, timestampDayjs),
    days: getRemainingDays(nowDayjs, timestampDayjs),
  };
}

function getRemainingSeconds(nowDayjs: Dayjs, timestampDayjs: Dayjs) {
  const seconds = timestampDayjs.diff(nowDayjs, "seconds") % 60;
  return padWithZeros(seconds, 2);
}

function getRemainingMinutes(nowDayjs: Dayjs, timestampDayjs: Dayjs) {
  const minutes = timestampDayjs.diff(nowDayjs, "minutes") % 60;
  return padWithZeros(minutes, 2);
}

function getRemainingHours(nowDayjs: Dayjs, timestampDayjs: Dayjs) {
  const hours = timestampDayjs.diff(nowDayjs, "hours") % 24;
  return padWithZeros(hours, 2);
}

function getRemainingDays(nowDayjs: Dayjs, timestampDayjs: Dayjs) {
  const days = timestampDayjs.diff(nowDayjs, "days");
  return padWithZeros(days, 2);
}

function padWithZeros(number: number, minLegth: number) {
  const numberString = number.toString();
  if (numberString.length >= minLegth) return numberString;
  return "0".repeat(minLegth - numberString.length) + numberString;
}
