package com.damodar.daure.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun AnimatedNepalFlag(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "flag")
    
    // Waving effect for rotation and scale
    val waveOffset by infiniteTransition.animateFloat(
        initialValue = -5f,
        targetValue = 5f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "wave"
    )

    Canvas(
        modifier = modifier
            .size(220.dp)
            .graphicsLayer {
                rotationZ = waveOffset
                scaleX = 1f + (waveOffset / 100f)
            }
    ) {
        drawNepalFlag()
    }
}

fun DrawScope.drawNepalFlag() {
    val w = size.width
    val h = size.height
    val crimson = Color(0xFFDC143C)
    val blue = Color(0xFF003893)
    val white = Color.White

    // Improved Flag Path to match the stylized waving look from image
    val path = Path().apply {
        moveTo(w * 0.1f, h * 0.05f)
        // Top triangle with curve
        quadraticTo(w * 0.9f, h * 0.25f, w * 0.95f, h * 0.4f)
        lineTo(w * 0.35f, h * 0.4f)
        // Bottom triangle with curve
        quadraticTo(w * 0.95f, h * 0.65f, w * 0.98f, h * 0.85f)
        quadraticTo(w * 0.5f, h * 0.95f, w * 0.1f, h * 0.85f)
        close()
    }

    // Border
    drawPath(
        path = path,
        color = blue,
        style = androidx.compose.ui.graphics.drawscope.Stroke(width = 8.dp.toPx(), join = androidx.compose.ui.graphics.StrokeJoin.Round)
    )
    // Fill
    drawPath(path = path, color = crimson)

    // Moon (Upper) - stylized
    val moonCenter = Offset(w * 0.35f, h * 0.28f)
    drawCircle(white, radius = w * 0.09f, center = moonCenter)
    drawCircle(crimson, radius = w * 0.09f, center = moonCenter.copy(y = moonCenter.y - w * 0.04f))

    // Sun (Lower) - stylized 12 point star
    val sunCenter = Offset(w * 0.38f, h * 0.68f)
    drawStar(white, center = sunCenter, radius = w * 0.12f, points = 12)
}

private fun DrawScope.drawStar(color: Color, center: Offset, radius: Float, points: Int) {
    val path = Path()
    val angleStep = Math.PI * 2 / (points * 2)
    for (i in 0 until points * 2) {
        val currentRadius = if (i % 2 == 0) radius else radius * 0.6f
        val angle = i * angleStep - Math.PI / 2
        val x = center.x + currentRadius * cos(angle).toFloat()
        val y = center.y + currentRadius * sin(angle).toFloat()
        if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
    }
    path.close()
    drawPath(path, color)
}
