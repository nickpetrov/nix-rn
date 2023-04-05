    package com.nutritionix.nixtrack;

    import android.appwidget.AppWidgetManager;
    import android.appwidget.AppWidgetProvider;
    import android.content.Context;
    import android.widget.RemoteViews;
    import android.view.View;
    import android.widget.ProgressBar;
    import android.widget.TextView;
    import androidx.annotation.NonNull;
    import com.facebook.react.bridge.Arguments;
    import com.facebook.react.bridge.Promise;
    import com.facebook.react.bridge.ReactContext;
    import android.content.SharedPreferences;

    import org.json.JSONArray;
    import org.json.JSONException;
    import org.json.JSONObject;

    import java.text.SimpleDateFormat;
    import java.util.Calendar;
    import java.util.Date;
    import java.util.Locale;

    public class NutritionixWidgetProvider extends android.appwidget.AppWidgetProvider {

        protected int getResourceId(String name, String type, Context context) {
            int resourceId = context.getResources().getIdentifier(name, type, context.getPackageName());
            if (resourceId == 0) {
                throw new RuntimeException("Resource '" + context.getPackageName() + ":" + type + "/" + name + "' not found");
            }
            return resourceId;
        }

        protected int getMainLayoutResourceId(android.content.Context context) {
        return getResourceId("nutritionix_widget_layout", "layout", context);
        }

        protected int getViewResourceId(android.content.Context context) {
        return getResourceId("nutritionix_widget_view", "id", context);
        }

        protected int getProgressBarGreenResourceId(android.content.Context context) {
        return getResourceId("nutritionix_widget_progressbar_green", "id", context);
        }

        protected int getProgressBarYellowResourceId(android.content.Context context) {
        return getResourceId("nutritionix_widget_progressbar_yellow", "id", context);
        }

        protected int getProgressBarRedResourceId(android.content.Context context) {
        return getResourceId("nutritionix_widget_progressbar_red", "id", context);
        }

        protected int getLayoutResourceId(android.content.Context context) {
        return getResourceId("nutritionix_widget_view", "layout", context);
        }

        protected int getConsumedValueResourceId(android.content.Context context) {
        return getResourceId("consumed_calories_value", "id", context);
        }

        protected int getBurnedValueResourceId(android.content.Context context) {
        return getResourceId("burned_calories_value", "id", context);
        }

        protected int getRemainingValueResourceId(android.content.Context context) {
        return getResourceId("remaining_calories_value", "id", context);
        }

        protected int getRemainingLabelResourceId(android.content.Context context) {
        return getResourceId("remaining_calories_text", "id", context);
        }

        protected int getOutdatedMessageResourceId(android.content.Context context) {
        return getResourceId("outdated_message_text", "id", context);
        }

        public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // Iterate over each widget instance
        for (int appWidgetId : appWidgetIds) {
            // Find the TextView and ProgressBar elements in the widget's layout
            RemoteViews views = new RemoteViews(context.getPackageName(), getMainLayoutResourceId(context));

            // Update the widget UI based on the data retrieved from AsyncStorage
            updateWidgetUI(context, views);

            // Update the widget with the new RemoteViews
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
        }

        private void updateWidgetUI(Context context, RemoteViews views) {
            // Get the current day of the year
            Calendar calendar = Calendar.getInstance();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String currentDay = dateFormat.format(calendar.getTime());

                SharedPreferences sharedPreferences = context.getSharedPreferences("widget", Context.MODE_PRIVATE);

                int consumed = sharedPreferences.getInt("consumed", 0);
                int burned = sharedPreferences.getInt("burned", 0);
                int limit = sharedPreferences.getInt("limit", 0);
                String updateDate = sharedPreferences.getString("date", "");
                int overValue = 0;
                int currentValue = consumed - burned;

                if (limit - currentValue < 0) {
                    overValue = currentValue - limit;
                }

                // Update the TextView and ProgressBar elements based on the widget's data
                views.setTextViewText(getConsumedValueResourceId(context), String.valueOf(consumed));
                views.setTextViewText(getBurnedValueResourceId(context), String.valueOf(burned));

                if (currentValue < limit * 0.9) {
                    views.setViewVisibility(getProgressBarGreenResourceId(context), View.VISIBLE);
                    views.setProgressBar(getProgressBarGreenResourceId(context), limit, currentValue, false);
                    views.setViewVisibility(getProgressBarYellowResourceId(context), View.GONE);
                    views.setViewVisibility(getProgressBarRedResourceId(context), View.GONE);
                } else if (currentValue < limit) {
                    views.setViewVisibility(getProgressBarYellowResourceId(context), View.VISIBLE);
                    views.setProgressBar(getProgressBarYellowResourceId(context), limit, currentValue, false);
                    views.setViewVisibility(getProgressBarGreenResourceId(context), View.GONE);
                    views.setViewVisibility(getProgressBarRedResourceId(context), View.GONE);
                } else {
                    views.setViewVisibility(getProgressBarRedResourceId(context), View.VISIBLE);
                    views.setProgressBar(getProgressBarRedResourceId(context), 100, 100, false);
                    views.setViewVisibility(getProgressBarGreenResourceId(context), View.GONE);
                    views.setViewVisibility(getProgressBarYellowResourceId(context), View.GONE);
                }

                if (overValue < 1) {
                    views.setTextViewText(getRemainingValueResourceId(context), String.valueOf(limit - currentValue));
                    views.setTextViewText(getRemainingLabelResourceId(context), "Remaining");
                } else {
                    views.setTextViewText(getRemainingValueResourceId(context), String.valueOf(overValue));
                    views.setTextViewText(getRemainingLabelResourceId(context), "Over");
                }

                // Set the showText value based on whether the day is today or not
                boolean showText = !currentDay.equals(updateDate);
                views.setViewVisibility(getOutdatedMessageResourceId(context), showText ? View.VISIBLE : View.GONE);

        }

    }
