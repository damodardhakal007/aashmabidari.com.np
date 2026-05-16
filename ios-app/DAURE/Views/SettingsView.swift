import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var showPrivacyPolicy = false
    @State private var showFontPicker = false
    
    let fonts = ["System", "Roboto", "Open Sans", "Lato", "Montserrat",
                 "Oswald", "Source Sans Pro", "Raleway", "PT Sans", "Merriweather"]
    
    var body: some View {
        NavigationView {
            List {
                // Language
                Section {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(viewModel.language == "ne" ? "भाषा" : "Language")
                                .font(.headline)
                            Text(viewModel.language == "ne" ? "नेपाली / English" : "Nepali / English")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        Toggle("", isOn: Binding(
                            get: { viewModel.language == "ne" },
                            set: { _ in viewModel.toggleLanguage() }
                        ))
                    }
                }
                
                // Theme
                Section {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(viewModel.language == "ne" ? "विषयवस्तु (डार्क मोड)" : "Theme (Dark Mode)")
                                .font(.headline)
                            Text(viewModel.language == "ne" ? "ब्ल्याक मोड सक्रिय गर्नुहोस्" : "Enable Black Mode")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        Toggle("", isOn: Binding(
                            get: { viewModel.isDarkMode },
                            set: { viewModel.toggleTheme($0) }
                        ))
                    }
                }
                
                // Floating Timer
                Section {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(viewModel.language == "ne" ? "फ्लोटिंग सत्र टाइमर" : "Floating Session Timer")
                                .font(.headline)
                            Text(viewModel.language == "ne" ? "सत्रको लागि तैरिरहेको टाइमर देखाउनुहोस्" : "Show a floating timer for the session")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        Toggle("", isOn: Binding(
                            get: { viewModel.isFloatingTimerEnabled },
                            set: { viewModel.toggleFloatingTimer($0) }
                        ))
                    }
                }
                
                // Font
                Section {
                    Button(action: { showFontPicker = true }) {
                        HStack {
                            VStack(alignment: .leading) {
                                Text(viewModel.language == "ne" ? "फन्ट" : "Fonts")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                Text(viewModel.language == "ne" ?
                                     "एपको फन्ट परिवर्तन गर्नुहोस् (\(viewModel.selectedFont))" :
                                     "Change app font style (\(viewModel.selectedFont))")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            Image(systemName: "textformat")
                                .foregroundColor(.accentColor)
                        }
                    }
                }
                
                // Privacy Policy
                Section {
                    Button(action: { showPrivacyPolicy = true }) {
                        HStack {
                            VStack(alignment: .leading) {
                                Text(viewModel.language == "ne" ? "गोपनीयता नीति" : "Privacy Policy")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                Text(viewModel.language == "ne" ? "हाम्रो गोपनीयता नीति पढ्नुहोस्" : "Read our privacy policy")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            Image(systemName: "hand.raised.fill")
                                .foregroundColor(.accentColor)
                        }
                    }
                }
                
                // App Info
                Section(header: Text("About")) {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                    HStack {
                        Text("Developer")
                        Spacer()
                        Text("Damodar")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle(viewModel.language == "ne" ? "सेटिङहरू" : "Settings")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .sheet(isPresented: $showFontPicker) {
                FontPickerView(fonts: fonts)
            }
            .sheet(isPresented: $showPrivacyPolicy) {
                PrivacyPolicyView()
            }
        }
    }
}

// MARK: - Font Picker View
struct FontPickerView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    @Environment(\.dismiss) private var dismiss
    let fonts: [String]
    
    var body: some View {
        NavigationView {
            List(fonts, id: \.self) { font in
                Button(action: {
                    viewModel.setSelectedFont(font)
                    dismiss()
                }) {
                    HStack {
                        Text(font)
                            .font(.body)
                        Spacer()
                        if viewModel.selectedFont == font {
                            Image(systemName: "checkmark")
                                .foregroundColor(.accentColor)
                        }
                    }
                }
                .foregroundColor(.primary)
            }
            .navigationTitle(viewModel.language == "ne" ? "फन्ट छान्नुहोस्" : "Select Font")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(viewModel.language == "ne" ? "बन्द गर्नुहोस्" : "Close") { dismiss() }
                }
            }
        }
    }
}

// MARK: - Privacy Policy View
struct PrivacyPolicyView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Privacy Policy")
                        .font(.title.bold())
                    
                    Text("Last updated: May 2026")
                        .foregroundColor(.secondary)
                    
                    Group {
                        Text("Information We Collect")
                            .font(.headline)
                        Text("DAURE collects minimal user data. We only store your preferences locally on your device, including language settings, theme preference, and browsing activity within the app.")
                        
                        Text("How We Use Information")
                            .font(.headline)
                        Text("Your data is used solely to provide a personalized experience within the app. We do not share your personal information with third parties.")
                        
                        Text("Location Data")
                            .font(.headline)
                        Text("We request location access only to provide weather information for your area. Location data is not stored or shared.")
                        
                        Text("Third-Party Services")
                            .font(.headline)
                        Text("The app provides links to third-party websites. We are not responsible for the privacy practices of these websites.")
                        
                        Text("Data Security")
                            .font(.headline)
                        Text("All user preferences are stored locally on your device. We do not transmit personal data to external servers.")
                        
                        Text("Contact")
                            .font(.headline)
                        Text("For questions about this privacy policy, contact us at support@aashmabidari.com.np")
                    }
                }
                .padding()
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}

#Preview {
    SettingsView()
        .environmentObject(HomeViewModel())
}
