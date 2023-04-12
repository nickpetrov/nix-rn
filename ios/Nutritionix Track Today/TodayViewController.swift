//
//  TodayViewController.swift
//  Nutritionix Track
//
//  Created by Nick Pe on 5/24/17.
//
//

import UIKit
import NotificationCenter

class TodayViewController: UIViewController, NCWidgetProviding {
    
    @IBAction func openApp(_ sender: AnyObject) {
        let url: URL = URL(string: "https://nutritionix.app.link")!
        self.extensionContext!.open(url,completionHandler: nil)
    }
    @IBOutlet weak var CaloriesProgress: UIProgressView!
    @IBOutlet weak var CaloriesProgressColorizer: UIProgressView!
    @IBOutlet weak var CaloriesIntake: UILabel!
    @IBOutlet weak var CaloriesBurned: UILabel!
    @IBOutlet weak var CaloriesRemaining: UILabel!
    @IBOutlet weak var RemainingTitle: UILabel!
    @IBOutlet weak var outdatedMessage: UILabel!
    
    let defaults:UserDefaults = UserDefaults(suiteName: "group.nutritionix.nixtrack")!
    
    let dateFormatter = DateFormatter()
    let currentDate:Date = Date()
    
    var dataUpdateDate:String = ""
    var caloriesConsumedText:String = "0 cal intake"
    var caloriesBurnedText:String = "0 cal burned"
    var caloriesRemainingText:String = "0 cal remains"
    var caloriesLimitValue:Int = 2000
    var caloriesRemainingValue:Int = 0
    var caloriesConsumedValue:Int = 0
    var caloriesBurnedValue:Int = 0
    var progressValue:Float = 0
    var oldProgressValue:Float = 0
    var progressBarColor: UIColor = UIColor(red: 0.16, green: 0.65, blue: 0.3, alpha: 1)
    var progressBarColorizerColor: UIColor = UIColor(red: 0.16, green: 0.65, blue: 0.3, alpha: 1)
    var scaledBar:Bool = false
    
    func getBarColor(progressValue: Float) -> UIColor {
        var color:UIColor = UIColor(red: 0.16, green: 0.65, blue: 0.3, alpha: 1)
        if progressValue >= 1 {
            color = UIColor(red: 0.94, green: 0.31, blue: 0.23, alpha: 1)
        } else if progressValue >= 0.9 {
            color = UIColor(red: 0.94, green: 0.72, blue: 0.25, alpha: 1)
        }
        return color
    }
    
    
    override func viewWillAppear(_ animated: Bool)
    {
        super.viewWillAppear(animated)

        dateFormatter.dateFormat = "MM-dd-yyyy"
        dateFormatter.timeZone = TimeZone(identifier:"GMT")
        
        let today:String = (dateFormatter.string(from: currentDate))
        
        CaloriesProgressColorizer.alpha = 0.0
        
        if (!scaledBar){
            CaloriesProgress.transform = CaloriesProgress.transform.scaledBy(x: 1, y: 5)
            CaloriesProgressColorizer.transform = CaloriesProgressColorizer.transform.scaledBy(x: 1, y: 5)
            scaledBar = true
        }
        if let UDcaloriesConsumedValue:String = defaults.string(forKey: "caloriesConsumed") {
            caloriesConsumedValue = (Int(UDcaloriesConsumedValue))!
        }
        if let UDcaloriesBurnedValue:String = defaults.string(forKey: "caloriesBurned") {
            caloriesBurnedValue = (Int(UDcaloriesBurnedValue))!
        }
        if let UDcaloriesLimitValue:String = defaults.string(forKey: "caloriesLimit") {
            caloriesLimitValue = (Int(UDcaloriesLimitValue))!
        }
        if let UDoldProgressValue:String = defaults.string(forKey: "oldProgressValue") {
            oldProgressValue = (Float(UDoldProgressValue))!
        }
        if let UDdataUpdateDate:String = defaults.string(forKey: "caloriesUpdateDate") {
            dataUpdateDate = UDdataUpdateDate
        }
        
        if (today != dataUpdateDate){
            outdatedMessage.alpha = 1
        } else {
            outdatedMessage.alpha = 0
        }
    
        if (caloriesConsumedValue != 0){
            caloriesRemainingValue = caloriesLimitValue - caloriesConsumedValue + caloriesBurnedValue
            progressValue = (Float(caloriesConsumedValue) - Float(caloriesBurnedValue) ) / Float(caloriesLimitValue)
        } else {
            caloriesRemainingValue = caloriesLimitValue + caloriesBurnedValue
            progressValue = 0
        }
        
        progressBarColorizerColor = getBarColor(progressValue: progressValue)
        progressBarColor = getBarColor(progressValue: oldProgressValue)
        
        self.CaloriesProgress.progressTintColor = self.progressBarColor
        CaloriesProgress.progress = oldProgressValue
        CaloriesProgressColorizer.progress = oldProgressValue
        
        defaults.set(String(progressValue), forKey: "oldProgressValue")
        
        if caloriesRemainingValue < 0 {
            RemainingTitle.text = "Over"
        }
        
        CaloriesIntake.text = String(caloriesConsumedValue)
        CaloriesBurned.text = String(caloriesBurnedValue)
        CaloriesRemaining.text = String(caloriesRemainingValue)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view from its nib.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        self.CaloriesProgressColorizer.progressTintColor = self.progressBarColorizerColor
        
        if (oldProgressValue != progressValue){
            UIView.animate(withDuration: 1.0, animations: {
                self.CaloriesProgressColorizer.alpha = 1.0
                self.CaloriesProgress.setProgress(self.progressValue, animated: true)
                self.CaloriesProgressColorizer.setProgress(self.progressValue, animated: true)
            }, completion: { (finished: Bool) in
                self.CaloriesProgress.progressTintColor = self.progressBarColorizerColor
                self.CaloriesProgressColorizer.alpha = 0.0
            })
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func widgetPerformUpdate(completionHandler: (@escaping (NCUpdateResult) -> Void)) {
        // Perform any setup necessary in order to update the view.
        // If an error is encountered, use NCUpdateResult.Failed
        // If there's no update required, use NCUpdateResult.NoData
        // If there's an update, use NCUpdateResult.NewData
        
        completionHandler(NCUpdateResult.newData)
    }
    
}
