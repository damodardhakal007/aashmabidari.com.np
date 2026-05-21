package com.damodar.daure.ui

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.view.WindowManager
import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebChromeClient
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.webkit.WebResourceError
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Build
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloat
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.platform.LocalContext
import com.damodar.daure.ui.components.RoboticBackground
import kotlinx.coroutines.delay
import java.util.Locale
import kotlin.math.roundToInt

fun Context.findActivity(): Activity? {
    var context = this
    while (context is ContextWrapper) {
        if (context is Activity) return context
        context = context.baseContext
    }
    return null
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InAppBrowserScreen(
    url: String,
    title: String,
    serviceId: String,
    viewModel: HomeViewModel,
    isTimerEnabled: Boolean,
    onClose: () -> Unit
) {
    val activity = LocalContext.current.findActivity()
    var startTime by remember { mutableLongStateOf(System.currentTimeMillis()) }
    var isFullScreen by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(true) }
    var hasError by remember { mutableStateOf(false) }
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }
    var showMaintenanceAfterTimeout by remember { mutableStateOf(false) }

    LaunchedEffect(isLoading) {
        if (isLoading) {
            delay(5000)
            if (isLoading) {
                showMaintenanceAfterTimeout = true
            }
        } else {
            showMaintenanceAfterTimeout = false
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            val duration = (System.currentTimeMillis() - startTime) / 1000
            if (duration > 0) {
                viewModel.logServiceActivity(serviceId, duration)
            }
            // Ensure orientation is reset when leaving the screen
            activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            activity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }

    Scaffold(
        topBar = {
            if (!isFullScreen) {
                TopAppBar(
                    title = {
                        Text(
                            text = title,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            style = MaterialTheme.typography.titleMedium
                        )
                    },
                    navigationIcon = {
                        IconButton(onClick = onClose) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = Color.Transparent,
                        titleContentColor = MaterialTheme.colorScheme.onSurface,
                        navigationIconContentColor = MaterialTheme.colorScheme.onSurface
                    )
                )
            }
        },
        containerColor = Color.Transparent
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .then(if (isFullScreen) Modifier else Modifier.padding(innerPadding))
        ) {
            if (!isFullScreen) {
                RoboticBackground(
                    scrollOffset = 0,
                    modifier = Modifier.fillMaxSize(),
                    autoAnimate = true
                )
            }
            AndroidView(
                factory = { context ->
                    val frameLayout = FrameLayout(context)
                    val webView = WebView(context)
                    webViewInstance = webView
                    
                    webView.apply {
                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                isLoading = true
                                hasError = false
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                isLoading = false
                                view?.evaluateJavascript("""
                                    if (window.location.hostname.includes('youtube.com') || window.location.hostname.includes('youtu.be')) {
                                        setTimeout(function() {
                                            var videos = document.querySelectorAll('video');
                                            videos.forEach(function(video) {
                                                if (video.videoHeight < 1080) { video.playbackRate = 1; }
                                            });
                                        }, 3000);
                                    }
                                """, null)
                            }

                            @Suppress("DeprecatedCallableAddReplaceWith")
                            @Deprecated("Deprecated in Java")
                            override fun onReceivedError(
                                view: WebView?,
                                errorCode: Int,
                                description: String?,
                                failingUrl: String?
                            ) {
                                hasError = true
                                isLoading = false
                            }

                            override fun onReceivedError(
                                view: WebView?,
                                request: WebResourceRequest?,
                                error: android.webkit.WebResourceError?
                            ) {
                                if (request?.isForMainFrame == true) {
                                    hasError = true
                                    isLoading = false
                                }
                            }

                            override fun shouldOverrideUrlLoading(
                                view: WebView?,
                                request: WebResourceRequest?
                            ): Boolean = false
                        }

                        webChromeClient = object : WebChromeClient() {
                            private var customView: View? = null
                            private var customViewCallback: CustomViewCallback? = null
                            
                            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                if (newProgress == 100) isLoading = false
                            }

                            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                                if (customView != null) {
                                    onHideCustomView()
                                    return
                                }
                                
                                customView = view
                                customViewCallback = callback
                                isFullScreen = true
                                
                                activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                                activity?.window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                                
                                view?.let {
                                    it.setBackgroundColor(android.graphics.Color.BLACK)
                                    frameLayout.addView(it, FrameLayout.LayoutParams(
                                        ViewGroup.LayoutParams.MATCH_PARENT,
                                        ViewGroup.LayoutParams.MATCH_PARENT
                                    ))
                                    webView.visibility = View.GONE
                                }
                            }

                            override fun onHideCustomView() {
                                isFullScreen = false
                                activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                                activity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                                
                                customView?.let {
                                    frameLayout.removeView(it)
                                    customView = null
                                    webView.visibility = View.VISIBLE
                                }
                                customViewCallback?.onCustomViewHidden()
                                customViewCallback = null
                            }
                        }

                        @SuppressLint("SetJavaScriptEnabled")
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.allowFileAccess = true
                        settings.allowContentAccess = true
                        settings.mediaPlaybackRequiresUserGesture = false
                        
                        if (serviceId.contains("tiktok", ignoreCase = true) || serviceId.contains("netflix", ignoreCase = true)) {
                            settings.userAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                            settings.useWideViewPort = true
                            settings.loadWithOverviewMode = true
                        } else {
                            settings.userAgentString = null
                            settings.useWideViewPort = false
                            settings.loadWithOverviewMode = false
                        }

                        loadUrl(url)
                    }

                    frameLayout.addView(webView, FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    ))
                    frameLayout
                },
                modifier = Modifier.fillMaxSize(),
                update = { view ->
                    // Hide the entire frameLayout (containing the webView) if there is an error or timeout
                    view.visibility = if (hasError || showMaintenanceAfterTimeout) View.GONE else View.VISIBLE
                }
            )

            AnimatedVisibility(
                visible = isLoading && !hasError && !showMaintenanceAfterTimeout,
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                LinearProgressIndicator(
                    modifier = Modifier.fillMaxWidth().align(Alignment.TopCenter),
                    color = MaterialTheme.colorScheme.primary
                )
            }

            if (hasError || showMaintenanceAfterTimeout) {
                MaintenanceView(
                    onRetry = {
                        hasError = false
                        showMaintenanceAfterTimeout = false
                        isLoading = true
                        webViewInstance?.reload()
                    },
                    onBack = onClose
                )
            }

            if (isTimerEnabled && !isFullScreen) {
                FloatingTimerOverlay()
            }
        }
    }
}

@Composable
fun MaintenanceView(onRetry: () -> Unit, onBack: () -> Unit) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.5f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Box(modifier = Modifier.fillMaxSize()) {
        RoboticBackground(
            scrollOffset = 0,
            modifier = Modifier.fillMaxSize(),
            autoAnimate = true
        )
        
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .graphicsLayer {
                        this.alpha = alpha
                        this.scaleX = alpha + 0.1f
                        this.scaleY = alpha + 0.1f
                    },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Build,
                    contentDescription = null,
                    modifier = Modifier.size(80.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            }

            Spacer(modifier = Modifier.height(32.dp))
            
            Text(
                text = "Service Under Maintenance",
                style = MaterialTheme.typography.headlineSmall.copy(
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                ),
                color = MaterialTheme.colorScheme.onBackground,
                textAlign = TextAlign.Center
            )
            
            Text(
                text = "सेवा मर्मतमा छ",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.8f),
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "We're updating this service to serve you better. Please try again after a few moments.",
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
                color = Color.Gray,
                modifier = Modifier.padding(horizontal = 24.dp)
            )

            Spacer(modifier = Modifier.height(48.dp))

            Button(
                onClick = onRetry,
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .height(56.dp)
                    .fillMaxWidth(0.7f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Text("Try Again", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            TextButton(
                onClick = onBack,
                modifier = Modifier.padding(top = 12.dp)
            ) {
                Text("Go Back to Services", color = Color.Gray)
            }
        }
    }
}

@Composable
fun FloatingTimerOverlay() {
    var seconds by remember { mutableIntStateOf(0) }
    var offsetX by remember { mutableFloatStateOf(20f) }
    var offsetY by remember { mutableFloatStateOf(20f) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(1000)
            seconds++
        }
    }

    val hours = seconds / 3600
    val minutes = (seconds % 3600) / 60
    val secs = seconds % 60
    val timeString = String.format(Locale.getDefault(), "%02d:%02d:%02d", hours, minutes, secs)

    Surface(
        modifier = Modifier
            .offset { IntOffset(offsetX.roundToInt(), offsetY.roundToInt()) }
            .pointerInput(Unit) {
                detectDragGestures { change, dragAmount ->
                    change.consume()
                    offsetX += dragAmount.x
                    offsetY += dragAmount.y
                }
            }
            .padding(8.dp),
        shape = RoundedCornerShape(24.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp,
        shadowElevation = 6.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.Black.copy(alpha = 0.1f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Timer,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = Color.Gray
            )
            Text(
                text = timeString,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    letterSpacing = 0.5.sp
                )
            )
        }
    }
}
