// @flow

type DateObject = {
  month: string,
  day: number,
  year: number,
  hour: number,
  minute: string,
  ampm: string,
};

export const getDateObject = (timestamp: string): DateObject => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(timestamp);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];
  const year = date.getFullYear();
  const hours = date.getHours() || 0;
  let hour;
  if (hours === 0) {
    hour = 12; // if timestamp is between midnight and 1am, show 12:XX am
  } else {
    hour = hours > 12 ? hours - 12 : hours; // else show proper am/pm -- todo: support 24hr time
  }
  let minute = date.getMinutes();
  minute = minute >= 10 ? minute.toString() : `0${minute.toString()}`; // turns 4 minutes into 04 minutes
  const ampm = hours >= 12 ? 'pm' : 'am'; // todo: support 24hr time

  return {
    month,
    day,
    year,
    hour,
    minute,
    ampm,
  };
};
