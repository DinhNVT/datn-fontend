const moment = require("moment");

export const getCreatedAtString = (createAt) => {
  const now = moment();
  const createdAtMoment = moment(createAt);

  const diffSeconds = now.diff(createdAtMoment, "seconds");
  if (diffSeconds < 60) {
    return `Vừa xong`;
  }

  const diffMinutes = now.diff(createdAtMoment, "minutes");
  if (diffMinutes < 60) {
    return `${diffMinutes} phút`;
  }

  const diffHours = now.diff(createdAtMoment, "hours");
  if (diffHours < 24) {
    return `${diffHours} giờ`;
  }

  return createdAtMoment.format("HH:mm DD-MM-YYYY");
};
