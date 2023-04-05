package com.nutritionix.nixtrack;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import android.content.SharedPreferences;

public class NutritionixWidgetProvider extends android.appwidget.AppWidgetProvider {
    public static final String WIDGET_IDS_KEY ="nixtrackwidgetproviderwidgetids";

    public static final String ACTION_WIDGET_REFRESH = "NutritionixWidgetRefresh";

    protected int getMainLayoutResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("nutritionix_widget_layout", "layout", context);
    }

    protected int getViewResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("nutritionix_widget_view", "id", context);
    }

    protected int getProgressBarGreenResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("nutritionix_widget_progressbar_green", "id", context);
    }

    protected int getProgressBarYellowResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("nutritionix_widget_progressbar_yellow", "id", context);
    }

    protected int getProgressBarRedResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("nutritionix_widget_progressbar_red", "id", context);
    }

    protected int getLayoutResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("nutritionix_widget_view", "layout", context);
    }

    protected int getConsumedValueResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("consumed_calories_value", "id", context);
    }

    protected int getBurnedValueResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("burned_calories_value", "id", context);
    }

    protected int getRemainingValueResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("remaining_calories_value", "id", context);
    }

    protected int getRemainingLabelResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("remaining_calories_text", "id", context);
    }

    protected int getOutdatedMessageResourceId(android.content.Context context) {
      return com.nutritionix.nixtrack.NutritionixWidgetData.getResourceId("outdated_message_text", "id", context);
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        NutritionixWidgetData.deleteWidget(appWidgetIds, getViewResourceId(context), context);
        super.onDeleted(context, appWidgetIds);
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
    }

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(ACTION_WIDGET_REFRESH)) {
            com.nutritionix.nixtrack.NutritionixWidgetData.setAction(1, context);
            try {
                Intent launchActivity = new Intent(context, Class.forName(context.getPackageName() + ".MainActivity"));
                if (launchActivity != null){
                    PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchActivity, 0);
                    pendingIntent.send();
                }
            }
            catch (Exception ex)
            {
                Toast.makeText(context, ex.toString(), Toast.LENGTH_LONG).show();
            }
        }

        if (intent.hasExtra(WIDGET_IDS_KEY)) {
            int[] ids = intent.getExtras().getIntArray(WIDGET_IDS_KEY);
            this.onUpdate(context, AppWidgetManager.getInstance(context), ids);
        } else super.onReceive(context, intent);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        updateWidgets(context, appWidgetManager, appWidgetIds);
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }

    public String getCurrentDate() {
        SimpleDateFormat isoFormat = new SimpleDateFormat("MM-dd-yyyy");
        isoFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        return isoFormat.format(new Date());
    }

    public void updateWidgets(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds){
      for (int i = 0; i < appWidgetIds.length; i++) {
        NutritionixWidgetData.addWidget(appWidgetIds[i], getViewResourceId(context), context);

        SharedPreferences sharedPreferences = context.getSharedPreferences(NutritionixWidgetData.WidgetDataPreferences, Context.MODE_PRIVATE);
        int burnedValue = sharedPreferences.getInt(NutritionixWidgetData.Burned, 0);
        int limitValue = sharedPreferences.getInt(NutritionixWidgetData.Limit, 0);
        int currentValue = sharedPreferences.getInt(NutritionixWidgetData.Consumed, 0) - burnedValue;
        int maxValue = limitValue;
        int overValue = 0;
        String updateDate = sharedPreferences.getString(NutritionixWidgetData.UpdateDate, "");
        if (maxValue-currentValue < 0){
          overValue = currentValue - maxValue;
        }

        RemoteViews rv = new RemoteViews(context.getPackageName(), getMainLayoutResourceId(context));
        if (currentValue < maxValue*0.9){
            rv.setViewVisibility(getProgressBarGreenResourceId(context),View.VISIBLE);
            rv.setProgressBar(getProgressBarGreenResourceId(context), maxValue, currentValue, false);
            rv.setViewVisibility(getProgressBarYellowResourceId(context),View.GONE);
            rv.setViewVisibility(getProgressBarRedResourceId(context),View.GONE);
        } else if (currentValue < maxValue){
            rv.setViewVisibility(getProgressBarYellowResourceId(context),View.VISIBLE);
            rv.setProgressBar(getProgressBarYellowResourceId(context), maxValue, currentValue, false);
            rv.setViewVisibility(getProgressBarGreenResourceId(context),View.GONE);
            rv.setViewVisibility(getProgressBarRedResourceId(context),View.GONE);
        } else {
            rv.setViewVisibility(getProgressBarRedResourceId(context),View.VISIBLE);
            rv.setProgressBar(getProgressBarRedResourceId(context), 100, 100, false);
            rv.setViewVisibility(getProgressBarGreenResourceId(context),View.GONE);
            rv.setViewVisibility(getProgressBarYellowResourceId(context),View.GONE);
        }

        rv.setTextViewText(getConsumedValueResourceId(context), String.valueOf(currentValue+burnedValue));
        rv.setTextViewText(getBurnedValueResourceId(context), String.valueOf(burnedValue));
        if (overValue < 1){
          rv.setTextViewText(getRemainingValueResourceId(context), String.valueOf(maxValue-currentValue));
          rv.setTextViewText(getRemainingLabelResourceId(context), "Remaining");
        } else {
          rv.setTextViewText(getRemainingValueResourceId(context), String.valueOf(overValue));
          rv.setTextViewText(getRemainingLabelResourceId(context), "Over");
        }

        String today = getCurrentDate();

        if (today.equals(updateDate)) {
            rv.setViewVisibility(getOutdatedMessageResourceId(context), View.GONE);
        } else {
            rv.setViewVisibility(getOutdatedMessageResourceId(context), View.VISIBLE);
        }

        try {
            Intent intent = new Intent(context, NutritionixWidgetProvider.class);
            if (intent != null){
                intent.setAction(ACTION_WIDGET_REFRESH);
                PendingIntent actionPendingIntent = PendingIntent.getBroadcast(context, 0, intent, 0);
                rv.setOnClickPendingIntent(getViewResourceId(context), actionPendingIntent);
            }
        }
        catch (Exception ex)
        {
            Toast.makeText(context, ex.toString(), Toast.LENGTH_LONG).show();
        }

        appWidgetManager.updateAppWidget(appWidgetIds[i], rv);
      }
    }
}