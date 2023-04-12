import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class RNUserDefaults extends ReactContextBaseJavaModule {
  private static final String PLUGIN_NAME = "RNUserDefaults";
  private static final String PREFS_NAME = "MyPrefs";

  public RNUserDefaults(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return PLUGIN_NAME;
  }

  @ReactMethod
  public void get(String key, Promise promise) {
    SharedPreferences sharedPreferences = getSharedPreferences();
    if (sharedPreferences.contains(key)) {
      WritableMap result = Arguments.createMap();
      result.putString(key, sharedPreferences.getString(key, ""));
      promise.resolve(result);
    } else {
      promise.resolve(null);
    }
  }

  @ReactMethod
  public void set(String key, String value) {
    SharedPreferences sharedPreferences = getSharedPreferences();
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString(key, value);
    editor.apply();
  }

  private SharedPreferences getSharedPreferences() {
    return getReactApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
  }
}
