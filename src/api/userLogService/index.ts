import apiClient from 'api';

const userLogService = {
  async getTotals({
    beginDate,
    endDate,
    userId,
    timezone,
  }: {
    beginDate: string;
    endDate: string;
    userId: number;
    timezone: string;
  }) {
    return await apiClient.get(`reports/totals${userId ? `/${userId}` : ''}`, {
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
    userId,
    timezone,
  }: {
    beginDate: string;
    endDate: string;
    offset: number | undefined;
    userId: number;
    timezone: string;
  }) {
    return await apiClient.get(`log${userId ? `/${userId}` : ''}`, {
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
    userId,
    timezone,
  }: {
    beginDate: string;
    endDate: string;
    offset: number | undefined;
    userId: number;
    timezone: string;
  }) {
    return await apiClient.get(`weight/log${userId ? `/${userId}` : ''}`, {
      params: {
        begin: beginDate,
        end: endDate,
        offset,
        timezone,
        limit: 500,
      },
    });
  },
  async addWeightlog(weights: any) {
    return await apiClient.post('weight/log', {
      weights,
    });
  },
  async updateWeightlog(weights: any) {
    return await apiClient.put('weight/log', {
      weights,
    });
  },
  async getUserExerciseslog({
    beginDate,
    endDate,
    offset,
    userId,
    timezone,
  }: {
    beginDate: string;
    endDate: string;
    offset: number | undefined;
    userId: number;
    timezone: string;
  }) {
    return await apiClient.get(`exercise/log${userId ? `/${userId}` : ''}`, {
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
  async addExerciseLog(exercises: any) {
    return await apiClient.post('exercise/log', {
      exercises,
    });
  },
  async updateExerciseLog(exercises: any) {
    return await apiClient.put('exercise/log', {
      exercises,
    });
  },
  async addFoodToLog(foods: any, loggingOptions: any) {
    return await apiClient.post('log', {
      foods,
      ...loggingOptions,
    });
  },
  async deleteFoodFromLog(foodIds: Array<{id: number}>) {
    return await apiClient.delete('log', {
      data: {
        foods: foodIds,
      },
    });
  },
};

export default userLogService;
