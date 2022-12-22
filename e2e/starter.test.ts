import {by, device, expect, element} from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have startup screen', async () => {
    await waitFor(element(by.id('startup-screen')))
      .toBeVisible()
      .withTimeout(2000);
  });
  it('should have dashboard screen if store have jwtToken', async () => {
    await expect(element(by.id('dashboard'))).toBeVisible();
  });

  it('should have login screen if store do not have jwtToken', async () => {
    await expect(element(by.id('login'))).toBeVisible();
  });
});
