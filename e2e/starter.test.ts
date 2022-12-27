import {by, device, expect, element} from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: {
        detoxURLBlacklistRegex:
          ' \\("^http://localhost:\\d{4}?/[a-z]+/\\d{4}?$"\\)',
      },
      permissions: {
        notifications: 'YES',
        camera: 'YES',
        microphone: 'YES',
        photos: 'YES',
      },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have login screen', async () => {
    await expect(element(by.id('login'))).toExist();
  });
});
