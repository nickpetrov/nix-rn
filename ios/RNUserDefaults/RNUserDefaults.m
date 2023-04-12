#import "RNUserDefaults.h"

@implementation RNUserDefaults

RCT_EXPORT_MODULE(UserDefaults)

RCT_EXPORT_METHOD(set:(NSString*)key value:(id)value suiteName:(NSString*)suiteName) {
  NSUserDefaults *userDefaults = [[NSUserDefaults alloc] initWithSuiteName:suiteName];
  [userDefaults setObject:value forKey:key];
}


RCT_EXPORT_METHOD(get:(NSString*)key callback:(RCTResponseSenderBlock)callback) {
    id value = [NSUserDefaults.standardUserDefaults objectForKey:key];
    callback(@[value]);
}

@end