package com.damodar.daure.ui

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import android.hardware.camera2.CameraManager
import androidx.compose.material.icons.filled.FlashlightOn
import androidx.compose.material.icons.filled.FlashlightOff
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.runtime.*
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.damodar.daure.R
import com.damodar.daure.data.model.ServiceItem
import com.damodar.daure.ui.components.AnalogueClock
import com.damodar.daure.ui.components.RoboticBackground
import java.util.Calendar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToBrowser: (url: String, title: String, serviceId: String) -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToProfile: () -> Unit
) {
    val currentTime by viewModel.currentTime.collectAsState()
    val digitalTime by viewModel.digitalTime.collectAsState()
    val currentDate by viewModel.currentDate.collectAsState()
    val language by viewModel.language.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val expandedSections by viewModel.expandedSections.collectAsState()
    val isOnline by viewModel.isOnline.collectAsState()

    val profileName by viewModel.profileName.collectAsState()

    val filteredGovernment by viewModel.filteredGovernment.collectAsState()
    val filteredDocumentVerify by viewModel.filteredDocumentVerify.collectAsState()
    val filteredFinance by viewModel.filteredFinance.collectAsState()
    val filteredAI by viewModel.filteredAI.collectAsState()
    val filteredRadio by viewModel.filteredRadio.collectAsState()
    val filteredNews by viewModel.filteredNews.collectAsState()
    val filteredPortfolio by viewModel.filteredPortfolio.collectAsState()
    val recentServices by viewModel.recentServices.collectAsState()

    val context = LocalContext.current
    val cameraManager = remember { context.getSystemService(Context.CAMERA_SERVICE) as CameraManager }
    val cameraId = remember { cameraManager.cameraIdList.firstOrNull() }
    var isFlashlightOn by remember { mutableStateOf(false) }

    fun toggleFlashlight() {
        if (cameraId != null) {
            try {
                isFlashlightOn = !isFlashlightOn
                cameraManager.setTorchMode(cameraId, isFlashlightOn)
            } catch (e: Exception) {
                isFlashlightOn = false
            }
        }
    }

    var showTmsDialog by remember { mutableStateOf(false) }
    var showOfflineDialog by remember { mutableStateOf(false) }

    if (showTmsDialog) {
        TmsSelectionDialog(
            onDismiss = { showTmsDialog = false },
            onSelect = { number ->
                if (isOnline) {
                    onNavigateToBrowser("https://tms$number.nepsetms.com.np/login", "TMS $number", "tms_$number")
                } else {
                    showOfflineDialog = true
                }
                showTmsDialog = false
            }
        )
    }

    if (showOfflineDialog) {
        OfflineRecoveryDialog(
            language = language,
            onDismiss = { showOfflineDialog = false },
            onOpenSettings = {
                context.startActivity(Intent(Settings.ACTION_WIFI_SETTINGS))
                showOfflineDialog = false
            }
        )
    }

    Box(
        modifier = Modifier.fillMaxSize()
    ) {
        val scrollState = rememberScrollState()
        
        RoboticBackground(
            scrollOffset = scrollState.value,
            modifier = Modifier.fillMaxSize()
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 16.dp)
        ) {
            // Fixed top padding for the floating search bar area
            Spacer(modifier = Modifier.statusBarsPadding())
            Spacer(modifier = Modifier.height(72.dp)) // Height of search bar + some margin

            val weatherInfo by viewModel.weatherInfo.collectAsStateWithLifecycle()

            HeaderCard(
                digitalTime = digitalTime,
                currentDate = currentDate,
                calendar = currentTime,
                language = language,
                isOnline = isOnline,
                weatherInfo = weatherInfo,
                profileName = profileName
            )
            
            Spacer(modifier = Modifier.height(24.dp))

            val onServiceClick: (ServiceItem) -> Unit = { item ->
                viewModel.onServiceClicked(item)
                if (isOnline) {
                    if (item.isTms) {
                        showTmsDialog = true
                    } else {
                        onNavigateToBrowser(item.url, if (language == "ne") item.nameNe else item.name, item.id)
                    }
                } else {
                    showOfflineDialog = true
                }
            }

            UtilitiesGrid(
                viewModel = viewModel,
                language = language,
                isFlashlightOn = isFlashlightOn,
                onFlashlightToggle = { toggleFlashlight() }
            )

            Spacer(modifier = Modifier.height(24.dp))

            ServiceSectionView(
                title = if (language == "ne") "भर्खरै खोलिएका" else "Recent",
                items = recentServices,
                isExpanded = expandedSections.contains("recent"),
                onToggle = { viewModel.toggleSection("recent") },
                onItemClick = onServiceClick,
                language = language,
                initialLimit = 6
            )

            ServiceSectionView(
                title = if (language == "ne") "नेपाल सरकार" else "Government of Nepal",
                items = filteredGovernment,
                isExpanded = expandedSections.contains("government"),
                onToggle = { viewModel.toggleSection("government") },
                onItemClick = onServiceClick,
                language = language
            )

            ServiceSectionView(
                title = if (language == "ne") "कागजात प्रमाणित" else "Document Verify",
                items = filteredDocumentVerify,
                isExpanded = expandedSections.contains("docs"),
                onToggle = { viewModel.toggleSection("docs") },
                onItemClick = onServiceClick,
                language = language
            )

            ServiceSectionView(
                title = if (language == "ne") "वित्त" else "Finance",
                items = filteredFinance,
                isExpanded = expandedSections.contains("finance"),
                onToggle = { viewModel.toggleSection("finance") },
                onItemClick = onServiceClick,
                language = language
            )

            ServiceSectionView(
                title = if (language == "ne") "एआई प्लेटफार्महरू" else "AI Platforms",
                items = filteredAI,
                isExpanded = expandedSections.contains("ai"),
                onToggle = { viewModel.toggleSection("ai") },
                onItemClick = onServiceClick,
                language = language
            )

            ServiceSectionView(
                title = if (language == "ne") "रेडियो स्टेशनहरू" else "Radio Stations",
                items = filteredRadio,
                isExpanded = expandedSections.contains("radio"),
                onToggle = { viewModel.toggleSection("radio") },
                onItemClick = onServiceClick,
                language = language
            )

            ServiceSectionView(
                title = if (language == "ne") "समाचार" else "News",
                items = filteredNews,
                isExpanded = expandedSections.contains("news"),
                onToggle = { viewModel.toggleSection("news") },
                onItemClick = onServiceClick,
                language = language
            )

            val filteredGoogle by viewModel.filteredGoogle.collectAsState()
            ServiceSectionView(
                title = if (language == "ne") "गुगल सेवाहरू" else "Google Services",
                items = filteredGoogle,
                isExpanded = expandedSections.contains("google"),
                onToggle = { viewModel.toggleSection("google") },
                onItemClick = onServiceClick,
                language = language
            )

            val filteredTVChannels by viewModel.filteredTVChannels.collectAsState()
            ServiceSectionView(
                title = if (language == "ne") "टिभी च्यानलहरू" else "TV Channels",
                items = filteredTVChannels,
                isExpanded = expandedSections.contains("tv"),
                onToggle = { viewModel.toggleSection("tv") },
                onItemClick = onServiceClick,
                language = language
            )

            val filteredChildren by viewModel.filteredChildren.collectAsState()
            ServiceSectionView(
                title = if (language == "ne") "बालबालिका विशेष" else "Children's Special",
                items = filteredChildren,
                isExpanded = expandedSections.contains("kids"),
                onToggle = { viewModel.toggleSection("kids") },
                onItemClick = onServiceClick,
                language = language
            )

            ServiceSectionView(
                title = if (language == "ne") "एसआइपी (पोर्टफोलियो)" else "SIP (Portfolio)",
                items = filteredPortfolio,
                isExpanded = expandedSections.contains("portfolio"),
                onToggle = { viewModel.toggleSection("portfolio") },
                onItemClick = onServiceClick,
                language = language
            )

            val filteredSocialMedia by viewModel.filteredSocialMedia.collectAsStateWithLifecycle()
            ServiceSectionView(
                title = if (language == "ne") "सामाजिक सञ्जाल" else "Social Media",
                items = filteredSocialMedia,
                isExpanded = expandedSections.contains("social"),
                onToggle = { viewModel.toggleSection("social") },
                onItemClick = onServiceClick,
                language = language
            )
            
            Spacer(modifier = Modifier.height(32.dp))
        }

        // Floating Search Bar at the top
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .background(Color.Transparent)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                placeholder = { 
                    Text("Search") 
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .shadow(8.dp, RoundedCornerShape(26.dp)),
                shape = RoundedCornerShape(26.dp),
                leadingIcon = {
                    Icon(Icons.Default.Search, contentDescription = null, tint = Color.Gray)
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.setSearchQuery("") }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear", tint = Color.Gray)
                        }
                    }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color.Transparent,
                    focusedBorderColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f),
                    unfocusedContainerColor = Color.White.copy(alpha = 0.8f),
                    focusedContainerColor = Color.White
                )
            )
        }
    }
}

@Composable
fun UtilitiesGrid(
    viewModel: HomeViewModel,
    language: String,
    isFlashlightOn: Boolean,
    onFlashlightToggle: () -> Unit
) {
    val context = LocalContext.current
    val wifi by viewModel.isWifiEnabled.collectAsState()
    val bt by viewModel.isBluetoothEnabled.collectAsState()
    val data by viewModel.isDataEnabled.collectAsState()
    val vib by viewModel.isVibEnabled.collectAsState()

    val utilities = listOf(
        UtilityItem(if (language == "ne") "वाइफाइ" else "Wifi", Icons.Default.Wifi, wifi) {
            context.startActivity(Intent(Settings.ACTION_WIFI_SETTINGS))
        },
        UtilityItem(if (language == "ne") "फ्ल्यास" else "Flash", if (isFlashlightOn) Icons.Default.FlashlightOn else Icons.Default.FlashlightOff, isFlashlightOn) {
            onFlashlightToggle()
        },
        UtilityItem(if (language == "ne") "ब्लुटुथ" else "BT", Icons.Default.Bluetooth, bt) {
            context.startActivity(Intent(Settings.ACTION_BLUETOOTH_SETTINGS))
        },
        UtilityItem(if (language == "ne") "डाटा" else "Data", Icons.Default.DataUsage, data) {
            context.startActivity(Intent(Settings.ACTION_WIRELESS_SETTINGS))
        },
        UtilityItem(if (language == "ne") "भाइब्रेसन" else "Vib", Icons.Default.Vibration, vib) {
            context.startActivity(Intent(Settings.ACTION_SOUND_SETTINGS))
        }
    )

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        utilities.forEach { item ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .clickable { item.onClick() }
                    .padding(4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(if (item.isEnabled) Color(0xFF4CAF50) else MaterialTheme.colorScheme.surface),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label,
                        tint = if (item.isEnabled) Color.White else MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = item.label,
                    style = MaterialTheme.typography.labelSmall,
                    fontSize = 10.sp
                )
            }
        }
    }
}

data class UtilityItem(
    val label: String,
    val icon: ImageVector,
    val isEnabled: Boolean,
    val onClick: () -> Unit
)

@Composable
fun ServiceSectionView(
    title: String,
    items: List<ServiceItem>,
    isExpanded: Boolean,
    onToggle: () -> Unit,
    onItemClick: (ServiceItem) -> Unit,
    language: String,
    initialLimit: Int = 3
) {
    if (items.isEmpty()) return

    val displayItems = if (isExpanded) items else items.take(initialLimit)

    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        val chunkedItems = displayItems.chunked(3)
        chunkedItems.forEach { rowItems ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                rowItems.forEach { item ->
                    ServiceItemCard(
                        item = item,
                        language = language,
                        onClick = { onItemClick(item) },
                        modifier = Modifier
                            .weight(1f)
                            .padding(4.dp)
                    )
                }
                if (rowItems.size < 3) {
                    repeat(3 - rowItems.size) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }

        if (items.size > initialLimit) {
            Spacer(modifier = Modifier.height(12.dp))
            OutlinedButton(
                onClick = onToggle,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp),
                shape = CircleShape,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = if (isExpanded) 
                            (if (language == "ne") "कम देखाउनुहोस्" else "Show Less") 
                        else 
                            (if (language == "ne") "थप देखाउनुहोस्" else "Show More"),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(
                        imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun ServiceItemCard(
    item: ServiceItem,
    language: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isError by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .padding(vertical = 4.dp)
            .clickable(
                onClick = onClick,
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Card(
            modifier = Modifier
                .size(68.dp)
                .shadow(
                    elevation = 12.dp,
                    shape = RoundedCornerShape(16.dp),
                    spotColor = Color(0xFF2196F3).copy(alpha = 0.6f),
                    ambientColor = Color(0xFF2196F3).copy(alpha = 0.4f)
                ),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        brush = androidx.compose.ui.graphics.Brush.linearGradient(
                            colors = listOf(
                                Color(0xFFE3F2FD),
                                Color(0xFFBBDEFB),
                                Color.White
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (isError || item.iconUrl == null) {
                    Text(
                        text = item.iconChar ?: item.name.firstOrNull()?.toString() ?: "?",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF1976D2)
                    )
                }

                AsyncImage(
                    model = item.iconUrl,
                    contentDescription = item.name,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    contentScale = ContentScale.Fit,
                    onState = { state ->
                        isError = state is coil.compose.AsyncImagePainter.State.Error
                    }
                )
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = if (language == "ne") item.nameNe else item.name,
            style = MaterialTheme.typography.labelMedium,
            textAlign = TextAlign.Center,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        if (item.subtitle != null) {
            Text(
                text = item.subtitle,
                style = MaterialTheme.typography.labelSmall,
                color = Color.Gray,
                fontSize = 8.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun HeaderCard(
    digitalTime: String,
    currentDate: String,
    calendar: Calendar,
    language: String,
    isOnline: Boolean,
    weatherInfo: String,
    profileName: String
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF2196F3) 
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
                model = R.drawable.header_background,
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
                alpha = 0.5f
            )
            
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = if (profileName.isNotEmpty()) profileName else (if (language == "ne") "नमस्ते" else "Welcome"),
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (weatherInfo == "No API Key") "" else weatherInfo,
                        style = MaterialTheme.typography.bodyLarge,
                        color = Color.White.copy(alpha = 0.9f)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = currentDate,
                        style = MaterialTheme.typography.labelMedium,
                        color = Color.White.copy(alpha = 0.8f)
                    )
                    Text(
                        text = digitalTime,
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )
                    
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(if (isOnline) Color(0xFF4CAF50) else Color(0xFFF44336))
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isOnline) (if (language == "ne") "अनलाइन" else "Online") 
                                   else (if (language == "ne") "जडान छैन" else "Not Connected"),
                            style = MaterialTheme.typography.labelMedium,
                            color = if (isOnline) Color(0xFF4CAF50) else Color(0xFFF44336),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                
                AnalogueClock(
                    calendar = calendar,
                    color = Color.White,
                    modifier = Modifier.size(100.dp)
                )
            }
        }
    }
}

@Composable
fun OfflineRecoveryDialog(
    language: String,
    onDismiss: () -> Unit,
    onOpenSettings: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        icon = { Icon(Icons.Default.WifiOff, contentDescription = null, tint = Color.Red) },
        title = { 
            Text(if (language == "ne") "इन्टरनेट जडान छैन" else "No Internet Connection") 
        },
        text = {
            Text(
                if (language == "ne") "तपाईं हाल अफलाइन हुनुहुन्छ। कृपया यो सेवा प्रयोग गर्न आफ्नो इन्टरनेट जडान जाँच गर्नुहोस्।" 
                else "You are currently offline. Please check your internet connection to use this service."
            )
        },
        confirmButton = {
            Button(onClick = onOpenSettings) {
                Text(if (language == "ne") "सेटिङहरू खोल्नुहोस्" else "Open Settings")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(if (language == "ne") "रद्द गर्नुहोस्" else "Cancel")
            }
        }
    )
}

fun openUrl(context: Context, url: String) {
    try {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        context.startActivity(intent)
    } catch (e: Exception) { }
}

@Composable
fun TmsSelectionDialog(
    onDismiss: () -> Unit,
    onSelect: (String) -> Unit
) {
    var textValue by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Select TMS Number (1-200)") },
        text = {
            OutlinedTextField(
                value = textValue,
                onValueChange = { if (it.length <= 3) textValue = it },
                label = { Text("TMS Number") },
                modifier = Modifier.fillMaxWidth()
            )
        },
        confirmButton = {
            Button(
                onClick = { 
                    val num = textValue.toIntOrNull()
                    if (num != null && num in 1..200) {
                        onSelect(String.format("%02d", num))
                    }
                }
            ) {
                Text("Open")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
