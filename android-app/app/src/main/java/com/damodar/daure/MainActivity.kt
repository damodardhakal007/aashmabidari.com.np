package com.damodar.daure

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.LaunchedEffect
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.navigation.NavType
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import androidx.activity.result.contract.ActivityResultContracts
import com.damodar.daure.data.pref.UserPreferences
import com.damodar.daure.ui.ActivityScreen
import com.damodar.daure.ui.BrowserInputScreen
import com.damodar.daure.ui.GamesScreen
import com.damodar.daure.ui.HomeScreen
import com.damodar.daure.ui.HomeViewModel
import com.damodar.daure.ui.InAppBrowserScreen
import com.damodar.daure.ui.SettingsScreen
import com.damodar.daure.ui.WelcomeScreen
import com.damodar.daure.ui.components.CustomBottomBar
import com.damodar.daure.ui.theme.DAURETheme
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import androidx.navigation.compose.currentBackStackEntryAsState

class MainActivity : ComponentActivity() {
    private lateinit var appUpdateManager: AppUpdateManager

    private val updateLauncher = registerForActivityResult(
        ActivityResultContracts.StartIntentSenderForResult()
    ) { result ->
        if (result.resultCode != RESULT_OK) {
            // Update failed or cancelled
        }
    }

    private fun checkForUpdates() {
        appUpdateManager = AppUpdateManagerFactory.create(this)
        val appUpdateInfoTask = appUpdateManager.appUpdateInfo

        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)
            ) {
                appUpdateManager.startUpdateFlowForResult(
                    appUpdateInfo,
                    updateLauncher,
                    com.google.android.play.core.appupdate.AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build()
                )
            }
        }
    }

    override fun onResume() {
        super.onResume()
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                appUpdateManager.startUpdateFlowForResult(
                    appUpdateInfo,
                    updateLauncher,
                    com.google.android.play.core.appupdate.AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build()
                )
            }
        }
    }

    private fun hideSystemUI() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }

    @OptIn(ExperimentalPermissionsApi::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkForUpdates()
        enableEdgeToEdge()
        hideSystemUI()
        
        val userPreferences = UserPreferences(this)
        
        setContent {
            val permissionsState = rememberMultiplePermissionsState(
                permissions = listOf(
                    android.Manifest.permission.ACCESS_FINE_LOCATION,
                    android.Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )

            LaunchedEffect(Unit) {
                permissionsState.launchMultiplePermissionRequest()
            }

            val viewModel: HomeViewModel = viewModel(
                factory = object : androidx.lifecycle.ViewModelProvider.Factory {
                    override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                        return HomeViewModel(application, userPreferences) as T
                    }
                }
            )
            
            val isDarkMode by viewModel.isDarkMode.collectAsState()
            val isFirstTime by viewModel.isFirstTime.collectAsState()
            val navController = rememberNavController()
            val currentRoute by navController.currentBackStackEntryAsState()

            DAURETheme(viewModel = viewModel, darkTheme = isDarkMode) {
                when (isFirstTime) {
                    null -> { /* Loading */ }
                    true -> WelcomeScreen(onGetStarted = { viewModel.setFirstTimeCompleted() })
                    false -> {
                        Scaffold(
                            bottomBar = { 
                                val route = currentRoute?.destination?.route
                                if (route != null && !route.startsWith("browser/")) {
                                    CustomBottomBar(navController)
                                }
                            }
                        ) { paddingValues ->
                            NavHost(
                                navController = navController, 
                                startDestination = "home",
                                modifier = Modifier.padding(paddingValues)
                            ) {
                                composable("home") {
                                    HomeScreen(
                                        viewModel = viewModel,
                                        onNavigateToBrowser = { url: String, title: String, serviceId: String ->
                                            val encodedUrl = URLEncoder.encode(url, StandardCharsets.UTF_8.toString())
                                            val encodedTitle = URLEncoder.encode(title, StandardCharsets.UTF_8.toString())
                                            navController.navigate("browser/$encodedUrl/$encodedTitle/$serviceId")
                                        },
                                        onNavigateToSettings = {
                                            navController.navigate("settings")
                                        },
                                        onNavigateToProfile = { }
                                    )
                                }
                                composable("browser_input") {
                                    BrowserInputScreen(
                                        onNavigateToBrowser = { url, title ->
                                            val encodedUrl = URLEncoder.encode(url, StandardCharsets.UTF_8.toString())
                                            val encodedTitle = URLEncoder.encode(title, StandardCharsets.UTF_8.toString())
                                            navController.navigate("browser/$encodedUrl/$encodedTitle/custom_url")
                                        }
                                    )
                                }
                                composable("games") {
                                    GamesScreen(
                                        viewModel = viewModel,
                                        onNavigateToBrowser = { url, title, serviceId ->
                                            val encodedUrl = URLEncoder.encode(url, StandardCharsets.UTF_8.toString())
                                            val encodedTitle = URLEncoder.encode(title, StandardCharsets.UTF_8.toString())
                                            navController.navigate("browser/$encodedUrl/$encodedTitle/$serviceId")
                                        }
                                    )
                                }
                                composable("activity") {
                                    ActivityScreen(
                                        viewModel = viewModel,
                                        onNavigateToBrowser = { url: String, title: String, serviceId: String ->
                                            val encodedUrl = URLEncoder.encode(url, StandardCharsets.UTF_8.toString())
                                            val encodedTitle = URLEncoder.encode(title, StandardCharsets.UTF_8.toString())
                                            navController.navigate("browser/$encodedUrl/$encodedTitle/$serviceId")
                                        }
                                    )
                                }
                                composable("settings") {
                                    SettingsScreen(
                                        viewModel = viewModel,
                                        onBack = { navController.popBackStack() }
                                    )
                                }
                                composable(
                                    route = "browser/{url}/{title}/{serviceId}",
                                    arguments = listOf(
                                        navArgument("url") { type = NavType.StringType },
                                        navArgument("title") { type = NavType.StringType },
                                        navArgument("serviceId") { type = NavType.StringType }
                                    )
                                ) { backStackEntry ->
                                    val url = backStackEntry.arguments?.getString("url") ?: ""
                                    val title = backStackEntry.arguments?.getString("title") ?: ""
                                    val serviceId = backStackEntry.arguments?.getString("serviceId") ?: ""
                                    val isTimerEnabled by viewModel.isFloatingTimerEnabled.collectAsState()

                                    InAppBrowserScreen(
                                        url = url,
                                        title = title,
                                        serviceId = serviceId,
                                        viewModel = viewModel,
                                        isTimerEnabled = isTimerEnabled,
                                        onClose = { navController.popBackStack() }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            hideSystemUI()
        }
    }
}
