import i18n from "../config/i18n";

const getMockMasters = () => [
  { masterId: '1', imagePath: './src/assets/manicure.png', caption: i18n.t('manicureDescription') },
  { masterId: '2', imagePath: './src/assets/haircut.png', caption: i18n.t('haircutDescription') },
  { masterId: '3', imagePath: './src/assets/massage.png', caption: i18n.t('massageDescription') },
  { masterId: '4', imagePath: './src/assets/purging.png', caption: i18n.t('purgingDescription') },
  { masterId: '5', imagePath: './src/assets/pedicure.png', caption: i18n.t('pedicureDescription') },
];

export default getMockMasters;
