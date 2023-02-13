import apiClient from 'api';
import {getWeightParams} from 'store/stats/stats.types';
import {
  ExerciseProps,
  FoodProps,
  loggingOptionsProps,
  WaterLogProps,
  WeightProps,
  TotalProps,
} from 'store/userLog/userLog.types';

const userLogService = {
  async getTotals(
    {
      beginDate,
      endDate,
      timezone,
    }: {
      beginDate: string;
      endDate: string;
      timezone: string;
    },
    cancelSignal?: AbortSignal,
  ) {
    return await apiClient.get('reports/totals', {
      params: {
        begin: beginDate,
        end: endDate,
        timezone,
      },
      signal: cancelSignal,
    });
  },
  async setDayNotes(data: {
    dates: Array<{date: string; notes: string | null}>;
  }) {
    return await apiClient.put<{dates: TotalProps[]}>('reports/totals', data);
  },
  async getUserFoodlog(
    {
      beginDate,
      endDate,
      offset,
      timezone,
    }: {
      beginDate: string;
      endDate: string;
      offset: number | undefined;
      timezone: string;
    },
    cancelSignal?: AbortSignal,
  ) {
    return await apiClient.get('log', {
      params: {
        begin: beginDate,
        end: endDate,
        offset,
        timezone,
        limit: 500,
      },
      signal: cancelSignal,
    });
  },
  async getUserWeightlog(
    {begin, end, offset, timezone, limit}: getWeightParams,
    cancelSignal?: AbortSignal,
  ) {
    return await apiClient.get<{weights: WeightProps[]}>('weight/log', {
      params: {
        begin,
        end,
        offset,
        timezone,
        limit: limit || 500,
      },
      signal: cancelSignal,
    });
  },
  async addWeightlog(weights: Array<Partial<WeightProps>>) {
    return await apiClient.post<{weights: WeightProps[]}>('weight/log', {
      weights,
    });
  },
  async updateWeightlog(weights: Array<WeightProps>) {
    return await apiClient.put<{weights: WeightProps[]}>('weight/log', {
      weights,
    });
  },
  async getUserExerciseslog(
    {
      beginDate,
      endDate,
      offset,
      timezone,
    }: {
      beginDate: string;
      endDate: string;
      offset: number | undefined;
      timezone: string;
    },
    cancelSignal?: AbortSignal,
  ) {
    return await apiClient.get('exercise/log', {
      params: {
        begin: beginDate,
        end: endDate,
        offset,
        timezone,
        limit: 500,
      },
      signal: cancelSignal,
    });
  },
  async getExerciseByQuery(user_data: {
    age: number | null;
    query: string;
    height_cm: number | null;
    weight_kg: number | null;
    gender: string | null;
  }) {
    return await apiClient.post('natural/exercise', user_data);
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
  async updateFoodFromLog(foods: Array<FoodProps>) {
    return await apiClient.put<{foods: FoodProps[]}>('log', {
      foods,
    });
  },
  async deleteFoodFromLog(foodIds: Array<{id: string}>) {
    return await apiClient.delete('log', {
      data: {
        foods: foodIds,
      },
    });
  },
  async deleteWeightFromLog(weights: Array<{id: string}>) {
    return await apiClient.delete('weight/log', {
      data: {
        weights,
      },
    });
  },
  async deleteExerciseFromLog(exercises: Array<{id: string}>) {
    return await apiClient.delete('exercise/log', {
      data: {
        exercises,
      },
    });
  },
  async addWaterLog(water: Array<WaterLogProps>) {
    return await apiClient.post('water/log/add', {
      logs: water,
    });
  },
  async updateWaterLog(water: Array<WaterLogProps>) {
    return await apiClient.put('water/log', {
      logs: water,
    });
  },
  async deleteWaterFromLog(water: Array<{date: string}>) {
    return await apiClient.delete('water/log', {
      data: {
        logs: water,
      },
    });
  },
};

export default userLogService;
