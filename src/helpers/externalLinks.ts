import baseService from 'api/baseService';
import {FoodProps} from 'store/userLog/userLog.types';

export const externalLinkV1 = (url: string | any): FoodProps => {
  var nutrMap = {
    203: 'nf_protein',
    204: 'nf_total_fat',
    205: 'nf_total_carbohydrate',
    208: 'nf_calories',
    269: 'nf_sugars',
    291: 'nf_dietary_fiber',
    305: 'nf_p',
    306: 'nf_potassium',
    307: 'nf_sodium',
    601: 'nf_cholesterol',
    606: 'nf_saturated_fat',
  };

  var qrInfo: any = {};

  if (typeof url === 'object') {
    qrInfo.q = url.q;
    qrInfo.b = url.b;
    qrInfo.u = url.u;
    qrInfo.n = url.n;
    qrInfo.a = {};
    url.a.split(',').forEach(function (kv: any) {
      var nutrItem = kv.split(':');
      qrInfo.a[parseInt(nutrItem[0])] = nutrItem[1];
    });
  } else {
    url = decodeURIComponent(url);
    // like url, certain info is after ?
    var qrSplit = url.split('?')[1];

    qrSplit.split('&').forEach(function (part: any) {
      var item = part.split('=');
      if (item[0] === 'a') {
        qrInfo[item[0]] = {};
        item[1].split(',').forEach(function (kv: any) {
          var nutrItem = kv.split(':');
          qrInfo[item[0]][nutrItem[0]] = nutrItem[1];
        });
      } else {
        qrInfo[item[0]] = item[1];
      }
    });
  }

  var request: FoodProps = {
    food_name: qrInfo.n,
    brand_name: qrInfo.b,
    serving_qty: parseInt(qrInfo.q),
    serving_unit: qrInfo.u,
    serving_weight_grams: null,
  };

  for (var key in qrInfo.a) {
    request[nutrMap[key]] = parseFloat(qrInfo.a[key]) || null;
  }
  return request;
};

export const externalLinkV2 = (url: string) => {
  url = decodeURIComponent(url);
  var qrSplit = url.split('?')[1];
  var qrInfo: any = {};
  qrSplit.split('&').forEach(function (part) {
    var item = part.split('=');
    qrInfo[item[0]] = item[1];
  });

  return qrInfo.i;
};

export const externalLinkV3 = async (url: any) => {
  var qrInfo: any = {};
  if (typeof url === 'object') {
    qrInfo.ufl = url.params.ufl;
    qrInfo.s = url.params.s;
  } else {
    url = decodeURIComponent(url);
    var qrSplit = url.split('?')[1];
    qrSplit.split('&').forEach(function (part: any) {
      var item = part.split('=');
      qrInfo[item[0]] = item[1];
    });
  }

  const foodObj = await baseService.shareMeal(qrInfo.ufl, qrInfo.s);

  return foodObj.data.foods;
};
