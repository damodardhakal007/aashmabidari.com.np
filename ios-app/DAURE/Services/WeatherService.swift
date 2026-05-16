import Foundation
import CoreLocation

class WeatherService: NSObject, ObservableObject, CLLocationManagerDelegate {
    @Published var weatherInfo: String = "Loading..."
    
    private let locationManager = CLLocationManager()
    private var apiKey: String = ""
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyKilometer
        
        // Load API key from bundle or config
        if let key = Bundle.main.object(forInfoDictionaryKey: "WEATHER_API_KEY") as? String {
            apiKey = key
        }
    }
    
    func requestLocation() {
        locationManager.requestWhenInUseAuthorization()
        locationManager.requestLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.first else { return }
        fetchWeather(lat: location.coordinate.latitude, lon: location.coordinate.longitude)
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        weatherInfo = "29°C - Kathmandu"
    }
    
    private func fetchWeather(lat: Double, lon: Double) {
        guard !apiKey.isEmpty else {
            weatherInfo = "No API Key"
            return
        }
        
        let urlString = "https://api.openweathermap.org/data/2.5/weather?lat=\(lat)&lon=\(lon)&appid=\(apiKey)&units=metric"
        
        guard let url = URL(string: urlString) else { return }
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            DispatchQueue.main.async {
                guard let data = data, error == nil else {
                    self?.weatherInfo = "29°C - Kathmandu"
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let main = json["main"] as? [String: Any],
                       let temp = main["temp"] as? Double,
                       let name = json["name"] as? String {
                        self?.weatherInfo = "\(Int(temp))°C - \(name)"
                    }
                } catch {
                    self?.weatherInfo = "29°C - Kathmandu"
                }
            }
        }.resume()
    }
}
