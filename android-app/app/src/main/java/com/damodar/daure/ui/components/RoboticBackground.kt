package com.damodar.daure.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun RoboticBackground(
    scrollOffset: Int,
    modifier: Modifier = Modifier,
    autoAnimate: Boolean = false
) {
    val rotationBase = if (autoAnimate) {
        val infiniteTransition = rememberInfiniteTransition(label = "robot")
        val animRotation by infiniteTransition.animateFloat(
            initialValue = 0f,
            targetValue = 360f,
            animationSpec = infiniteRepeatable(
                animation = tween(20000, easing = LinearEasing),
                repeatMode = RepeatMode.Restart
            ),
            label = "rotation"
        )
        animRotation
    } else {
        scrollOffset.toFloat() / 8f
    }

    val rotation = rotationBase

    Canvas(
        modifier = modifier
            .fillMaxSize()
            .graphicsLayer(alpha = 0.6f) // Made brighter
    ) {
        val center = Offset(size.width / 2, size.height / 2)
        val maxRadius = size.width * 0.8f

        // Brighter tech colors as previous
        val primaryColor = Color(0xFF00E5FF) // Cyan
        val accentColor = Color(0xFF00B0FF)  // Light Blue
        val secondaryColor = Color(0xFF2196F3) // Blue

        drawCircle(
            color = accentColor.copy(alpha = 0.3f),
            radius = maxRadius * 0.35f,
            center = center,
            style = Stroke(width = 2.dp.toPx())
        )

        rotate(rotation, center) {
            val barCount = 60
            for (i in 0 until barCount) {
                val angle = i * (360f / barCount)
                val barHeight = (20.dp.toPx() + (sin((i + rotation / 10f)) * 10.dp.toPx())).coerceAtLeast(5.dp.toPx())
                rotate(angle, center) {
                    drawRect(
                        color = primaryColor,
                        topLeft = Offset(center.x + maxRadius * 0.4f, center.y - 1.dp.toPx()),
                        size = Size(barHeight, 2.dp.toPx())
                    )
                }
            }
        }

        rotate(-rotation * 0.5f, center) {
            drawCircle(
                color = primaryColor,
                radius = maxRadius * 0.55f,
                center = center,
                style = Stroke(
                    width = 4.dp.toPx(),
                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(30f, 20f))
                )
            )
        }

        rotate(rotation * 0.3f, center) {
            val blockCount = 12
            for (i in 0 until blockCount) {
                val angle = i * (360f / blockCount)
                rotate(angle, center) {
                    drawRect(
                        color = secondaryColor.copy(alpha = 0.6f),
                        topLeft = Offset(center.x + maxRadius * 0.7f, center.y - 10.dp.toPx()),
                        size = Size(15.dp.toPx(), 20.dp.toPx()),
                        style = Stroke(width = 2.dp.toPx())
                    )
                }
            }
        }

        drawCircuitry(center, maxRadius, rotation, primaryColor)
        drawCubes(rotation, primaryColor)
    }
}

private fun androidx.compose.ui.graphics.drawscope.DrawScope.drawCircuitry(
    center: Offset,
    maxRadius: Float,
    rotation: Float,
    color: Color
) {
    rotate(rotation * 0.1f, center) {
        for (i in 0 until 8) {
            val angle = Math.toRadians((i * 45.0)).toFloat()
            val startX = center.x + maxRadius * 0.8f * cos(angle)
            val startY = center.y + maxRadius * 0.8f * sin(angle)
            val midX = center.x + maxRadius * 1.0f * cos(angle)
            val midY = center.y + maxRadius * 1.0f * sin(angle)
            val endX = center.x + maxRadius * 1.2f * cos(angle + 0.2f)
            val endY = center.y + maxRadius * 1.2f * sin(angle + 0.2f)
            drawLine(color.copy(alpha = 0.5f), Offset(startX, startY), Offset(midX, midY), 1.dp.toPx())
            drawLine(color.copy(alpha = 0.5f), Offset(midX, midY), Offset(endX, endY), 1.dp.toPx())
            drawCircle(color.copy(alpha = 0.5f), 3.dp.toPx(), Offset(endX, endY))
        }
    }
}

private fun androidx.compose.ui.graphics.drawscope.DrawScope.drawCubes(rotation: Float, color: Color) {
    val positions = listOf(
        Offset(0.15f, 0.15f), Offset(0.85f, 0.2f),
        Offset(0.1f, 0.7f), Offset(0.9f, 0.8f),
        Offset(0.5f, 0.95f)
    )
    positions.forEachIndexed { index, pos ->
        val x = pos.x * size.width
        val y = pos.y * size.height
        rotate(rotation * (index + 1) * 0.2f, Offset(x, y)) {
            drawRect(
                color = color.copy(alpha = 0.4f),
                topLeft = Offset(x - 10.dp.toPx(), y - 10.dp.toPx()),
                size = Size(20.dp.toPx(), 20.dp.toPx()),
                style = Stroke(width = 1.dp.toPx())
            )
            drawRect(
                color = color.copy(alpha = 0.3f),
                topLeft = Offset(x - 5.dp.toPx(), y - 5.dp.toPx()),
                size = Size(10.dp.toPx(), 10.dp.toPx())
            )
        }
    }
}
