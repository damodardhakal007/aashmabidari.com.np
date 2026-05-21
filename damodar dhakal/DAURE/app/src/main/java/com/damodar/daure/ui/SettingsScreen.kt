package com.damodar.daure.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import com.damodar.daure.ui.components.PrivacyPolicyDialog
import androidx.compose.material.icons.filled.FontDownload
import androidx.compose.material.icons.filled.PrivacyTip
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import com.damodar.daure.ui.components.RoboticBackground
import com.damodar.daure.ui.theme.getFontFamily

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: HomeViewModel,
    onBack: () -> Unit
) {
    val language by viewModel.language.collectAsState()
    val isDarkMode by viewModel.isDarkMode.collectAsState()
    val isFloatingTimer by viewModel.isFloatingTimerEnabled.collectAsState()
    val selectedFont by viewModel.selectedFont.collectAsState()
    
    var showPrivacyPolicy by remember { mutableStateOf(false) }
    var showFontPicker by remember { mutableStateOf(false) }

    val fonts = listOf(
        "System", "Roboto", "Open Sans", "Lato", "Montserrat", 
        "Oswald", "Source Sans Pro", "Slabo 27px", "Raleway", "PT Sans", "Merriweather"
    )

    if (showPrivacyPolicy) {
        PrivacyPolicyDialog(
            isDarkMode = isDarkMode,
            onDismiss = { showPrivacyPolicy = false }
        )
    }

    if (showFontPicker) {
        AlertDialog(
            onDismissRequest = { showFontPicker = false },
            title = { Text(if (language == "ne") "फन्ट छान्नुहोस्" else "Select Font") },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 400.dp)
                        .verticalScroll(rememberScrollState())
                ) {
                    fonts.forEach { font ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.setSelectedFont(font)
                                    showFontPicker = false
                                }
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = selectedFont == font,
                                onClick = {
                                    viewModel.setSelectedFont(font)
                                    showFontPicker = false
                                }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = font,
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    fontFamily = getFontFamily(font)
                                )
                            )
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showFontPicker = false }) {
                    Text(if (language == "ne") "बन्द गर्नुहोस्" else "Close")
                }
            }
        )
    }

    Box(modifier = Modifier.fillMaxSize()) {
        RoboticBackground(
            scrollOffset = 0,
            autoAnimate = true,
            modifier = Modifier.fillMaxSize()
        )

        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                TopAppBar(
                    title = { 
                        Text(if (language == "ne") "सेटिङहरू" else "Settings") 
                    },
                    navigationIcon = {
                        IconButton(onClick = onBack) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = "Back"
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = Color.Transparent
                    )
                )
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                // Language Setting
                SettingsToggleItem(
                    title = if (language == "ne") "भाषा" else "Language",
                    subtitle = if (language == "ne") "नेपाली / English" else "Nepali / English",
                    checked = language == "ne",
                    onCheckedChange = { viewModel.toggleLanguage() }
                )

                // Theme Setting
                SettingsToggleItem(
                    title = if (language == "ne") "विषयवस्तु (डार्क मोड)" else "Theme (Dark Mode)",
                    subtitle = if (language == "ne") "ब्ल्याक मोड सक्रिय गर्नुहोस्" else "Enable Black Mode",
                    checked = isDarkMode,
                    onCheckedChange = { viewModel.toggleTheme(it) }
                )

                // Floating Timer Setting
                SettingsToggleItem(
                    title = if (language == "ne") "फ्लोटिंग सत्र टाइमर" else "Floating Session Timer",
                    subtitle = if (language == "ne") "सत्रको लागि तैरिरहेको टाइमर देखाउनुहोस्" else "Show a floating timer for the session",
                    checked = isFloatingTimer,
                    onCheckedChange = { viewModel.toggleFloatingTimer(it) }
                )

                // Font Setting
                SettingsClickItem(
                    title = if (language == "ne") "फन्ट" else "Fonts",
                    subtitle = if (language == "ne") "एपको फन्ट परिवर्तन गर्नुहोस् ($selectedFont)" else "Change app font style ($selectedFont)",
                    icon = Icons.Default.FontDownload,
                    onClick = { showFontPicker = true }
                )

                HorizontalDivider(
                    modifier = Modifier.padding(vertical = 8.dp),
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.12f)
                )

                // Privacy Policy Item
                SettingsClickItem(
                    title = if (language == "ne") "गोपनीयता नीति" else "Privacy Policy",
                    subtitle = if (language == "ne") "हाम्रो गोपनीयता नीति पढ्नुहोस्" else "Read our privacy policy",
                    icon = Icons.Default.PrivacyTip,
                    onClick = { showPrivacyPolicy = true }
                )
            }
        }
    }
}

@Composable
fun SettingsClickItem(
    title: String,
    subtitle: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary
        )
    }
}

@Composable
fun SettingsToggleItem(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}
