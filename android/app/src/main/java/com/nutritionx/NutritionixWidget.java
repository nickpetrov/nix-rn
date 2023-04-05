package com.nutritionix.nixtrack;

import android.content.Context;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class NutritionixWidget extends ReactContextBaseJavaModule {
  private static final String PLUGIN_NAME = "NutritionixWidget";

  public NutritionixWidget(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return PLUGIN_NAME;
  }

  @ReactMethod
  public void updateData(ReadableMap data) {
    int consumed = data.getInt("consumed");
    int burned = data.getInt("burned");
    int limit = data.getInt("limit");
    String date = data.getString("date");

    Context context = getReactApplicationContext().getApplicationContext();
    com.nutritionix.nixtrack.NutritionixWidgetData.add(consumed, burned, limit, date, context);
  }

  @ReactMethod
  public void getAction(Callback successCallback) {
    Context context = getReactApplicationContext().getApplicationContext();
    int actionNumber = com.nutritionix.nixtrack.NutritionixWidgetData.getAction(context);
    successCallback.invoke(actionNumber);
  }
}
