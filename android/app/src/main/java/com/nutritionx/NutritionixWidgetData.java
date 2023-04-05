package com.nutritionix.nixtrack;

import android.appwidget.AppWidgetManager;
import java.util.ArrayList;
import android.content.Context;
import android.widget.RemoteViews;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.ComponentName;
import android.app.Application;
import android.content.res.Resources;

public class NutritionixWidgetData {
    static ArrayList<Integer> _items = new ArrayList<Integer>(); //TODO be lazy
    static ArrayList<UpdateEntry> _entries = new ArrayList<UpdateEntry>(); //TODO be lazy
    public static final String WidgetDataPreferences = "widget";
    public static final String Consumed = "consumed";
    public static final String Burned = "burned";
    public static final String Limit = "limit";
    public static final String UpdateDate = "date";
    public static final String WidgetIds = "widgetIds";
    public static final String ViewIds = "viewIds";
    public static final String Action = "action";
    
    public static SharedPreferences sharedPreferences;

    public static int getResourceId(String name, String type, Context context) {
        String packageName = ((Application)context.getApplicationContext()).getPackageName();
        Resources resources = ((Application)context.getApplicationContext()).getResources();
        int id = resources.getIdentifier(name, type, packageName);
        if (id == 0) {
            throw new RuntimeException("Resource '" + packageName + ":" + type + "/" + name + "' not found");
        }
        return id;
    }

    public static int getAction(android.content.Context context){
        if (sharedPreferences == null){
            sharedPreferences = context.getSharedPreferences(WidgetDataPreferences, Context.MODE_PRIVATE);
        }
        int action = sharedPreferences.getInt(com.nutritionix.nixtrack.NutritionixWidgetData.Action, 0);

        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt(Action, 0);
        editor.commit();
        setAction(0, context);

        return action;
    }

    public static void setAction(int action, android.content.Context context){
        if (sharedPreferences == null){
            sharedPreferences = context.getSharedPreferences(WidgetDataPreferences, Context.MODE_PRIVATE);
        }
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt(Action, action);
        editor.commit();
    }

    public static void add(int consumed, int burned, int limit, String updateDate, android.content.Context context) {
        if (sharedPreferences == null){
            sharedPreferences = context.getSharedPreferences(WidgetDataPreferences, Context.MODE_PRIVATE);
        }
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt(Consumed, consumed);
        editor.putInt(Burned, burned);
        editor.putInt(Limit, limit);
        editor.putString(UpdateDate, updateDate);
        editor.commit();

        String widgetsString = sharedPreferences.getString(WidgetIds, "");
        String viewsString = sharedPreferences.getString(ViewIds, "");

        if (widgetsString.length() != 0 && viewsString.length() != 0){

            _entries.clear();

            String[] stringWidgetIdsArr = widgetsString.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\\s", "").split(",");
            int[] widgetIdsArr = new int[stringWidgetIdsArr.length];
            for (int i = 0; i < stringWidgetIdsArr.length; i++) {
                try {
                    widgetIdsArr[i] = Integer.parseInt(stringWidgetIdsArr[i]);
                }
                catch(NumberFormatException numberEx) {
                    System.out.print(numberEx);
                }
            }

            String[] stringViewsIdsArr = viewsString.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\\s", "").split(",");
            int[] viewIdsArr = new int[stringViewsIdsArr.length];
            for (int i = 0; i < stringViewsIdsArr.length; i++) {
                try {
                    viewIdsArr[i] = Integer.parseInt(stringViewsIdsArr[i]);
                }
                catch(NumberFormatException numberEx) {
                    System.out.print(numberEx);
                }
            }

            for (int i = 0; i < widgetIdsArr.length; i++) {
                addWidget(widgetIdsArr[i], viewIdsArr[i], context);
            }
        }

        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        for (int i = 0; i < _entries.size(); i++) {
            mgr.notifyAppWidgetViewDataChanged(_entries.get(i).widgetId, _entries.get(i).viewId);
        }

        int[] ids = mgr.getAppWidgetIds(
                new ComponentName(context,NutritionixWidgetProvider.class));
        Intent updateIntent = new Intent();
        updateIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        updateIntent.putExtra(NutritionixWidgetProvider.WIDGET_IDS_KEY, ids);
        context.sendBroadcast(updateIntent);
    }

    public static void addWidget(int widgetId, int viewId, android.content.Context context) {
        _entries.add(new UpdateEntry(widgetId, viewId));

        if (sharedPreferences == null){
            sharedPreferences = context.getSharedPreferences(WidgetDataPreferences, Context.MODE_PRIVATE);
        }
        String widgetIdsString = "";
        String viewIdsString = "";

        for (int i = 0; i < _entries.size(); i++) {
            if (i == 0){
                widgetIdsString = String.valueOf(_entries.get(i).widgetId);
                viewIdsString = String.valueOf(_entries.get(i).viewId);
            } else {
                widgetIdsString = widgetIdsString +","+ String.valueOf(_entries.get(i).widgetId);
                viewIdsString = viewIdsString +","+ String.valueOf(_entries.get(i).viewId);
            }
        }

        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(WidgetIds, widgetIdsString);
        editor.putString(ViewIds, viewIdsString);
        editor.commit();
    }

    public static void deleteWidget(int[] widgetIds, int viewId, android.content.Context context) {
        for (int y = 0; y < widgetIds.length; y++) {
            int deletedWidgetIndex = -1;
            UpdateEntry deletedWidget = new UpdateEntry(widgetIds[y], viewId);

            for (int i = 0; i < _entries.size(); i++) {
                if (_entries.get(i).viewId == deletedWidget.viewId && _entries.get(i).widgetId == deletedWidget.widgetId){
                    deletedWidgetIndex = i;
                }
            }

            if (deletedWidgetIndex != -1){
                _entries.remove(deletedWidgetIndex);
            }
        }

        if (sharedPreferences == null){
            sharedPreferences = context.getSharedPreferences(WidgetDataPreferences, Context.MODE_PRIVATE);
        }
        String widgetIdsString = "";
        String viewIdsString = "";

        for (int i = 0; i < _entries.size(); i++) {
            widgetIdsString = widgetIdsString +" "+ String.valueOf(_entries.get(i).widgetId);
            viewIdsString = viewIdsString +" "+ String.valueOf(_entries.get(i).viewId);
        }

        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(WidgetIds, widgetIdsString);
        editor.putString(ViewIds, viewIdsString);
        editor.commit();
    }

    public static int[] getWidgetIds(android.content.Context context){
        int[] result = new int[_entries.size()];
        for (int i=0; i<_entries.size(); i++){
            result[i] = _entries.get(i).widgetId;
        }
        return result;
    }
}

class UpdateEntry {
    public UpdateEntry(int widgetId, int viewId) {
        this.widgetId = widgetId;
        this.viewId = viewId;
    }

    public int widgetId;
    public int viewId;
}
