//
//  Nutritionix_Track.swift
//  Nutritionix Track
//
//  Created by ROOM4 on 4/10/23.
//

import WidgetKit
import SwiftUI


struct Nutritionix_Track: Widget {
    private let kind: String = "Nutritionix_Track"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            CalorieWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Calorie Summary Widget")
        .description("Displays today's calorie summary.")
    }
}


struct CalorieSummaryWidgetEntry: TimelineEntry {
    let date: Date
    let progressValue: Float
    let caloriesConsumed: Float
    let caloriesBurned: Float
    let caloriesLimit: Float
    let caloriesRemaining: Float
    let caloriesUpdateDate: String
}

class UserData: ObservableObject {
    let sharedUserDefaults: UserDefaults
    
    init(sharedUserDefaults: UserDefaults) {
        self.sharedUserDefaults = sharedUserDefaults
    }
    
    @Published var caloriesConsumed: Float = 0
    @Published var caloriesBurned: Float = 0
    @Published var caloriesLimit: Float = 2000
    @Published var caloriesUpdateDate: String = ""
    @Published var lastUpdateDate: Date = Date()

    func start() {
        NotificationCenter.default.addObserver(self, selector: #selector(update), name: UserDefaults.didChangeNotification, object: nil)
        self.update()
    }
    
    @objc func update() {
        caloriesConsumed = sharedUserDefaults.float(forKey: "caloriesConsumed")
        caloriesBurned = sharedUserDefaults.float(forKey: "caloriesBurned")
        caloriesLimit = sharedUserDefaults.float(forKey: "caloriesLimit")
        caloriesUpdateDate = sharedUserDefaults.string(forKey: "caloriesUpdateDate") ?? ""
        lastUpdateDate = Date()


        if #available(iOS 14.0, *) {
            // Reload the timeline for this widget immediately
            WidgetCenter.shared.reloadTimelines(ofKind: "Nutritionix_Track")
        }
    }
}

struct Provider: TimelineProvider {
    @ObservedObject private var userData: UserData
    
    init() {
        let sharedUserDefaults = UserDefaults(suiteName: "group.nutritionix.nixtrack")!
        self.userData = UserData(sharedUserDefaults: sharedUserDefaults)
        self.userData.start()
    }

    func todayString() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let currentDate = dateFormatter.string(from: Date())
        return currentDate
    }
    func placeholder(in context: Context) -> CalorieSummaryWidgetEntry {
        CalorieSummaryWidgetEntry(
            date: Date(),
            progressValue: 0,
            caloriesConsumed: 0,
            caloriesBurned: 0,
            caloriesLimit: 2000,
            caloriesRemaining: 0,
            caloriesUpdateDate: todayString()
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (CalorieSummaryWidgetEntry) -> Void) {
        let entry = CalorieSummaryWidgetEntry(
            date: Date(),
            progressValue: 0,
            caloriesConsumed: 0,
            caloriesBurned: 0,
            caloriesLimit: 2000,
            caloriesRemaining: 0,
            caloriesUpdateDate: todayString()
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CalorieSummaryWidgetEntry>) -> Void) {
     let entries: [CalorieSummaryWidgetEntry] = []
        guard let sharedUserDefaults = UserDefaults(suiteName: "group.nutritionix.nixtrack") else {
            let timeline = Timeline(entries: entries, policy: .atEnd)
            completion(timeline)
            return
        }

        let caloriesConsumed = sharedUserDefaults.float(forKey: "caloriesConsumed")
        let caloriesBurned = sharedUserDefaults.float(forKey: "caloriesBurned")
        let caloriesLimit = sharedUserDefaults.float(forKey: "caloriesLimit")
        let caloriesUpdateDate = sharedUserDefaults.string(forKey: "caloriesUpdateDate") ?? ""
        var progressValue:Float = 0
        var caloriesRemaining:Float = 0

        if (caloriesConsumed != 0){
            caloriesRemaining = caloriesLimit - caloriesConsumed + caloriesBurned
            progressValue = (Float(caloriesConsumed) - Float(caloriesBurned) ) / Float(caloriesLimit)
        } else {
            caloriesRemaining = caloriesLimit + caloriesBurned
            progressValue = 0
        }

        let currentDate = Date()
        let midnight = Calendar.current.startOfDay(for: currentDate)
        let entryDate: Date

        if let storedDate = sharedUserDefaults.object(forKey: "lastWidgetUpdate") as? Date {
            entryDate = storedDate
        } else {
            entryDate = midnight
        }

        if currentDate.timeIntervalSince(entryDate) < 60 * 30 { // update at most every 30 minutes
            let entry = CalorieSummaryWidgetEntry(
                date: entryDate,
                progressValue: progressValue,
                caloriesConsumed: caloriesConsumed,
                caloriesBurned: caloriesBurned,
                caloriesLimit: caloriesLimit,
                caloriesRemaining: caloriesRemaining,
                caloriesUpdateDate: caloriesUpdateDate
            )
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
            return
        }

        // update entry
        let entry = CalorieSummaryWidgetEntry(
            date: midnight,
            progressValue: progressValue,
            caloriesConsumed: caloriesConsumed,
            caloriesBurned: caloriesBurned,
            caloriesLimit: caloriesLimit,
            caloriesRemaining: caloriesRemaining,
            caloriesUpdateDate: caloriesUpdateDate
        )

        sharedUserDefaults.set(currentDate, forKey: "lastWidgetUpdate")

        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
    }
}

struct CalorieWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .center, spacing: 5) {
            Text("Today's Calorie Summary:")
                .font(.headline)
                .multilineTextAlignment(.center)
            ProgressView(value: entry.progressValue)
                .progressViewStyle(
                    LinearProgressViewStyle(
                        tint: getBarColor(progressValue: entry.progressValue)
                    )
                )
                .frame(height: 20)

            HStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 5) {
                    Text("\(Int(entry.caloriesConsumed))")
                        .font(.headline)
                    Text("Consumed")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                Spacer()
                VStack(alignment: .center, spacing: 5) {
                    Text("\(Int(entry.caloriesBurned))")
                        .font(.headline)
                    Text("Burned")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 5) {
                    Text("\(Int(entry.caloriesRemaining))")
                        .font(.headline)
                    Text(entry.caloriesRemaining < 0 ? "Over" : "Remaining")
                        .font(.caption)
                        .foregroundColor(entry.caloriesRemaining < 0 ? .red : .gray)
                }
            }

            if !isToday(entry.caloriesUpdateDate) {
                Text("Data is outdated. Please run the app to update data.")
                    .foregroundColor(.red)
                    .multilineTextAlignment(.center)
                    .font(.system(size: 12)) // This sets the font size to 12 points
            }
        }
        .padding()
    }

    func isToday(_ dateStr: String) -> Bool {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM-dd-yyyy"
        if let date = dateFormatter.date(from: dateStr) {
            return Calendar.current.isDateInToday(date)
        } else {
        return false // or handle the error in some other way
        }
    }

    func getBarColor(progressValue: Float) -> Color {
        var color = Color(red: 0.16, green: 0.65, blue: 0.3, opacity: 1)
        if progressValue >= 1 {
            color = Color(red: 0.94, green: 0.31, blue: 0.23, opacity: 1)
        } else if progressValue >= 0.9 {
            color = Color(red: 0.94, green: 0.72, blue: 0.25, opacity: 1)
        }
        return color
    }
}

struct CalorieWidgetEntryView_Previews: PreviewProvider {
    static func todayString() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let currentDate = dateFormatter.string(from: Date())
        return currentDate
    }
    
    static var previews: some View {
        CalorieWidgetEntryView(entry: Provider.Entry(date: Date(), progressValue: 0.5, caloriesConsumed: 1500, caloriesBurned: 500, caloriesLimit: 2000, caloriesRemaining: 1000, caloriesUpdateDate: todayString()))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}