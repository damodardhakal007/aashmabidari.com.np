package com.damodar.daure.data.pref

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class UserPreferences(private val context: Context) {

    companion object {
        val DARK_MODE_KEY = booleanPreferencesKey("dark_mode")
        val LANGUAGE_KEY = stringPreferencesKey("language")
        val FLOATING_TIMER_KEY = booleanPreferencesKey("floating_timer")
        val PROFILE_NAME_KEY = stringPreferencesKey("profile_name")
        val PROFILE_PHONE_KEY = stringPreferencesKey("profile_phone")
        val PROFILE_IMAGE_KEY = stringPreferencesKey("profile_image")
        val PROFILE_LOCATION_KEY = stringPreferencesKey("profile_location")
        val PROFILE_GENDER_KEY = stringPreferencesKey("profile_gender")
        val RECENT_SERVICES_KEY = stringPreferencesKey("recent_services")
        val IS_FIRST_TIME_KEY = booleanPreferencesKey("is_first_time")
        val IS_LOGGED_IN_KEY = booleanPreferencesKey("is_logged_in")
        val REGISTERED_EMAIL_KEY = stringPreferencesKey("registered_email")
        val REGISTERED_PASSWORD_KEY = stringPreferencesKey("registered_password")
        val ACTIVITY_LOG_KEY = stringPreferencesKey("activity_log")
        val SELECTED_FONT_KEY = stringPreferencesKey("selected_font")
    }

    // Default to false for White Mode as per requirements
    val isDarkMode: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[DARK_MODE_KEY] ?: false
    }

    val selectedFont: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[SELECTED_FONT_KEY] ?: "System"
    }

    val language: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[LANGUAGE_KEY] ?: "en"
    }

    val isFloatingTimerEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[FLOATING_TIMER_KEY] ?: false
    }

    val profileName: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[PROFILE_NAME_KEY] ?: ""
    }

    val profilePhone: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[PROFILE_PHONE_KEY] ?: ""
    }

    val profileLocation: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[PROFILE_LOCATION_KEY] ?: ""
    }

    val profileGender: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[PROFILE_GENDER_KEY] ?: ""
    }

    val profileImage: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[PROFILE_IMAGE_KEY]
    }

    val recentServices: Flow<List<String>> = context.dataStore.data.map { preferences ->
        val serialized = preferences[RECENT_SERVICES_KEY] ?: ""
        if (serialized.isEmpty()) emptyList() else serialized.split(",")
    }

    val isFirstTime: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[IS_FIRST_TIME_KEY] ?: true
    }

    val isLoggedIn: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[IS_LOGGED_IN_KEY] ?: false
    }

    val registeredEmail: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[REGISTERED_EMAIL_KEY]
    }

    val registeredPassword: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[REGISTERED_PASSWORD_KEY]
    }

    val activityLog: Flow<List<com.damodar.daure.data.model.ServiceActivity>> = context.dataStore.data.map { preferences ->
        val serialized = preferences[ACTIVITY_LOG_KEY] ?: ""
        if (serialized.isEmpty()) emptyList() 
        else {
            try {
                serialized.split(";").filter { it.isNotEmpty() }.map {
                    val parts = it.split(",")
                    com.damodar.daure.data.model.ServiceActivity(parts[0], parts[1].toLong(), parts[2].toLong())
                }
            } catch (e: Exception) { emptyList() }
        }
    }

    suspend fun setDarkMode(isDark: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[DARK_MODE_KEY] = isDark
        }
    }

    suspend fun setLanguage(lang: String) {
        context.dataStore.edit { preferences ->
            preferences[LANGUAGE_KEY] = lang
        }
    }

    suspend fun setFloatingTimerEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[FLOATING_TIMER_KEY] = enabled
        }
    }

    suspend fun updateProfile(name: String, phone: String, location: String, gender: String, imageUri: String?) {
        context.dataStore.edit { preferences ->
            preferences[PROFILE_NAME_KEY] = name
            preferences[PROFILE_PHONE_KEY] = phone
            preferences[PROFILE_LOCATION_KEY] = location
            preferences[PROFILE_GENDER_KEY] = gender
            if (imageUri != null) {
                preferences[PROFILE_IMAGE_KEY] = imageUri
            }
        }
    }

    suspend fun addRecentService(serviceId: String) {
        context.dataStore.edit { preferences ->
            val current = (preferences[RECENT_SERVICES_KEY] ?: "").split(",").filter { it.isNotEmpty() }.toMutableList()
            current.remove(serviceId)
            current.add(0, serviceId)
            val limited = current.take(12)
            preferences[RECENT_SERVICES_KEY] = limited.joinToString(",")
        }
    }

    suspend fun setFirstTimeCompleted() {
        context.dataStore.edit { preferences ->
            preferences[IS_FIRST_TIME_KEY] = false
        }
    }

    suspend fun setLoggedIn(loggedIn: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[IS_LOGGED_IN_KEY] = loggedIn
        }
    }

    suspend fun registerUser(email: String, pass: String) {
        context.dataStore.edit { preferences ->
            preferences[REGISTERED_EMAIL_KEY] = email
            preferences[REGISTERED_PASSWORD_KEY] = pass
        }
    }

    suspend fun logActivity(serviceId: String, durationSeconds: Long) {
        context.dataStore.edit { preferences ->
            val currentLog = (preferences[ACTIVITY_LOG_KEY] ?: "")
                .split(";").filter { it.isNotEmpty() }.toMutableList()
            
            val entry = "$serviceId,${System.currentTimeMillis()},$durationSeconds"
            currentLog.add(0, entry)
            
            // Keep last 500 entries to allow 60-day tracking, but we'll filter in ViewModel
            val limited = currentLog.take(500)
            preferences[ACTIVITY_LOG_KEY] = limited.joinToString(";")
        }
    }

    suspend fun setSelectedFont(font: String) {
        context.dataStore.edit { preferences ->
            preferences[SELECTED_FONT_KEY] = font
        }
    }
}
