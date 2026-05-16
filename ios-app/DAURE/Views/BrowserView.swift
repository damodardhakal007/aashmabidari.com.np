import SwiftUI
import WebKit

struct BrowserView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    let url: String
    let title: String
    let serviceId: String
    let onClose: () -> Void
    
    @State private var isLoading = true
    @State private var hasError = false
    @State private var showMaintenanceAfterTimeout = false
    @State private var startTime = Date()
    @State private var timerSeconds = 0
    @State private var timerActive = true
    
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    var body: some View {
        NavigationView {
            ZStack {
                if hasError || showMaintenanceAfterTimeout {
                    MaintenanceView(
                        onRetry: {
                            hasError = false
                            showMaintenanceAfterTimeout = false
                            isLoading = true
                        },
                        onBack: onClose
                    )
                } else {
                    WebViewRepresentable(
                        urlString: url,
                        isLoading: $isLoading,
                        hasError: $hasError
                    )
                    .ignoresSafeArea(edges: .bottom)
                    
                    if isLoading {
                        VStack {
                            ProgressView()
                                .progressViewStyle(LinearProgressViewStyle())
                            Spacer()
                        }
                    }
                }
                
                // Floating Timer
                if viewModel.isFloatingTimerEnabled {
                    VStack {
                        HStack {
                            Spacer()
                            FloatingTimerView(seconds: timerSeconds)
                                .padding(.trailing, 16)
                                .padding(.top, 8)
                        }
                        Spacer()
                    }
                }
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: {
                        let duration = Int(Date().timeIntervalSince(startTime))
                        if duration > 0 {
                            viewModel.logServiceActivity(serviceId: serviceId, durationSeconds: duration)
                        }
                        onClose()
                    }) {
                        Image(systemName: "xmark")
                            .foregroundColor(.primary)
                    }
                }
            }
        }
        .onReceive(timer) { _ in
            if timerActive {
                timerSeconds += 1
            }
        }
        .onAppear {
            startTime = Date()
            // Timeout - show maintenance after 5 seconds if still loading
            DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                if isLoading && !hasError {
                    showMaintenanceAfterTimeout = true
                }
            }
        }
        .onChange(of: isLoading) { newValue in
            if !newValue {
                showMaintenanceAfterTimeout = false
            }
        }
        .onDisappear {
            timerActive = false
            let duration = Int(Date().timeIntervalSince(startTime))
            if duration > 0 {
                viewModel.logServiceActivity(serviceId: serviceId, durationSeconds: duration)
            }
        }
    }
}

// MARK: - WebView Representable
struct WebViewRepresentable: UIViewRepresentable {
    let urlString: String
    @Binding var isLoading: Bool
    @Binding var hasError: Bool
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        
        if let url = URL(string: urlString) {
            webView.load(URLRequest(url: url))
        }
        
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
    
    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebViewRepresentable
        
        init(_ parent: WebViewRepresentable) {
            self.parent = parent
        }
        
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
            parent.hasError = false
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.hasError = true
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.hasError = true
        }
    }
}

// MARK: - Maintenance View
struct MaintenanceView: View {
    let onRetry: () -> Void
    let onBack: () -> Void
    
    @State private var pulseScale: CGFloat = 1.0
    
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            Image(systemName: "wrench.and.screwdriver")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(.accentColor)
                .scaleEffect(pulseScale)
                .onAppear {
                    withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                        pulseScale = 1.1
                    }
                }
            
            VStack(spacing: 8) {
                Text("Service Under Maintenance")
                    .font(.title3.bold())
                
                Text("सेवा मर्मतमा छ")
                    .font(.subheadline)
                    .foregroundColor(.accentColor.opacity(0.8))
            }
            
            Text("We're updating this service to serve you better. Please try again after a few moments.")
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(.gray)
                .padding(.horizontal, 24)
            
            Spacer()
            
            Button(action: onRetry) {
                Text("Try Again")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.accentColor)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .padding(.horizontal, 48)
            
            Button(action: onBack) {
                Text("Go Back to Services")
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 32)
        }
    }
}

// MARK: - Floating Timer
struct FloatingTimerView: View {
    let seconds: Int
    
    var timeString: String {
        let h = seconds / 3600
        let m = (seconds % 3600) / 60
        let s = seconds % 60
        return String(format: "%02d:%02d:%02d", h, m, s)
    }
    
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "timer")
                .font(.caption)
                .foregroundColor(.gray)
            Text(timeString)
                .font(.system(size: 14, weight: .bold, design: .monospaced))
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            Capsule()
                .fill(Color(.systemBackground))
                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
        )
    }
}

#Preview {
    BrowserView(url: "https://google.com", title: "Google", serviceId: "test", onClose: {})
        .environmentObject(HomeViewModel())
}
