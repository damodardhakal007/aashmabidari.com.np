import SwiftUI

struct BrowserInputView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    let onNavigateToBrowser: (String, String) -> Void
    
    @State private var urlText = ""
    @State private var showOfflineDialog = false
    
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            Image(systemName: "globe")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(.accentColor.opacity(0.6))
            
            Text(viewModel.language == "ne" ? "URL खोल्नुहोस्" : "Open URL")
                .font(.title2.bold())
            
            Text(viewModel.language == "ne" ?
                 "कुनै पनि वेबसाइट URL प्रविष्ट गर्नुहोस्" :
                 "Enter any website URL to browse")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            VStack(spacing: 16) {
                HStack {
                    Image(systemName: "link")
                        .foregroundColor(.gray)
                    
                    TextField("https://example.com", text: $urlText)
                        .textFieldStyle(PlainTextFieldStyle())
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .keyboardType(.URL)
                    
                    if !urlText.isEmpty {
                        Button(action: { urlText = "" }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.gray)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color(.systemGray6))
                )
                
                Button(action: {
                    if viewModel.isOnline {
                        var finalUrl = urlText.trimmingCharacters(in: .whitespacesAndNewlines)
                        if !finalUrl.hasPrefix("http://") && !finalUrl.hasPrefix("https://") {
                            finalUrl = "https://\(finalUrl)"
                        }
                        onNavigateToBrowser(finalUrl, finalUrl)
                    } else {
                        showOfflineDialog = true
                    }
                }) {
                    HStack {
                        Image(systemName: "arrow.right.circle.fill")
                        Text(viewModel.language == "ne" ? "खोल्नुहोस्" : "Go")
                            .fontWeight(.semibold)
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(urlText.isEmpty ? Color.gray : Color.accentColor)
                    )
                }
                .disabled(urlText.isEmpty)
            }
            .padding(.horizontal, 32)
            
            // Quick Links
            VStack(alignment: .leading, spacing: 12) {
                Text(viewModel.language == "ne" ? "छिटो लिंकहरू" : "Quick Links")
                    .font(.headline)
                    .padding(.horizontal, 32)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        QuickLinkChip(title: "Google", url: "https://google.com", onTap: { url, title in
                            if viewModel.isOnline {
                                onNavigateToBrowser(url, title)
                            } else {
                                showOfflineDialog = true
                            }
                        })
                        QuickLinkChip(title: "YouTube", url: "https://youtube.com", onTap: { url, title in
                            if viewModel.isOnline {
                                onNavigateToBrowser(url, title)
                            } else {
                                showOfflineDialog = true
                            }
                        })
                        QuickLinkChip(title: "Facebook", url: "https://facebook.com", onTap: { url, title in
                            if viewModel.isOnline {
                                onNavigateToBrowser(url, title)
                            } else {
                                showOfflineDialog = true
                            }
                        })
                        QuickLinkChip(title: "Wikipedia", url: "https://wikipedia.org", onTap: { url, title in
                            if viewModel.isOnline {
                                onNavigateToBrowser(url, title)
                            } else {
                                showOfflineDialog = true
                            }
                        })
                    }
                    .padding(.horizontal, 32)
                }
            }
            
            Spacer()
            Spacer()
        }
        .alert(viewModel.language == "ne" ? "इन्टरनेट जडान छैन" : "No Internet Connection", isPresented: $showOfflineDialog) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Please check your internet connection.")
        }
    }
}

struct QuickLinkChip: View {
    let title: String
    let url: String
    let onTap: (String, String) -> Void
    
    var body: some View {
        Button(action: { onTap(url, title) }) {
            Text(title)
                .font(.caption.bold())
                .foregroundColor(.accentColor)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    Capsule()
                        .fill(Color.accentColor.opacity(0.1))
                )
        }
    }
}

#Preview {
    BrowserInputView(onNavigateToBrowser: { _, _ in })
        .environmentObject(HomeViewModel())
}
