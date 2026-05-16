import SwiftUI

struct GamesView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    let onNavigateToBrowser: (String, String, String) -> Void
    
    @State private var showOfflineDialog = false
    
    var body: some View {
        ZStack {
            Color(.systemBackground)
                .ignoresSafeArea()
            
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text(viewModel.language == "ne" ? "🎮 खेलहरू" : "🎮 Games")
                        .font(.largeTitle.bold())
                        .padding(.top, 16)
                    
                    Text(viewModel.language == "ne" ? "ब्राउजरमा खेल्नुहोस्" : "Play in browser")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    // Games Grid
                    let chunked = viewModel.filteredGames.chunked(into: 3)
                    ForEach(Array(chunked.enumerated()), id: \.offset) { _, row in
                        HStack(spacing: 12) {
                            ForEach(row) { item in
                                ServiceItemCard(item: item) {
                                    handleGameClick(item)
                                }
                            }
                            if row.count < 3 {
                                ForEach(0..<(3 - row.count), id: \.self) { _ in
                                    Spacer().frame(maxWidth: .infinity)
                                }
                            }
                        }
                    }
                    
                    Spacer().frame(height: 32)
                }
                .padding(.horizontal, 16)
            }
        }
        .alert(viewModel.language == "ne" ? "इन्टरनेट जडान छैन" : "No Internet Connection", isPresented: $showOfflineDialog) {
            Button("Open Settings") {
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text(viewModel.language == "ne" ?
                 "तपाईं हाल अफलाइन हुनुहुन्छ।" :
                 "You are currently offline. Please check your internet connection.")
        }
    }
    
    private func handleGameClick(_ item: ServiceItem) {
        viewModel.onServiceClicked(item)
        if viewModel.isOnline {
            let title = viewModel.language == "ne" ? item.nameNe : item.name
            onNavigateToBrowser(item.url, title, item.id)
        } else {
            showOfflineDialog = true
        }
    }
}

#Preview {
    GamesView(onNavigateToBrowser: { _, _, _ in })
        .environmentObject(HomeViewModel())
}
