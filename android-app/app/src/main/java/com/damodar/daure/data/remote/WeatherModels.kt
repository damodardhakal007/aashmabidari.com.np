package com.damodar.daure.data.remote

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class WeatherResponse(
    @Json(name = "main") val main: Main,
    @Json(name = "weather") val weather: List<Weather>,
    @Json(name = "name") val name: String
)

@JsonClass(generateAdapter = true)
data class Main(
    @Json(name = "temp") val temp: Double
)

@JsonClass(generateAdapter = true)
data class Weather(
    @Json(name = "description") val description: String,
    @Json(name = "icon") val icon: String
)
