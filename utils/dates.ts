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
