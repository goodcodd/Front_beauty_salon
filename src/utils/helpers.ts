import moment from 'moment';

export const getWeekDays = (weekOffset: number = 0) => {
  const days = [];
  const startOfWeek = moment().add(1, 'day').add(weekOffset, 'weeks').startOf('isoWeek');
  
  for (let i = 0; i < 7; i++) {
    days.push(startOfWeek.clone().add(i, 'days').format('DD-MM-YYYY'));
  }
  return days;
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export const generateTimeSlots = (startTime: string, endTime: string, duration: number) => {
  const timeSlots = [];
  let currentTime = moment(startTime, 'HH:mm');
  
  while (currentTime.isBefore(moment(endTime, 'HH:mm'))) {
    timeSlots.push(currentTime.format('HH:mm'));
    currentTime = currentTime.add(duration, 'minutes');
  }
  
  return timeSlots;
};
