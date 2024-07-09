export const formatDuration = (start: Date, end: Date): string => {
  const diffMs = end.getTime() - start.getTime();
  const date = new Date(diffMs);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (seconds > 0) {
    if (minutes + 1 === 60) {
      minutes = 0;
      hours += 1;
    } else {
      minutes += 1;
    }
  }

  if (hours > 0 && minutes > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${
      minutes > 1 ? "s" : ""
    }`;
  } else if (hours > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  } else {
    return `${minutes} min${minutes > 1 ? "s" : ""}`;
  }
};
export const getStatus = (status: string) => {
  if (!status) return [{}];

  if (status === "pending") {
    return [{ start_time: { gt: new Date() } }];
  } else if (status === "active") {
    return [
      { start_time: { lte: new Date() } },
      { end_time: { gte: new Date() } },
    ];
  } else if (status === "closed") {
    return [{ end_time: { lt: new Date() } }];
  } else {
    return [{}];
  }
};

export const getStatusMessage = (startTime: Date, endTime: Date) => {
  if (startTime > new Date()) return "pending";
  else if (startTime <= new Date() && endTime >= new Date()) return "active";
  else return "closed";
};

export const formatSorRDate = (isoString: string): string => {
  const date = new Date(isoString);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const period = hours < 12 ? "am" : "pm";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

  return `${day} ${month} '${year}, ${formattedHours}:${minutes}${period}`;
};

export const formatArray = (
  arr: string[]
): { first: string; extra: string } => {
  if (arr.length === 0) {
    return { first: "", extra: "" };
  }

  const firstElement = arr[0];
  const additionalCount = arr.length - 1;

  if (additionalCount === 0) {
    return { first: firstElement, extra: "" };
  }

  return { first: firstElement, extra: `+${additionalCount}` };
};

/**
 * Converts an ISO string date to a CCTV footage timestamp format.
 *
 * @param isoString - The ISO string date to be formatted.
 * @returns A string in the format "YYYY-MM-DD HH:mm:ss".
 */
export const formatToCCTVTimestamp = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const isSessionFilterEmpty = (filters: {
  venue: number;
  status: string;
  startTime: string;
  endTime: string;
}) => {
  let empty = true;

  if (filters.status.length > 0) empty = false;
  if (filters.endTime.length > 0) empty = false;
  if (filters.startTime.length > 0) empty = false;
  if (filters.venue > 0) empty = false;

  return empty;
};

export const formatISODateToDDMMYYYY = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dayString = day < 10 ? `0${day}` : `${day}`;
  const monthString = month < 10 ? `0${month}` : `${month}`;

  return `${dayString}/${monthString}/${year}`;
};

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
