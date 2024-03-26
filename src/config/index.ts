import moment from 'moment-timezone';
import RNFS from 'react-native-fs';

export const CLIENT_API_BASE_URL = 'https://trackapi.nutritionix.com/v2/';

export const grocery_photo_upload = {
  max_photo_width: 1600,
  max_photo_height: 1600,
  upc_list: 'http://d1gvlspmcma3iu.cloudfront.net/upc_list.json.gz',
  food_update_time: {
    quantity: 3 as moment.DurationInputArg1,
    unit: 'months' as moment.unitOfTime.DurationConstructor,
  },
  user_volunteering_multiplicator: 6,
};

export const aws_config = {
  aws_access_key_id: 'AKIAICGAVNR5YBUYKE4A',
  aws_secret_access_key: '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',
  bucket: 'nix-ios-upload',
  region: 'us-east-1',
};

const APP_FOLDER_NAME = 'nutritionx';
export const pictureFolder = `${RNFS.DocumentDirectoryPath}/${APP_FOLDER_NAME}`;
