
export const formatDuration = (start: Date, end: Date): string => {
  const diffMs = end.getTime() - start.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHrs > 0 && diffMins > 0) {
    return `${diffHrs}hr${diffHrs > 1 ? "s" : ""} ${diffMins}min${
      diffMins > 1 ? "s" : ""
    }`;
  } else if (diffHrs > 0) {
    return `${diffHrs}hr${diffHrs > 1 ? "s" : ""}`;
  } else {
    return `${diffMins}min${diffMins > 1 ? "s" : ""}`;
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
  if (startTime < new Date()) return "pending";
  else if (startTime > new Date() && endTime < new Date()) return "active";
  else return "closed";
};