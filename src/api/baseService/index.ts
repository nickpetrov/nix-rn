import apiClient from 'api';

// types
import {NutritionType} from './types';

const baseService = {
  async getNutrionTopics() {
    return await apiClient.get<Array<NutritionType>>('nutrition_topics');
  },
};

export default baseService;
