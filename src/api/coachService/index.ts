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
  async becomeCoach() {
    return await apiClient.post('me/coach');
  },
  async addCoach(coachId: string) {
    const data = {
      coach_code: coachId,
    };
    return await apiClient.post('share/coaches', data);
  },
  async removeCoach(coachId: string) {
    const data = {
      coach_code: coachId,
    };
    return await apiClient.delete('share/coaches', {data});
  },
};

export default coachService;
