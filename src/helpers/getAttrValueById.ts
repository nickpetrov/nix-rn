import {NutrientProps} from '../store/basket/basket.types';

const getAttrById = (full_nutrients: Array<NutrientProps>, attrId: number) => {
  if (typeof full_nutrients === 'undefined') {
    return 0;
  }
  const arrForAttrId = full_nutrients.filter(attr => attr.attr_id === attrId);
  return arrForAttrId.length > 0 ? arrForAttrId[0].value : 0;
};

export default getAttrById;
