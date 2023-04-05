package com.nutritionix.nixtrack;

import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SharedPreferencesModule extends ReactContextBaseJavaModule {

  private static final String PREFERENCE_NAME = "MyPreferences";
  private static SharedPreferences sharedPreferences;

  public SharedPreferencesModule(ReactApplicationContext reactContext) {
    super(reactContext);
    sharedPreferences = reactContext.getSharedPreferences(PREFERENCE_NAME, Context.MODE_PRIVATE);
  }

  @Override
  public String getName() {
    return "SharedPreferencesModule";
  }

  @ReactMethod
  public void writeData(String key, String value) {
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString(key, value);
    editor.apply();
  }
}
