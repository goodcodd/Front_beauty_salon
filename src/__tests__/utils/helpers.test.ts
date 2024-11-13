import moment from 'moment';
import { getWeekDays, chunkArray, generateTimeSlots } from '../../utils/helpers';

describe('getWeekDays', () => {
  it('should return 7 days starting from the next day of the current week', () => {
    const weekDays = getWeekDays();
    expect(weekDays).toHaveLength(7);
    expect(moment(weekDays[0], 'DD-MM-YYYY').isSame(moment().add(1, 'day').startOf('isoWeek'), 'day')).toBe(true);
  });
  
  it('should return 7 days with a given week offset', () => {
    const weekOffset = 2;
    const weekDays = getWeekDays(weekOffset);
    expect(weekDays).toHaveLength(7);
    expect(moment(weekDays[0], 'DD-MM-YYYY').isSame(moment().add(1, 'day').add(weekOffset, 'weeks').startOf('isoWeek'), 'day')).toBe(true);
  });
});

describe('chunkArray', () => {
  it('should split an array into chunks of given size', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8];
    const chunkSize = 3;
    const chunkedArray = chunkArray(array, chunkSize);
    expect(chunkedArray).toEqual([[1, 2, 3], [4, 5, 6], [7, 8]]);
  });
  
  it('should return an empty array if input array is empty', () => {
    const array: number[] = [];
    const chunkSize = 3;
    const chunkedArray = chunkArray(array, chunkSize);
    expect(chunkedArray).toEqual([]);
  });
});

describe('generateTimeSlots', () => {
  it('should generate time slots between start and end time with given duration', () => {
    const startTime = '09:00';
    const endTime = '12:00';
    const duration = 30;
    const timeSlots = generateTimeSlots(startTime, endTime, duration);
    expect(timeSlots).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']);
  });
  
  it('should return an empty array if start time is after end time', () => {
    const startTime = '14:00';
    const endTime = '12:00';
    const duration = 30;
    const timeSlots = generateTimeSlots(startTime, endTime, duration);
    expect(timeSlots).toEqual([]);
  });
});
