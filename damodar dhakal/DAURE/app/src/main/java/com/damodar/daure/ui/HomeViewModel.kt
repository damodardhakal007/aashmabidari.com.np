package com.damodar.daure.ui

import android.annotation.SuppressLint
import android.app.Application
import android.bluetooth.BluetoothManager
import android.content.Context
import android.location.LocationManager
import android.media.AudioManager
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.wifi.WifiManager
import android.os.Build
import android.telephony.TelephonyManager
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.damodar.daure.BuildConfig
import com.damodar.daure.data.remote.WeatherApi
import com.damodar.daure.data.model.*
import com.damodar.daure.data.pref.UserPreferences
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.text.SimpleDateFormat
import java.util.*

class HomeViewModel(
    application: Application,
    private val userPreferences: UserPreferences
) : AndroidViewModel(application) {

    private val context = application.applicationContext

    private val _currentTime = MutableStateFlow(Calendar.getInstance())
    val currentTime: StateFlow<Calendar> = _currentTime.asStateFlow()

    private val _digitalTime = MutableStateFlow("")
    val digitalTime: StateFlow<String> = _digitalTime.asStateFlow()

    private val _currentDate = MutableStateFlow("")
    val currentDate: StateFlow<String> = _currentDate.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _expandedSections = MutableStateFlow<Set<String>>(emptySet())
    val expandedSections: StateFlow<Set<String>> = _expandedSections.asStateFlow()

    private val _isOnline = MutableStateFlow(false)
    val isOnline: StateFlow<Boolean> = _isOnline.asStateFlow()

    private val _weatherInfo = MutableStateFlow("Loading...")
    val weatherInfo: StateFlow<String> = _weatherInfo.asStateFlow()

    // Utility States
    private val _isWifiEnabled = MutableStateFlow(false)
    val isWifiEnabled: StateFlow<Boolean> = _isWifiEnabled.asStateFlow()

    private val _isBluetoothEnabled = MutableStateFlow(false)
    val isBluetoothEnabled: StateFlow<Boolean> = _isBluetoothEnabled.asStateFlow()

    private val _isDataEnabled = MutableStateFlow(false)
    val isDataEnabled: StateFlow<Boolean> = _isDataEnabled.asStateFlow()

    private val _isDndEnabled = MutableStateFlow(false)
    val isDndEnabled: StateFlow<Boolean> = _isDndEnabled.asStateFlow()

    private val _isVibEnabled = MutableStateFlow(false)
    val isVibEnabled: StateFlow<Boolean> = _isVibEnabled.asStateFlow()

    private val _isLocationEnabled = MutableStateFlow(false)
    val isLocationEnabled: StateFlow<Boolean> = _isLocationEnabled.asStateFlow()

    val language = userPreferences.language.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        "en"
    )

    val isDarkMode = userPreferences.isDarkMode.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        true
    )

    val isFloatingTimerEnabled = userPreferences.isFloatingTimerEnabled.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        false
    )

    val selectedFont = userPreferences.selectedFont.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        "System"
    )

    val profileName = userPreferences.profileName.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        ""
    )

    val profilePhone = userPreferences.profilePhone.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        ""
    )

    val profileLocation = userPreferences.profileLocation.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        ""
    )

    val profileGender = userPreferences.profileGender.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        ""
    )

    val profileImage = userPreferences.profileImage.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        null
    )

    val isFirstTime: StateFlow<Boolean?> = userPreferences.isFirstTime.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        null
    )

    val isLoggedIn = userPreferences.isLoggedIn.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        false
    )

    val registeredEmail = userPreferences.registeredEmail.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        null
    )

    val registeredPassword = userPreferences.registeredPassword.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        null
    )

    val allServices = GovernmentServices + DocumentVerifyServices + FinanceServices + AIServices + RadioServices + NewsServices + SocialMediaServices + GoogleServices + TVChannelServices + ChildrenServices + PortfolioServices + GameServices

    val recentServices = userPreferences.recentServices.map { ids ->
        ids.mapNotNull { id -> allServices.find { it.id == id } }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val filteredGovernment = combine(_searchQuery, language) { query, lang ->
        filterItems(GovernmentServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), GovernmentServices)

    val filteredDocumentVerify = combine(_searchQuery, language) { query, lang ->
        filterItems(DocumentVerifyServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DocumentVerifyServices)

    val filteredFinance = combine(_searchQuery, language) { query, lang ->
        filterItems(FinanceServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), FinanceServices)

    val filteredAI = combine(_searchQuery, language) { query, lang ->
        filterItems(AIServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AIServices)

    val filteredRadio = combine(_searchQuery, language) { query, lang ->
        filterItems(RadioServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), RadioServices)

    val filteredNews = combine(_searchQuery, language) { query, lang ->
        filterItems(NewsServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), NewsServices)

    val filteredSocialMedia = combine(_searchQuery, language) { query, lang ->
        filterItems(SocialMediaServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), SocialMediaServices)

    val filteredGoogle = combine(_searchQuery, language) { query, lang ->
        filterItems(GoogleServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), GoogleServices)

    val filteredTVChannels = combine(_searchQuery, language) { query, lang ->
        filterItems(TVChannelServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), TVChannelServices)

    val filteredChildren = combine(_searchQuery, language) { query, lang ->
        filterItems(ChildrenServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ChildrenServices)

    val filteredPortfolio = combine(_searchQuery, language) { query, lang ->
        filterItems(PortfolioServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), PortfolioServices)

    val filteredGames = combine(_searchQuery, language) { query, lang ->
        filterItems(GameServices, query, lang)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), GameServices)

    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
    
    private val weatherApi: WeatherApi by lazy {
        Retrofit.Builder()
            .baseUrl("https://api.openweathermap.org/data/2.5/")
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
            .create(WeatherApi::class.java)
    }

    private val networkCallback = object : ConnectivityManager.NetworkCallback() {
        override fun onAvailable(network: Network) {
            _isOnline.value = true
            fetchWeather()
        }

        override fun onLost(network: Network) {
            _isOnline.value = false
        }
    }

    init {
        monitorConnectivity()
        startClock()
        monitorUtilities()
        fetchWeather()
    }

    private fun monitorConnectivity() {
        val networkRequest = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        connectivityManager.registerNetworkCallback(networkRequest, networkCallback)
        
        val activeNetwork = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork)
        _isOnline.value = capabilities?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true
    }

    private fun startClock() {
        viewModelScope.launch {
            while (true) {
                val calendar = Calendar.getInstance()
                _currentTime.value = calendar
                
                val lang = language.value
                val locale = if (lang == "ne") Locale("ne", "NP") else Locale.ENGLISH
                
                val timeFormat = SimpleDateFormat("hh:mm:ss a", locale)
                _digitalTime.value = timeFormat.format(calendar.time)
                
                val dateFormat = SimpleDateFormat("EEEE, MMMM dd, yyyy", locale)
                _currentDate.value = dateFormat.format(calendar.time)
                
                delay(1000)
            }
        }
    }

    @SuppressLint("MissingPermission")
    fun fetchWeather() {
        if (!isOnline.value) return
        
        viewModelScope.launch {
            try {
                val apiKey = BuildConfig.WEATHER_API_KEY
                if (apiKey.isBlank()) {
                    _weatherInfo.value = "No API Key"
                    return@launch
                }

                fusedLocationClient.getCurrentLocation(
                    Priority.PRIORITY_BALANCED_POWER_ACCURACY,
                    CancellationTokenSource().token
                ).addOnSuccessListener { location ->
                    if (location != null) {
                        viewModelScope.launch {
                            try {
                                val response = weatherApi.getWeather(
                                    location.latitude,
                                    location.longitude,
                                    apiKey
                                )
                                _weatherInfo.value = "${response.main.temp.toInt()}°C - ${response.name}"
                            } catch (e: Exception) {
                                _weatherInfo.value = "Weather Error"
                            }
                        }
                    } else {
                        _weatherInfo.value = "29°C - Kathmandu" // Fallback
                    }
                }
            } catch (e: Exception) {
                _weatherInfo.value = "Error"
            }
        }
    }

    private fun monitorUtilities() {
        viewModelScope.launch {
            while (true) {
                checkUtilityStates()
                delay(2000)
            }
        }
    }

    private fun checkUtilityStates() {
        val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        _isWifiEnabled.value = try { wifiManager.isWifiEnabled } catch (e: Exception) { false }

        val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        _isBluetoothEnabled.value = try { bluetoothManager.adapter?.isEnabled == true } catch (e: Exception) { false }

        val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        _isDataEnabled.value = try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                telephonyManager.isDataEnabled
            } else {
                false
            }
        } catch (e: Exception) {
            false
        }

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
        _isDndEnabled.value = try {
            notificationManager.currentInterruptionFilter != android.app.NotificationManager.INTERRUPTION_FILTER_ALL
        } catch (e: Exception) {
            false
        }

        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        _isVibEnabled.value = try { audioManager.ringerMode == AudioManager.RINGER_MODE_VIBRATE } catch (e: Exception) { false }

        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        _isLocationEnabled.value = try { locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) } catch (e: Exception) { false }
    }

    private fun filterItems(items: List<ServiceItem>, query: String, lang: String): List<ServiceItem> {
        if (query.isBlank()) return items
        return items.filter { 
            it.name.contains(query, ignoreCase = true) || 
            it.nameNe.contains(query, ignoreCase = true) ||
            (it.subtitle?.contains(query, ignoreCase = true) == true)
        }
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun toggleSection(sectionId: String) {
        _expandedSections.update { 
            if (it.contains(sectionId)) it - sectionId else it + sectionId
        }
    }

    fun toggleLanguage() {
        viewModelScope.launch {
            val nextLang = if (language.value == "en") "ne" else "en"
            userPreferences.setLanguage(nextLang)
        }
    }

    fun toggleTheme(isDark: Boolean) {
        viewModelScope.launch {
            userPreferences.setDarkMode(isDark)
        }
    }

    fun toggleFloatingTimer(enabled: Boolean) {
        viewModelScope.launch {
            userPreferences.setFloatingTimerEnabled(enabled)
        }
    }

    fun setSelectedFont(font: String) {
        viewModelScope.launch {
            userPreferences.setSelectedFont(font)
        }
    }

    fun updateProfile(name: String, phone: String, location: String, gender: String, imageUri: String?) {
        viewModelScope.launch {
            userPreferences.updateProfile(name, phone, location, gender, imageUri)
        }
    }

    fun onServiceClicked(item: ServiceItem) {
        viewModelScope.launch {
            userPreferences.addRecentService(item.id)
        }
    }

    val activityLog = userPreferences.activityLog.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        emptyList()
    )

    val last60DaysActivity = activityLog.map { log ->
        val sixtyDaysAgo = System.currentTimeMillis() - (60L * 24 * 60 * 60 * 1000)
        log.filter { it.timestamp >= sixtyDaysAgo }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val latest50Activities = last60DaysActivity.map { log ->
        log.take(50).mapNotNull { activity ->
            allServices.find { it.id == activity.serviceId }?.let { service ->
                activity to service
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val chartData = last60DaysActivity.map { log ->
        log.groupBy { it.serviceId }
            .mapValues { (_, activities) -> activities.sumOf { it.durationSeconds } }
            .toList()
            .sortedByDescending { it.second }
            .take(7) // Top 7 for chart
            .mapNotNull { (id, duration) ->
                allServices.find { it.id == id }?.let { it to duration }
            }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun logServiceActivity(serviceId: String, durationSeconds: Long) {
        viewModelScope.launch {
            userPreferences.logActivity(serviceId, durationSeconds)
        }
    }

    fun setFirstTimeCompleted() {
        viewModelScope.launch {
            userPreferences.setFirstTimeCompleted()
        }
    }

    fun login() {
        viewModelScope.launch {
            userPreferences.setLoggedIn(true)
        }
    }

    fun signInWithGoogle(email: String, name: String, profilePicture: String?) {
        viewModelScope.launch {
            userPreferences.updateProfile(name, "", "", "", profilePicture)
            userPreferences.registerUser(email, "GOOGLE_AUTH")
            userPreferences.setLoggedIn(true)
        }
    }

    fun signup(email: String, pass: String) {
        viewModelScope.launch {
            userPreferences.registerUser(email, pass)
            userPreferences.setLoggedIn(true)
        }
    }

    fun logout() {
        viewModelScope.launch {
            userPreferences.setLoggedIn(false)
        }
    }

    private val _isTracking = MutableStateFlow(false)
    val isTracking: StateFlow<Boolean> = _isTracking

    private val _trackedTime = MutableStateFlow(0L) // in seconds
    val trackedTime: StateFlow<Long> = _trackedTime

    fun toggleTracking() {
        _isTracking.value = !_isTracking.value
        if (_isTracking.value) {
            startTracking()
        }
    }

    private var trackingJob: kotlinx.coroutines.Job? = null
    private fun startTracking() {
        trackingJob?.cancel()
        trackingJob = viewModelScope.launch {
            while (_isTracking.value) {
                delay(1000)
                _trackedTime.value += 1
            }
        }
    }

    fun formatTrackedTime(seconds: Long): String {
        val h = seconds / 3600
        val m = (seconds % 3600) / 60
        val s = seconds % 60
        return if (h > 0) java.util.Locale.getDefault().let { String.format(it, "%02d:%02d:%02d", h, m, s) } 
               else java.util.Locale.getDefault().let { String.format(it, "%02d:%02d", m, s) }
    }

    fun getActivitiesForPeriod(days: Int): StateFlow<List<Pair<ServiceActivity, ServiceItem>>> {
        return activityLog.map { log ->
            val periodAgo = System.currentTimeMillis() - (days.toLong() * 24 * 60 * 60 * 1000)
            log.filter { it.timestamp >= periodAgo }
                .take(50)
                .mapNotNull { activity ->
                    allServices.find { it.id == activity.serviceId }?.let { service ->
                        activity to service
                    }
                }
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    }

    fun getChartDataForPeriod(days: Int): StateFlow<List<Pair<ServiceItem, Long>>> {
        return activityLog.map { log ->
            val periodAgo = System.currentTimeMillis() - (days.toLong() * 24 * 60 * 60 * 1000)
            log.filter { it.timestamp >= periodAgo }
                .groupBy { it.serviceId }
                .mapValues { (_, activities) -> activities.sumOf { it.durationSeconds } }
                .toList()
                .sortedByDescending { it.second }
                .take(7) // Top 7 for chart
                .mapNotNull { (id, duration) ->
                    allServices.find { it.id == id }?.let { it to duration }
                }
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    }

    override fun onCleared() {
        super.onCleared()
        trackingJob?.cancel()
        try {
            connectivityManager.unregisterNetworkCallback(networkCallback)
        } catch (e: Exception) { }
    }
}
