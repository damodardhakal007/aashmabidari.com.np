import SwiftUI

struct ContentView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    
    var body: some View {
        Group {
            if let isFirstTime = viewModel.isFirstTime {
                if isFirstTime {
                    WelcomeView(onGetStarted: {
                        viewModel.setFirstTimeCompleted()
                    })
                } else {
                    MainTabView()
                }
            } else {
                // Loading state
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.systemBackground))
            }
        }
    }
}

struct MainTabView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    @State private var selectedTab: Tab = .home
    @State private var browserURL: String?
    @State private var browserTitle: String?
    @State private var browserServiceId: String?
    @State private var showBrowser = false
    @State private var showSettings = false
    
    enum Tab {
        case home, browser, games, activity
    }
    
    var body: some View {
        ZStack(alignment: .bottom) {
            // Main Content
            Group {
                switch selectedTab {
                case .home:
                    HomeView(
                        onNavigateToBrowser: { url, title, serviceId in
                            browserURL = url
                            browserTitle = title
                            browserServiceId = serviceId
                            showBrowser = true
                        },
                        onNavigateToSettings: {
                            showSettings = true
                        }
                    )
                case .browser:
                    BrowserInputView(
                        onNavigateToBrowser: { url, title in
                            browserURL = url
                            browserTitle = title
                            browserServiceId = "custom_url"
                            showBrowser = true
                        }
                    )
                case .games:
                    GamesView(
                        onNavigateToBrowser: { url, title, serviceId in
                            browserURL = url
                            browserTitle = title
                            browserServiceId = serviceId
                            showBrowser = true
                        }
                    )
                case .activity:
                    ActivityView(
                        onNavigateToBrowser: { url, title, serviceId in
                            browserURL = url
                            browserTitle = title
                            browserServiceId = serviceId
                            showBrowser = true
                        }
                    )
                }
            }
            .padding(.bottom, 70)
            
            // Custom Bottom Bar
            CustomBottomBar(selectedTab: $selectedTab)
        }
        .ignoresSafeArea(.keyboard)
        .fullScreenCover(isPresented: $showBrowser) {
            if let url = browserURL, let title = browserTitle, let serviceId = browserServiceId {
                BrowserView(
                    url: url,
                    title: title,
                    serviceId: serviceId,
                    onClose: { showBrowser = false }
                )
                .environmentObject(viewModel)
            }
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
                .environmentObject(viewModel)
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(HomeViewModel())
}
