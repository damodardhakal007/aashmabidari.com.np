package com.damodar.daure.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.unit.dp

@Composable
fun MovingEarth(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "earth")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(10000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )

    Box(modifier = modifier.clip(CircleShape)) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(size.width / 2, size.height / 2)
            val radius = size.minDimension / 2

            // Ocean
            drawCircle(
                color = Color(0xFF2196F3),
                radius = radius,
                center = center
            )

            rotate(rotation) {
                // Land masses (simplified)
                drawCircle(
                    color = Color(0xFF4CAF50),
                    radius = radius * 0.4f,
                    center = Offset(center.x - radius * 0.3f, center.y - radius * 0.2f)
                )
                drawCircle(
                    color = Color(0xFF4CAF50),
                    radius = radius * 0.3f,
                    center = Offset(center.x + radius * 0.4f, center.y + radius * 0.1f)
                )
                drawCircle(
                    color = Color(0xFF8BC34A),
                    radius = radius * 0.25f,
                    center = Offset(center.x + radius * 0.1f, center.y - radius * 0.5f)
                )
            }

            // Atmosphere/Glow
            drawCircle(
                color = Color.White.copy(alpha = 0.2f),
                radius = radius,
                center = center,
                style = Stroke(width = 2.dp.toPx())
            )
        }
    }
}
