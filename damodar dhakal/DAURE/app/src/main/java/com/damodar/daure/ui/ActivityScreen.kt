package com.damodar.daure.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.automirrored.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.damodar.daure.data.model.ServiceActivity
import com.damodar.daure.data.model.ServiceItem
import com.damodar.daure.ui.components.MovingEarth
import com.damodar.daure.ui.components.RoboticBackground
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ActivityScreen(
    viewModel: HomeViewModel, 
    onNavigateToBrowser: (url: String, title: String, serviceId: String) -> Unit
) {
    var filterDays by remember { mutableIntStateOf(30) }
    val chartData by viewModel.getChartDataForPeriod(filterDays).collectAsState()
    val totalSeconds = chartData.sumOf { it.second }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFFF8F9FA))) {
        Column(modifier = Modifier.fillMaxSize()) {
            Spacer(modifier = Modifier.height(48.dp))
            
            // Header
            Text(
                text = "Activity Overview",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )

            // Filters
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    text = "Today", 
                    isSelected = filterDays == 1,
                    onClick = { filterDays = 1 }
                )
                FilterChip(
                    text = "This month", 
                    isSelected = filterDays == 30,
                    onClick = { filterDays = 30 }
                )
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                item {
                    DonutChartSection(totalSeconds, chartData)
                }

                items(chartData) { (service, duration) ->
                    ActivityRowItem(service, duration) {
                        onNavigateToBrowser(service.url, service.name, service.id)
                    }
                }
            }
        }
    }
}

@Composable
fun FilterChip(
    text: String, 
    isSelected: Boolean, 
    onClick: () -> Unit,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector? = null,
    trailingIcon: androidx.compose.ui.graphics.vector.ImageVector? = null
) {
    Surface(
        shape = RoundedCornerShape(20.dp),
        color = if (isSelected) Color(0xFFE8F5E9) else Color.White,
        border = BorderStroke(1.dp, if (isSelected) Color(0xFF2E7D32) else Color.LightGray),
        modifier = Modifier
            .height(32.dp)
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            leadingIcon?.let { Icon(it, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color(0xFF2E7D32)) }
            Text(text = text, fontSize = 13.sp, color = if (isSelected) Color(0xFF2E7D32) else Color.Gray)
            trailingIcon?.let { Icon(it, contentDescription = null, modifier = Modifier.size(16.dp), tint = if (isSelected) Color(0xFF2E7D32) else Color.Gray) }
        }
    }
}


@Composable
fun DonutChartSection(totalSeconds: Long, data: List<Pair<ServiceItem, Long>>) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 24.dp),
        contentAlignment = Alignment.Center
    ) {
        val chartColors = listOf(
            Color(0xFF673AB7), Color(0xFF2196F3), Color(0xFF00BCD4), 
            Color(0xFF4CAF50), Color(0xFFFFC107), Color(0xFFFF9800), Color(0xFFE91E63)
        )

        Canvas(modifier = Modifier.size(240.dp)) {
            var startAngle = -90f
            val strokeWidth = 35.dp.toPx()
            
            if (data.isEmpty()) {
                drawArc(
                    color = Color.LightGray.copy(alpha = 0.3f),
                    startAngle = 0f,
                    sweepAngle = 360f,
                    useCenter = false,
                    style = Stroke(width = strokeWidth)
                )
            } else {
                data.forEachIndexed { index, (_, duration) ->
                    val sweepAngle = (duration.toFloat() / totalSeconds) * 360f
                    drawArc(
                        color = chartColors[index % chartColors.size],
                        startAngle = startAngle,
                        sweepAngle = sweepAngle,
                        useCenter = false,
                        style = Stroke(width = strokeWidth)
                    )
                    startAngle += sweepAngle
                }
            }

            // Inner light gray ring
            drawArc(
                color = Color.LightGray.copy(alpha = 0.2f),
                startAngle = 0f,
                sweepAngle = 360f,
                useCenter = false,
                style = Stroke(width = 2.dp.toPx()),
                size = Size(size.width - strokeWidth, size.height - strokeWidth),
                topLeft = Offset(strokeWidth/2, strokeWidth/2)
            )
        }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = formatDurationFull(totalSeconds),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun ActivityRowItem(service: ServiceItem, duration: Long, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .background(Color.White)
    ) {
        HorizontalDivider(color = Color(0xFFF1F3F4), thickness = 1.dp)
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(10.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF673AB7)) // Should match chart color
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = service.name,
                modifier = Modifier.weight(1f),
                fontWeight = FontWeight.Medium,
                fontSize = 15.sp
            )
            Text(
                text = formatDurationFull(duration),
                fontWeight = FontWeight.Normal,
                fontSize = 14.sp,
                color = Color.Gray
            )
            Icon(
                Icons.Default.KeyboardArrowDown,
                contentDescription = null,
                tint = Color.LightGray,
                modifier = Modifier.size(20.dp).padding(start = 4.dp)
            )
        }
    }
}

fun formatDurationFull(seconds: Long): String {
    val h = seconds / 3600
    val m = (seconds % 3600) / 60
    return if (h > 0) "${h}h ${m}m" else "${m}m"
}

