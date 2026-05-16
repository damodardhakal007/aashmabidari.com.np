import Foundation
import Combine

class UserPreferences: ObservableObject {
    static let shared = UserPreferences()
    
    private let defaults = UserDefaults.standard
    
    // Keys
    private enum Keys {
        static let isFirstTime = "isFirstTime"
        static let language = "language"
        static let isDarkMode = "isDarkMode"
        static let isFloatingTimerEnabled = "isFloatingTimerEnabled"
        static let selectedFont = "selectedFont"
        static let profileName = "profileName"
        static let profilePhone = "profilePhone"
        static let profileLocation = "profileLocation"
        static let profileGender = "profileGender"
        static let profileImage = "profileImage"
        static let recentServices = "recentServices"
        static let activityLog = "activityLog"
        static let isLoggedIn = "isLoggedIn"
    }
    
    @Published var isFirstTime: Bool? {
        didSet {
            if let value = isFirstTime {
                defaults.set(!value, forKey: Keys.isFirstTime)
            }
        }
    }
    
    @Published var language: String {
        didSet { defaults.set(language, forKey: Keys.language) }
    }
    
    @Published var isDarkMode: Bool {
        didSet { defaults.set(isDarkMode, forKey: Keys.isDarkMode) }
    }
    
    @Published var isFloatingTimerEnabled: Bool {
        didSet { defaults.set(isFloatingTimerEnabled, forKey: Keys.isFloatingTimerEnabled) }
    }
    
    @Published var selectedFont: String {
        didSet { defaults.set(selectedFont, forKey: Keys.selectedFont) }
    }
    
    @Published var profileName: String {
        didSet { defaults.set(profileName, forKey: Keys.profileName) }
    }
    
    @Published var profilePhone: String {
        didSet { defaults.set(profilePhone, forKey: Keys.profilePhone) }
    }
    
    @Published var profileLocation: String {
        didSet { defaults.set(profileLocation, forKey: Keys.profileLocation) }
    }
    
    @Published var profileGender: String {
        didSet { defaults.set(profileGender, forKey: Keys.profileGender) }
    }
    
    @Published var profileImage: String? {
        didSet { defaults.set(profileImage, forKey: Keys.profileImage) }
    }
    
    @Published var recentServices: [String] {
        didSet { defaults.set(recentServices, forKey: Keys.recentServices) }
    }
    
    @Published var isLoggedIn: Bool {
        didSet { defaults.set(isLoggedIn, forKey: Keys.isLoggedIn) }
    }
    
    @Published var activityLog: [ServiceActivity] = []
    
    init() {
        let hasCompletedFirstTime = defaults.bool(forKey: Keys.isFirstTime)
        self.isFirstTime = hasCompletedFirstTime ? false : (defaults.object(forKey: Keys.isFirstTime) == nil ? true : false)
        self.language = defaults.string(forKey: Keys.language) ?? "en"
        self.isDarkMode = defaults.object(forKey: Keys.isDarkMode) != nil ? defaults.bool(forKey: Keys.isDarkMode) : true
        self.isFloatingTimerEnabled = defaults.bool(forKey: Keys.isFloatingTimerEnabled)
        self.selectedFont = defaults.string(forKey: Keys.selectedFont) ?? "System"
        self.profileName = defaults.string(forKey: Keys.profileName) ?? ""
        self.profilePhone = defaults.string(forKey: Keys.profilePhone) ?? ""
        self.profileLocation = defaults.string(forKey: Keys.profileLocation) ?? ""
        self.profileGender = defaults.string(forKey: Keys.profileGender) ?? ""
        self.profileImage = defaults.string(forKey: Keys.profileImage)
        self.recentServices = defaults.stringArray(forKey: Keys.recentServices) ?? []
        self.isLoggedIn = defaults.bool(forKey: Keys.isLoggedIn)
        
        loadActivityLog()
    }
    
    func setFirstTimeCompleted() {
        isFirstTime = false
        defaults.set(true, forKey: Keys.isFirstTime)
    }
    
    func addRecentService(_ serviceId: String) {
        var recent = recentServices
        recent.removeAll { $0 == serviceId }
        recent.insert(serviceId, at: 0)
        if recent.count > 20 {
            recent = Array(recent.prefix(20))
        }
        recentServices = recent
    }
    
    func logActivity(serviceId: String, durationSeconds: Int) {
        let activity = ServiceActivity(
            serviceId: serviceId,
            timestamp: Date().timeIntervalSince1970,
            durationSeconds: durationSeconds
        )
        activityLog.insert(activity, at: 0)
        
        // Keep only last 60 days
        let sixtyDaysAgo = Date().timeIntervalSince1970 - (60 * 24 * 60 * 60)
        activityLog = activityLog.filter { $0.timestamp >= sixtyDaysAgo }
        
        saveActivityLog()
    }
    
    private func saveActivityLog() {
        if let data = try? JSONEncoder().encode(activityLog) {
            defaults.set(data, forKey: Keys.activityLog)
        }
    }
    
    private func loadActivityLog() {
        if let data = defaults.data(forKey: Keys.activityLog),
           let log = try? JSONDecoder().decode([ServiceActivity].self, from: data) {
            activityLog = log
        }
    }
    
    func updateProfile(name: String, phone: String, location: String, gender: String, imageUri: String?) {
        profileName = name
        profilePhone = phone
        profileLocation = location
        profileGender = gender
        profileImage = imageUri
    }
}
