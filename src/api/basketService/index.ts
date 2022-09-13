import apiClient from 'api';

const basketService = {
  async getFoodForBasket(query: string) {
    return await apiClient.post(
      'natural/nutrients',
      {
        query,
      },
      {
        headers: {
          'x-app-id': '906641bd',
          'x-app-key': '59bcfe12c0e9965162798a31ff38ec1f',
        },
      },
    );
  },
};

export default basketService;
