package com.damodar.daure.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import com.damodar.daure.ui.HomeViewModel

private val DarkColorScheme = darkColorScheme(
    primary = DaurePrimaryLight,
    onPrimary = Black,
    primaryContainer = DaurePrimaryDark,
    onPrimaryContainer = White,
    secondary = DaureAccentLight,
    onSecondary = Black,
    secondaryContainer = DaureAccent,
    onSecondaryContainer = White,
    tertiary = LightGray,
    background = DarkGray,
    surface = DarkSurface,
    onBackground = White,
    onSurface = White,
    error = Color(0xFFCF6679),
    onError = Black
)

private val LightColorScheme = lightColorScheme(
    primary = DaurePrimary,
    onPrimary = White,
    primaryContainer = DaurePrimaryLight,
    onPrimaryContainer = Black,
    secondary = DaureAccent,
    onSecondary = White,
    secondaryContainer = DaureAccentLight,
    onSecondaryContainer = Black,
    tertiary = DarkGray,
    background = White,
    surface = LightGray,
    onBackground = Black,
    onSurface = Black,
    error = Color(0xFFB00020),
    onError = White
)

@Composable
fun DAURETheme(
    viewModel: HomeViewModel,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val selectedFont by viewModel.selectedFont.collectAsState()
    val fontFamily = getFontFamily(selectedFont)
    val typography = getTypography(fontFamily)

    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = Color.Transparent.toArgb()
            window.navigationBarColor = Color.Transparent.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = typography,
        content = content
    )
}