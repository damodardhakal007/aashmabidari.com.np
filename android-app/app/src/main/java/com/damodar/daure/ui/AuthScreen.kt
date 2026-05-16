package com.damodar.daure.ui

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import kotlinx.coroutines.launch
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.damodar.daure.ui.components.PrivacyPolicyDialog
import coil.compose.AsyncImage

@Composable
fun AuthScreen(
    viewModel: HomeViewModel,
    onBack: () -> Unit,
    onAuthSuccess: () -> Unit
) {
    var isLogin by remember { mutableStateOf(true) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var mobile by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPasswordVisible by remember { mutableStateOf(false) }
    var agreeToTerms by remember { mutableStateOf(false) }
    var imageUri by remember { mutableStateOf<Uri?>(null) }
    var showPrivacyPolicy by remember { mutableStateOf(false) }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        imageUri = uri
    }

    val isDarkMode by viewModel.isDarkMode.collectAsState()
    val context = androidx.compose.ui.platform.LocalContext.current
    val scope = rememberCoroutineScope()
    val credentialManager = CredentialManager.create(context)

    if (showPrivacyPolicy) {
        PrivacyPolicyDialog(
            isDarkMode = isDarkMode,
            onDismiss = { showPrivacyPolicy = false }
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(if (isDarkMode) Color(0xFF121212) else Color.White)
    ) {
        // Decorative Blue Circles (Changed from Pink)
        Box(
            modifier = Modifier
                .offset(x = 200.dp, y = (-50).dp)
                .size(250.dp)
                .clip(CircleShape)
                .background(Color(0xFF2196F3).copy(alpha = 0.8f))
        )
        Box(
            modifier = Modifier
                .offset(x = 300.dp, y = 50.dp)
                .size(150.dp)
                .clip(CircleShape)
                .background(Color(0xFF2196F3).copy(alpha = 0.4f))
        )

        // Bottom Decorative Wave (Changed from Pink)
        Box(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .fillMaxWidth()
                .height(180.dp)
                .clip(RoundedCornerShape(topStart = 100.dp))
                .background(Color(0xFF2196F3))
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .padding(horizontal = 32.dp)
                .verticalScroll(rememberScrollState())
        ) {
            IconButton(
                onClick = onBack,
                modifier = Modifier.padding(top = 16.dp)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = if (isDarkMode) Color.White else Color.Black
                )
            }

            // Profile Picture Upload Section
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .align(Alignment.CenterHorizontally)
                    .clip(CircleShape)
                    .background(Color.LightGray.copy(alpha = 0.3f))
                    .clickable(enabled = !isLogin) { launcher.launch("image/*") },
                contentAlignment = Alignment.Center
            ) {
                if (!isLogin && imageUri != null) {
                    AsyncImage(
                        model = imageUri,
                        contentDescription = "Profile",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else if (!isLogin) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.CameraAlt,
                            contentDescription = null,
                            tint = Color.Gray
                        )
                        Text("Upload", fontSize = 10.sp, color = Color.Gray)
                    }
                } else {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = Color.Gray,
                        modifier = Modifier.size(48.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = if (isLogin) "Sign In" else "Sign Up",
                style = MaterialTheme.typography.displaySmall,
                fontWeight = FontWeight.Bold,
                color = if (isDarkMode) Color.White else Color.Black
            )
            
            Text(
                text = if (isLogin) "Welcome back! Please login" else "Hello! let's join with us",
                style = MaterialTheme.typography.bodyMedium,
                color = if (isDarkMode) Color.White else Color.Black,
                modifier = Modifier.padding(top = 4.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            if (!isLogin) {
                AuthTextField(
                    value = name,
                    onValueChange = { name = it },
                    placeholder = "Name",
                    leadingIcon = Icons.Default.Person,
                    isDarkMode = isDarkMode
                )
                Spacer(modifier = Modifier.height(16.dp))
                
                AuthTextField(
                    value = mobile,
                    onValueChange = { mobile = it },
                    placeholder = "Mobile Number",
                    leadingIcon = Icons.Default.Phone,
                    keyboardType = KeyboardType.Phone,
                    isDarkMode = isDarkMode
                )
                Spacer(modifier = Modifier.height(16.dp))

                AuthTextField(
                    value = location,
                    onValueChange = { location = it },
                    placeholder = "Location (City/District)",
                    leadingIcon = Icons.Default.LocationOn,
                    isDarkMode = isDarkMode
                )
                Spacer(modifier = Modifier.height(16.dp))

                GenderSelector(
                    selectedGender = gender,
                    onGenderSelected = { gender = it },
                    isDarkMode = isDarkMode
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            AuthTextField(
                value = email,
                onValueChange = { email = it },
                placeholder = "Email",
                leadingIcon = Icons.Default.Email,
                keyboardType = KeyboardType.Email,
                isDarkMode = isDarkMode
            )

            Spacer(modifier = Modifier.height(16.dp))

            AuthTextField(
                value = password,
                onValueChange = { password = it },
                placeholder = "Password",
                leadingIcon = Icons.Default.Lock,
                isPassword = true,
                passwordVisible = passwordVisible,
                onPasswordToggle = { passwordVisible = !passwordVisible },
                isDarkMode = isDarkMode
            )

            if (!isLogin) {
                Spacer(modifier = Modifier.height(16.dp))
                AuthTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    placeholder = "Confirm Password",
                    leadingIcon = Icons.Default.Lock,
                    isPassword = true,
                    passwordVisible = confirmPasswordVisible,
                    onPasswordToggle = { confirmPasswordVisible = !confirmPasswordVisible },
                    isDarkMode = isDarkMode
                )

                Row(
                    modifier = Modifier.padding(top = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = agreeToTerms,
                        onCheckedChange = { agreeToTerms = it },
                        colors = CheckboxDefaults.colors(checkedColor = Color(0xFF2196F3))
                    )
                    Text(
                        "I agree with ",
                        fontSize = 12.sp,
                        color = if (isDarkMode) Color.White else Color.Black
                    )
                    Text(
                        "privacy policy",
                        fontSize = 12.sp,
                        color = Color(0xFF2196F3),
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.clickable { showPrivacyPolicy = true }
                    )
                }
            } else {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = true, 
                            onCheckedChange = {},
                            colors = CheckboxDefaults.colors(checkedColor = Color(0xFF2196F3))
                        )
                    Text("Remember Me", fontSize = 12.sp, color = if (isDarkMode) Color.White else Color.Black)
                }
                TextButton(onClick = { }) {
                    Text("Forgot Password?", fontSize = 12.sp, color = if (isDarkMode) Color.White else Color.Black)
                }
            }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = {
                    if (isLogin) {
                        if (email.isBlank() || password.isBlank()) {
                            android.widget.Toast.makeText(context, "All fields are mandatory", android.widget.Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        
                        // Check if user is registered and credentials match
                        if (email == viewModel.registeredEmail.value && password == viewModel.registeredPassword.value) {
                            viewModel.login()
                            onAuthSuccess()
                        } else if (viewModel.registeredEmail.value == null) {
                            android.widget.Toast.makeText(context, "No account found. Please sign up first.", android.widget.Toast.LENGTH_SHORT).show()
                        } else {
                            android.widget.Toast.makeText(context, "Invalid email or password", android.widget.Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        if (name.isBlank() || mobile.isBlank() || location.isBlank() || gender.isBlank() || email.isBlank() || password.isBlank() || confirmPassword.isBlank() || imageUri == null) {
                            android.widget.Toast.makeText(context, "All fields are mandatory including profile picture", android.widget.Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        if (password != confirmPassword) {
                            android.widget.Toast.makeText(context, "Passwords do not match", android.widget.Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        if (!agreeToTerms) {
                            android.widget.Toast.makeText(context, "Please agree to privacy policy", android.widget.Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        viewModel.updateProfile(name, mobile, location, gender, imageUri?.toString())
                        viewModel.signup(email, password)
                        onAuthSuccess()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
            ) {
                Text(
                    text = if (isLogin) "LOGIN" else "SIGN UP",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF2196F3)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Google Login Button
            OutlinedButton(
                onClick = {
                    val googleIdOption = GetGoogleIdOption.Builder()
                        .setFilterByAuthorizedAccounts(false)
                        .setServerClientId("599047511141-sr599dhekn8445qc0rbt4hd69dmml1r1.apps.googleusercontent.com") // Replace with actual Web Client ID from Google Console
                        .build()

                    val request = GetCredentialRequest.Builder()
                        .addCredentialOption(googleIdOption)
                        .build()

                    scope.launch {
                        try {
                            val result = credentialManager.getCredential(
                                context = context,
                                request = request
                            )
                            val credential = result.credential
                            if (credential is CustomCredential && credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
                                val googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.data)
                                val email = googleIdTokenCredential.id
                                val displayName = googleIdTokenCredential.displayName ?: ""
                                val profilePicture = googleIdTokenCredential.profilePictureUri?.toString()
                                
                                viewModel.signInWithGoogle(email, displayName, profilePicture)
                                onAuthSuccess()
                            }
                        } catch (e: Exception) {
                            android.widget.Toast.makeText(context, "Google Sign-in failed: ${e.message}", android.widget.Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.outlinedButtonColors(containerColor = Color.Transparent),
                border = BorderStroke(1.dp, if (isDarkMode) Color.White.copy(alpha = 0.5f) else Color.LightGray)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Email, // Replace with Google Icon if available
                        contentDescription = "Google",
                        tint = if (isDarkMode) Color.White else Color.Black,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = if (isLogin) "Login with Google" else "Sign up with Google",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (isDarkMode) Color.White else Color.Black
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 48.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isLogin) "Don't have an Account ? " else "You already have an account? ",
                    color = if (isDarkMode) Color.White else Color.Black,
                    fontSize = 14.sp
                )
                Text(
                    text = if (isLogin) "Sign Up" else "Sign In",
                    color = if (isDarkMode) Color.White else Color.Black,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable { isLogin = !isLogin }
                )
            }
        }
    }
}

@Composable
fun AuthTextField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector,
    keyboardType: KeyboardType = KeyboardType.Text,
    isPassword: Boolean = false,
    passwordVisible: Boolean = false,
    onPasswordToggle: () -> Unit = {},
    isDarkMode: Boolean = false
) {
    TextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth(),
        placeholder = { Text(placeholder, color = Color.Gray) },
        leadingIcon = { Icon(leadingIcon, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(20.dp)) },
        trailingIcon = if (isPassword) {
            {
                IconButton(onClick = onPasswordToggle) {
                    Icon(
                        imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                        contentDescription = null,
                        tint = Color.Gray,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        } else null,
        visualTransformation = if (isPassword && !passwordVisible) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        colors = TextFieldDefaults.colors(
            focusedContainerColor = Color.Transparent,
            unfocusedContainerColor = Color.Transparent,
            focusedIndicatorColor = Color(0xFF2196F3),
            unfocusedIndicatorColor = Color.LightGray,
            cursorColor = if (isDarkMode) Color.White else Color.Black,
            focusedTextColor = if (isDarkMode) Color.White else Color.Black,
            unfocusedTextColor = if (isDarkMode) Color.White else Color.Black
        ),
        singleLine = true
    )
}

@Composable
fun GenderSelector(
    selectedGender: String,
    onGenderSelected: (String) -> Unit,
    isDarkMode: Boolean = false
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Gender:", color = if (isDarkMode) Color.White else Color.Black, fontSize = 14.sp)
        
        GenderOption("Male", selectedGender == "Male", isDarkMode) { onGenderSelected("Male") }
        GenderOption("Female", selectedGender == "Female", isDarkMode) { onGenderSelected("Female") }
        GenderOption("Other", selectedGender == "Other", isDarkMode) { onGenderSelected("Other") }
    }
}

@Composable
fun GenderOption(
    text: String,
    isSelected: Boolean,
    isDarkMode: Boolean = false,
    onClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.clickable { onClick() }
    ) {
        RadioButton(
            selected = isSelected,
            onClick = onClick,
            colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF2196F3))
        )
        Text(text, color = if (isDarkMode) Color.White else Color.Black, fontSize = 12.sp)
    }
}
