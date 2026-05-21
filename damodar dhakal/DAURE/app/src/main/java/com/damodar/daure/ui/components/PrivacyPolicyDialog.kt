package com.damodar.daure.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

@Composable
fun PrivacyPolicyDialog(
    isDarkMode: Boolean,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                "Privacy Policy",
                fontWeight = FontWeight.Bold,
                color = if (isDarkMode) Color.White else Color.Black
            )
        },
        text = {
            Column(
                modifier = Modifier
                    .verticalScroll(rememberScrollState())
                    .fillMaxWidth()
            ) {
                Text(
                    "Last updated: May 2024\n\n" +
                    "Welcome to DAURE. Your privacy is important to us.\n\n" +
                    "1. Information Collection\n" +
                    "When you sign up, we collect your name, email address, mobile number, location, gender, and profile picture. This information is used to personalize your experience and provide relevant services.\n\n" +
                    "2. App Usage\n" +
                    "DAURE provides access to various government, financial, and social services. We may track which services you visit frequently to provide a 'Recent' section for your convenience. Your browsing history within the app's internal browser is not stored by us.\n\n" +
                    "3. Account Security\n" +
                    "You are responsible for maintaining the confidentiality of your login credentials. We use industry-standard measures to protect your data, but no method of transmission over the internet is 100% secure.\n\n" +
                    "4. Permissions\n" +
                    "The app requires location permissions to provide weather updates and location-specific services. Camera access is required only when you choose to upload or change your profile picture.\n\n" +
                    "5. Data Sharing\n" +
                    "We do not sell your personal information to third parties. Data is used solely for the functionality of the DAURE application.\n\n" +
                    "6. Changes to Policy\n" +
                    "We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes.",
                    fontSize = 14.sp,
                    color = if (isDarkMode) Color.White.copy(alpha = 0.8f) else Color.Black.copy(alpha = 0.8f)
                )
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Close", color = Color(0xFF2196F3), fontWeight = FontWeight.Bold)
            }
        },
        containerColor = if (isDarkMode) Color(0xFF1E1E1E) else Color.White
    )
}
