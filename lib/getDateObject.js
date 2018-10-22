// @flow

type DateObject = {
  month: string,
  day: number,
  year: number,
  hour: number,
  minute: string,
  ampm: string,
}

export const getDateObject = (timestamp: string): DateObject => {
  let monthNames = [
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

  let date = new Date(timestamp);
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let month = monthNames[monthIndex];
  let year = date.getFullYear();
  let hours = date.getHours() || 0;
  let hour;
  if (hours === 0) {
    hour = 12; // if timestamp is between midnight and 1am, show 12:XX am
  } else {
    hour = hours > 12 ? hours - 12 : hours; // else show proper am/pm -- todo: support 24hr time
  }
  let minute = date.getMinutes();
  minute = minute >= 10 ? minute.toString() : '0' + minute.toString(); // turns 4 minutes into 04 minutes
  let ampm = hours >= 12 ? 'pm' : 'am'; // todo: support 24hr time

  return {
    month,
    day,
    year,
    hour,
    minute,
    ampm
  }
};