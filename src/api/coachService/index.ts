import apiClient from 'api';
import {OptionsProps} from './types';

const coachService = {
  async getClientTotals(options: OptionsProps) {
    return await apiClient.get(`reports/totals/${options.clientId}`, {
      params: {
        begin: options.begin,
        end: options.end,
        timezone: options.timezone,
      },
    });
  },
};

export default coachService;
