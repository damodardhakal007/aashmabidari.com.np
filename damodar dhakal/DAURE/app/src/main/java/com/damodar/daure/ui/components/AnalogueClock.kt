package com.damodar.daure.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import java.util.Calendar
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun AnalogueClock(
    calendar: Calendar,
    modifier: Modifier = Modifier,
    color: Color = Color.Black
) {
    Canvas(modifier = modifier.size(100.dp)) {
        val center = Offset(size.width / 2, size.height / 2)
        val radius = size.width / 2

        // Draw clock face
        drawCircle(
            color = color,
            radius = radius,
            style = Stroke(width = 2.dp.toPx())
        )

        // Draw hour markers
        for (i in 0 until 12) {
            val angle = Math.toRadians(i * 30.0)
            val start = Offset(
                center.x + (radius - 10.dp.toPx()) * cos(angle).toFloat(),
                center.y + (radius - 10.dp.toPx()) * sin(angle).toFloat()
            )
            val end = Offset(
                center.x + radius * cos(angle).toFloat(),
                center.y + radius * sin(angle).toFloat()
            )
            drawLine(
                color = color,
                start = start,
                end = end,
                strokeWidth = 2.dp.toPx()
            )
        }

        val second = calendar.get(Calendar.SECOND)
        val minute = calendar.get(Calendar.MINUTE)
        val hour = calendar.get(Calendar.HOUR)

        // Second hand
        val secondAngle = Math.toRadians((second * 6 - 90).toDouble())
        drawLine(
            color = Color.Red,
            start = center,
            end = Offset(
                center.x + (radius * 0.8f) * cos(secondAngle).toFloat(),
                center.y + (radius * 0.8f) * sin(secondAngle).toFloat()
            ),
            strokeWidth = 1.dp.toPx(),
            cap = StrokeCap.Round
        )

        // Minute hand
        val minuteAngle = Math.toRadians((minute * 6 - 90).toDouble())
        drawLine(
            color = color,
            start = center,
            end = Offset(
                center.x + (radius * 0.7f) * cos(minuteAngle).toFloat(),
                center.y + (radius * 0.7f) * sin(minuteAngle).toFloat()
            ),
            strokeWidth = 2.dp.toPx(),
            cap = StrokeCap.Round
        )

        // Hour hand
        val hourAngle = Math.toRadians(((hour * 30) + (minute * 0.5) - 90))
        drawLine(
            color = color,
            start = center,
            end = Offset(
                center.x + (radius * 0.5f) * cos(hourAngle).toFloat(),
                center.y + (radius * 0.5f) * sin(hourAngle).toFloat()
            ),
            strokeWidth = 3.dp.toPx(),
            cap = StrokeCap.Round
        )
        
        // Center dot
        drawCircle(
            color = color,
            radius = 4.dp.toPx()
        )
    }
}
