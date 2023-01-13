import apiClient from 'api';
import {TotalProps} from 'store/userLog/userLog.types';
import {OptionsProps} from './types';
import {Platform} from 'react-native';
import {Coach} from 'store/coach/coach.types';
import {User} from 'store/auth/auth.types';

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
  async getClients() {
    return await apiClient.get<{patients: User[]}>('share/patients');
  },
  async getCoaches() {
    return await apiClient.get<{coaches: Coach[]}>('share/coaches');
  },
  async becomeCoach() {
    return await apiClient.post('me/coach');
  },
  async stopBeingCoach() {
    return await apiClient.delete('me/coach');
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
  async validatePurchase(receipt: string, signature: string) {
    const data = {
      receipt: receipt,
      platform: Platform.OS,
      signature: signature,
    };
    return await apiClient.post('iap/validateReceipt', data);
  },
};

export default coachService;
