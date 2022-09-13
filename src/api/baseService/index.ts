import apiClient from 'api';
import axios from 'axios';

// types
import {NutritionType} from './types';

const baseService = {
  async getNutrionTopics() {
    return await apiClient.get('nutrition_topics');
  },
  async getCountries() {
    return await axios.get<Array<NutritionType>>(
      'https://d1gvlspmcma3iu.cloudfront.net/country-codes.json',
    );
  },
};

export default baseService;
