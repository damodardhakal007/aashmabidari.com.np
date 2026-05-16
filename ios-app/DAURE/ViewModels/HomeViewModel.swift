import Foundation
import Combine
import SwiftUI

class HomeViewModel: ObservableObject {
    // MARK: - Published Properties
    @Published var currentTime = Date()
    @Published var digitalTime = ""
    @Published var currentDate = ""
    @Published var searchQuery = ""
    @Published var expandedSections: Set<String> = []
    @Published var isOnline = false
    @Published var weatherInfo = "Loading..."
    @Published var isFirstTime: Bool? = nil
    
    // Preferences
    @Published var language: String = "en"
    @Published var isDarkMode: Bool = true
    @Published var isFloatingTimerEnabled: Bool = false
    @Published var selectedFont: String = "System"
    @Published var profileName: String = ""
    @Published var profilePhone: String = ""
    @Published var profileLocation: String = ""
    @Published var profileGender: String = ""
    @Published var profileImage: String? = nil
    @Published var recentServices: [ServiceItem] = []
    @Published var activityLog: [ServiceActivity] = []
    
    // Tracking
    @Published var isTracking = false
    @Published var trackedTime: Int = 0
    
    private var preferences: UserPreferences
    private var networkMonitor: NetworkMonitor
    private var weatherService: WeatherService
    private var timer: Timer?
    private var trackingTimer: Timer?
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Computed filtered services
    var filteredGovernment: [ServiceItem] { filterItems(GovernmentServices) }
    var filteredDocumentVerify: [ServiceItem] { filterItems(DocumentVerifyServices) }
    var filteredFinance: [ServiceItem] { filterItems(FinanceServices) }
    var filteredAI: [ServiceItem] { filterItems(AIServices) }
    var filteredRadio: [ServiceItem] { filterItems(RadioServices) }
    var filteredNews: [ServiceItem] { filterItems(NewsServices) }
    var filteredSocialMedia: [ServiceItem] { filterItems(SocialMediaServices) }
    var filteredGoogle: [ServiceItem] { filterItems(GoogleServices) }
    var filteredTVChannels: [ServiceItem] { filterItems(TVChannelServices) }
    var filteredChildren: [ServiceItem] { filterItems(ChildrenServices) }
    var filteredPortfolio: [ServiceItem] { filterItems(PortfolioServices) }
    var filteredGames: [ServiceItem] { filterItems(GameServices) }
    
    var chartData: [(ServiceItem, Int)] {
        let sixtyDaysAgo = Date().timeIntervalSince1970 - (60 * 24 * 60 * 60)
        let recentLog = activityLog.filter { $0.timestamp >= sixtyDaysAgo }
        
        var grouped: [String: Int] = [:]
        for activity in recentLog {
            grouped[activity.serviceId, default: 0] += activity.durationSeconds
        }
        
        return grouped.sorted { $0.value > $1.value }
            .prefix(7)
            .compactMap { (id, duration) in
                if let service = AllServices.first(where: { $0.id == id }) {
                    return (service, duration)
                }
                return nil
            }
    }
    
    var latest50Activities: [(ServiceActivity, ServiceItem)] {
        let sixtyDaysAgo = Date().timeIntervalSince1970 - (60 * 24 * 60 * 60)
        return activityLog
            .filter { $0.timestamp >= sixtyDaysAgo }
            .prefix(50)
            .compactMap { activity in
                if let service = AllServices.first(where: { $0.id == activity.serviceId }) {
                    return (activity, service)
                }
                return nil
            }
    }
    
    // MARK: - Init
    init() {
        self.preferences = UserPreferences.shared
        self.networkMonitor = NetworkMonitor.shared
        self.weatherService = WeatherService()
        
        setupBindings()
        startClock()
        weatherService.requestLocation()
    }
    
    private func setupBindings() {
        // Sync from preferences
        language = preferences.language
        isDarkMode = preferences.isDarkMode
        isFloatingTimerEnabled = preferences.isFloatingTimerEnabled
        selectedFont = preferences.selectedFont
        profileName = preferences.profileName
        profilePhone = preferences.profilePhone
        profileLocation = preferences.profileLocation
        profileGender = preferences.profileGender
        profileImage = preferences.profileImage
        activityLog = preferences.activityLog
        isFirstTime = preferences.isFirstTime
        
        // Update recent services
        updateRecentServices()
        
        // Network monitoring
        networkMonitor.$isConnected
            .receive(on: DispatchQueue.main)
            .assign(to: &$isOnline)
        
        // Weather
        weatherService.$weatherInfo
            .receive(on: DispatchQueue.main)
            .assign(to: &$weatherInfo)
    }
    
    private func updateRecentServices() {
        recentServices = preferences.recentServices.compactMap { id in
            AllServices.first(where: { $0.id == id })
        }
    }
    
    // MARK: - Clock
    private func startClock() {
        updateTime()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.updateTime()
        }
    }
    
    private func updateTime() {
        let now = Date()
        currentTime = now
        
        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "hh:mm:ss a"
        if language == "ne" {
            timeFormatter.locale = Locale(identifier: "ne_NP")
        }
        digitalTime = timeFormatter.string(from: now)
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "EEEE, MMMM dd, yyyy"
        if language == "ne" {
            dateFormatter.locale = Locale(identifier: "ne_NP")
        }
        currentDate = dateFormatter.string(from: now)
    }
    
    // MARK: - Actions
    func setSearchQuery(_ query: String) {
        searchQuery = query
    }
    
    func toggleSection(_ sectionId: String) {
        if expandedSections.contains(sectionId) {
            expandedSections.remove(sectionId)
        } else {
            expandedSections.insert(sectionId)
        }
    }
    
    func toggleLanguage() {
        language = language == "en" ? "ne" : "en"
        preferences.language = language
        updateTime()
    }
    
    func toggleTheme(_ isDark: Bool) {
        isDarkMode = isDark
        preferences.isDarkMode = isDark
    }
    
    func toggleFloatingTimer(_ enabled: Bool) {
        isFloatingTimerEnabled = enabled
        preferences.isFloatingTimerEnabled = enabled
    }
    
    func setSelectedFont(_ font: String) {
        selectedFont = font
        preferences.selectedFont = font
    }
    
    func updateProfile(name: String, phone: String, location: String, gender: String, imageUri: String?) {
        profileName = name
        profilePhone = phone
        profileLocation = location
        profileGender = gender
        profileImage = imageUri
        preferences.updateProfile(name: name, phone: phone, location: location, gender: gender, imageUri: imageUri)
    }
    
    func onServiceClicked(_ item: ServiceItem) {
        preferences.addRecentService(item.id)
        updateRecentServices()
    }
    
    func logServiceActivity(serviceId: String, durationSeconds: Int) {
        preferences.logActivity(serviceId: serviceId, durationSeconds: durationSeconds)
        activityLog = preferences.activityLog
    }
    
    func setFirstTimeCompleted() {
        preferences.setFirstTimeCompleted()
        isFirstTime = false
    }
    
    func toggleTracking() {
        isTracking.toggle()
        if isTracking {
            startTracking()
        } else {
            trackingTimer?.invalidate()
            trackingTimer = nil
        }
    }
    
    private func startTracking() {
        trackingTimer?.invalidate()
        trackingTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            guard let self = self, self.isTracking else { return }
            self.trackedTime += 1
        }
    }
    
    func formatTrackedTime(_ seconds: Int) -> String {
        let h = seconds / 3600
        let m = (seconds % 3600) / 60
        let s = seconds % 60
        if h > 0 {
            return String(format: "%02d:%02d:%02d", h, m, s)
        }
        return String(format: "%02d:%02d", m, s)
    }
    
    // MARK: - Filter
    private func filterItems(_ items: [ServiceItem]) -> [ServiceItem] {
        guard !searchQuery.isEmpty else { return items }
        return items.filter {
            $0.name.localizedCaseInsensitiveContains(searchQuery) ||
            $0.nameNe.localizedCaseInsensitiveContains(searchQuery) ||
            ($0.subtitle?.localizedCaseInsensitiveContains(searchQuery) == true)
        }
    }
    
    deinit {
        timer?.invalidate()
        trackingTimer?.invalidate()
    }
}
