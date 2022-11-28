import apiClient from 'api';
import {TotalProps} from 'store/userLog/userLog.types';
import {OptionsProps} from './types';

const coachService = {
  async getClientTotals(options: OptionsProps) {
    return await apiClient.get<{dates: TotalProps[]}>(
      `reports/totals/${options.clientId}`,
      {
        params: {
          begin: options.begin,
          end: options.end,
          timezone: options.timezone,
        },
      },
    );
  },
};

export default coachService;
