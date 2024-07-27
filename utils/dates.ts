import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

const getTime = (date: Date) => {
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return time;
};

export const iconDate = (isoDate: string | Date) => {
  if (!isoDate) return " ";

  const date = new Date(isoDate);
  const currentDate = new Date();

  let message;
  if (
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate()
  )
    message = "Today";
  else if (
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate() - 1
  ) {
    message = "Yesterday";
  } else {
    // const option = 's';
    message = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  return message + " " + getTime(date);
};

export const filterPassedTime = (time: Date) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);

  const day = selectedDate.getDay();

  return (
    day !== 0 && day !== 6 && currentDate.getTime() < selectedDate.getTime()
  );
};

export const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

export const getDateRange = (
  date_filter: string
): { start: Date; end: Date } => {
  const now = new Date();
  switch (date_filter) {
    case "Today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "This Week":
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case "This Month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "This Year":
      return { start: startOfYear(now), end: endOfYear(now) };
    case "All Time":
    default:
      return { start: new Date(0), end: now }; // from the start of time till now
  }
};
