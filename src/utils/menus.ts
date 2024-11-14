import qs from 'qs';

import { chunkArray, generateTimeSlots, getWeekDays } from './helpers';
import i18n from '../config/i18n';
import customFetch from './customFetch';

export const generateServiceMenu = async (locale: string = 'en') => {
  try {
    const { data } = await customFetch(`/services?locale=${locale}`);

    return {
      reply_markup: {
        inline_keyboard: data.map(
          (service: { name: string; documentId: string }) => [
            {
              text: service.name,
              callback_data: `service_${service.documentId}`,
            },
          ],
        ),
      },
    };
  } catch (error) {
    return { reply_markup: { inline_keyboard: [] } };
  }
};

export const generateMasterMenu = async (
  serviceId: number,
  isBack: boolean = true,
  locale: string = 'en',
) => {
  try {
    const str = qs.stringify(
      {
        filters: {
          service: serviceId,
        },
        locale,
      },
      { addQueryPrefix: true },
    );
    const { data } = await customFetch(`/masters${str}`);
    const inlineKeyboard = data.map(
      (master: { documentId: string; name: string }) => [
        { text: master.name, callback_data: `master_${master.documentId}` },
      ],
    );

    if (isBack) {
      inlineKeyboard.push([
        { text: i18n.t('back'), callback_data: 'back_to_date' },
      ]);
    }

    return {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    };
  } catch (error) {
    console.log('error', error);
    return { reply_markup: { inline_keyboard: [] } };
  }
};

export const generateDateMenu = (weekOffset: number = 0) => {
  const days = getWeekDays(weekOffset);
  const chunkedDays = chunkArray(
    days.map((day) => ({ text: day, callback_data: `date_${day}` })),
    3,
  );

  return {
    reply_markup: {
      inline_keyboard: [
        ...chunkedDays,
        [
          {
            text: i18n.t('prevWeek'),
            callback_data: `prev_week_${weekOffset - 1}`,
          },
          {
            text: i18n.t('nextWeek'),
            callback_data: `next_week_${weekOffset + 1}`,
          },
        ],
        [{ text: i18n.t('back'), callback_data: 'back_to_service' }],
      ],
    },
  };
};

export const generateTimeMenu = (serviceDuration: number) => {
  const timeSlots = generateTimeSlots('10:00', '18:00', serviceDuration);
  const chunkedTimeSlots = chunkArray(
    timeSlots.map((time) => ({ text: time, callback_data: `time_${time}` })),
    3,
  );

  return {
    reply_markup: {
      inline_keyboard: [
        ...chunkedTimeSlots,
        [{ text: i18n.t('back'), callback_data: 'back_to_master' }],
      ],
    },
  };
};
