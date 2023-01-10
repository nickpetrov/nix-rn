// @ts-ignore
import wd from 'wd';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const PORT = 4723;
const config = {
  platformName: 'Android',
  deviceName: 'Pixel_2_API_31',
  app: './android/app/build/outputs/apk/debug/app-debug.apk', // relative to root of project
};
const driver = wd.promiseChainRemote('localhost', PORT);

beforeAll(async () => {
  await driver.init(config);
  await driver.sleep(2000); // wait for app to load
});

test('appium render not exist screen', async () => {
  expect(await driver.hasElementByAccessibilityId('not-exist')).toBe(false);
});
test('appium render startup screen', async () => {
  expect(await driver.hasElementByAccessibilityId('startup')).toBe(true);
});
test('appium render login screen', async () => {
  expect(await driver.hasElementByAccessibilityId('login')).toBe(true);
});
