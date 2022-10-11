import moment from 'moment-timezone';

export const CLIENT_API_BASE_URL = 'https://trackapi.nutritionix.com/v2/';

export const grocery_photo_upload = {
  max_photo_width: 1600,
  upc_list: 'http://d1gvlspmcma3iu.cloudfront.net/upc_list.json.gz',
  food_update_time: {
    quantity: 24 as moment.DurationInputArg1,
    unit: 'months' as moment.unitOfTime.DurationConstructor,
  },
  user_volunteering_multiplicator: 6,
};
