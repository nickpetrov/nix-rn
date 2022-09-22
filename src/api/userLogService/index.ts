import apiClient from 'api';
import {
  ExerciseProps,
  FoodProps,
  loggingOptionsProps,
  WeightProps,
} from 'store/userLog/userLog.types';

const userLogService = {
  async getTotals({
    beginDate,
    endDate,
    timezone,
  }: {
    beginDate: string;
    endDate: string;
    timezone: string;
  }) {
    return await apiClient.get('reports/totals', {
      params: {
        begin: beginDate,
        end: endDate,
        timezone,
      },
    });
  },
  async setDayNotes(data: {dates: Array<{date: string; notes: string}>}) {
    return await apiClient.put('reports/totals', {
      data,
    });
  },
  async getUserFoodlog({
    beginDate,
    endDate,
    offset,
    timezone,
  }: {
    beginDate: string;
    endDate: string;
    offset: number | undefined;
    timezone: string;
  }) {
    return await apiClient.get('log', {
      params: {
        begin: beginDate,
        end: endDate,
        offset,
        timezone,
        limit: 500,
      },
    });
  },
  async getUserWeightlog({
    beginDate,
    endDate,
    offset,
    timezone,
  }: {
    beginDate?: string;
    endDate?: string;
    offset?: number | undefined;
    timezone?: string;
  }) {
    return await apiClient.get('weight/log', {
      params: {
        begin: beginDate,
        end: endDate,
        offset,
        timezone,
        limit: 500,
      },
    });
  },
  async addWeightlog(weights: Array<WeightProps>) {
    return await apiClient.post('weight/log', {
      weights,
    });
  },
  async updateWeightlog(weights: Array<WeightProps>) {
    return await apiClient.put('weight/log', {
      weights,
    });
  },
  async getUserExerciseslog({
    beginDate,
    endDate,
    offset,
    timezone,
  }: {
    beginDate: string;
    endDate: string;
    offset: number | undefined;
    timezone: string;
  }) {
    return await apiClient.get('exercise/log', {
      params: {
        begin: beginDate,
        end: endDate,
        offset,
        timezone,
        limit: 500,
      },
    });
  },
  async getExerciseByQuery(query: string) {
    return await apiClient.post('natural/exercise', {
      query,
    });
  },
  async addExerciseLog(exercises: Array<ExerciseProps>) {
    return await apiClient.post('exercise/log', {
      exercises,
    });
  },
  async updateExerciseLog(exercises: Array<ExerciseProps>) {
    return await apiClient.put('exercise/log', {
      exercises,
    });
  },
  async addFoodToLog(
    foods: Array<FoodProps>,
    loggingOptions: Partial<loggingOptionsProps>,
  ) {
    return await apiClient.post('log', {
      foods,
      ...loggingOptions,
    });
  },
  async deleteFoodFromLog(foodIds: Array<{id: string}>) {
    return await apiClient.delete('log', {
      data: {
        foods: foodIds,
      },
    });
  },
};

export default userLogService;