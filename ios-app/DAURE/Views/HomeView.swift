import SwiftUI

struct HomeView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    let onNavigateToBrowser: (String, String, String) -> Void
    let onNavigateToSettings: () -> Void
    
    @State private var showTmsDialog = false
    @State private var showOfflineDialog = false
    @State private var tmsNumber = ""
    
    var body: some View {
        ZStack(alignment: .top) {
            // Background
            LinearGradient(
                colors: [
                    Color(.systemBackground).opacity(0.95),
                    Color(.systemBackground)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 16) {
                    // Spacer for search bar
                    Spacer().frame(height: 60)
                    
                    // Header Card
                    HeaderCard()
                    
                    // Service Sections
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "भर्खरै खोलिएका" : "Recent",
                        items: viewModel.recentServices,
                        sectionId: "recent",
                        initialLimit: 6,
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "नेपाल सरकार" : "Government of Nepal",
                        items: viewModel.filteredGovernment,
                        sectionId: "government",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "कागजात प्रमाणित" : "Document Verify",
                        items: viewModel.filteredDocumentVerify,
                        sectionId: "docs",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "वित्त" : "Finance",
                        items: viewModel.filteredFinance,
                        sectionId: "finance",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "एआई प्लेटफार्महरू" : "AI Platforms",
                        items: viewModel.filteredAI,
                        sectionId: "ai",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "रेडियो स्टेशनहरू" : "Radio Stations",
                        items: viewModel.filteredRadio,
                        sectionId: "radio",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "समाचार" : "News",
                        items: viewModel.filteredNews,
                        sectionId: "news",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "गुगल सेवाहरू" : "Google Services",
                        items: viewModel.filteredGoogle,
                        sectionId: "google",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "टिभी च्यानलहरू" : "TV Channels",
                        items: viewModel.filteredTVChannels,
                        sectionId: "tv",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "बालबालिका विशेष" : "Children's Special",
                        items: viewModel.filteredChildren,
                        sectionId: "kids",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "एसआइपी (पोर्टफोलियो)" : "SIP (Portfolio)",
                        items: viewModel.filteredPortfolio,
                        sectionId: "portfolio",
                        onItemClick: handleServiceClick
                    )
                    
                    ServiceSectionView(
                        title: viewModel.language == "ne" ? "सामाजिक सञ्जाल" : "Social Media",
                        items: viewModel.filteredSocialMedia,
                        sectionId: "social",
                        onItemClick: handleServiceClick
                    )
                    
                    Spacer().frame(height: 32)
                }
                .padding(.horizontal, 16)
            }
            
            // Floating Search Bar
            VStack {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    
                    TextField("Search", text: Binding(
                        get: { viewModel.searchQuery },
                        set: { viewModel.setSearchQuery($0) }
                    ))
                    .textFieldStyle(PlainTextFieldStyle())
                    
                    if !viewModel.searchQuery.isEmpty {
                        Button(action: { viewModel.setSearchQuery("") }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.gray)
                        }
                    }
                    
                    Button(action: onNavigateToSettings) {
                        Image(systemName: "gearshape.fill")
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 26)
                        .fill(Color(.systemBackground))
                        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
                )
                .padding(.horizontal, 16)
                .padding(.top, 8)
            }
        }
        .alert("Select TMS Number (1-200)", isPresented: $showTmsDialog) {
            TextField("TMS Number", text: $tmsNumber)
                .keyboardType(.numberPad)
            Button("Open") {
                if let num = Int(tmsNumber), num >= 1, num <= 200 {
                    let formattedNum = String(format: "%02d", num)
                    onNavigateToBrowser("https://tms\(formattedNum).nepsetms.com.np/login", "TMS \(formattedNum)", "tms_\(formattedNum)")
                }
                tmsNumber = ""
            }
            Button("Cancel", role: .cancel) { tmsNumber = "" }
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
                 "तपाईं हाल अफलाइन हुनुहुन्छ। कृपया यो सेवा प्रयोग गर्न आफ्नो इन्टरनेट जडान जाँच गर्नुहोस्।" :
                 "You are currently offline. Please check your internet connection to use this service.")
        }
    }
    
    private func handleServiceClick(_ item: ServiceItem) {
        viewModel.onServiceClicked(item)
        if viewModel.isOnline {
            if item.isTms {
                showTmsDialog = true
            } else {
                let title = viewModel.language == "ne" ? item.nameNe : item.name
                onNavigateToBrowser(item.url, title, item.id)
            }
        } else {
            showOfflineDialog = true
        }
    }
}

// MARK: - Header Card
struct HeaderCard: View {
    @EnvironmentObject var viewModel: HomeViewModel
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16)
                .fill(
                    LinearGradient(
                        colors: [Color(red: 0.13, green: 0.59, blue: 0.95), Color(red: 0.1, green: 0.46, blue: 0.82)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
            
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Text(viewModel.profileName.isEmpty ?
                         (viewModel.language == "ne" ? "नमस्ते" : "Welcome") :
                         viewModel.profileName)
                        .font(.title2.bold())
                        .foregroundColor(.white)
                    
                    if viewModel.weatherInfo != "No API Key" {
                        Text(viewModel.weatherInfo)
                            .font(.body)
                            .foregroundColor(.white.opacity(0.9))
                    }
                    
                    Spacer().frame(height: 8)
                    
                    Text(viewModel.currentDate)
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                    
                    Text(viewModel.digitalTime)
                        .font(.title.bold())
                        .foregroundColor(.white)
                    
                    HStack(spacing: 6) {
                        Circle()
                            .fill(viewModel.isOnline ? Color.green : Color.red)
                            .frame(width: 8, height: 8)
                        
                        Text(viewModel.isOnline ?
                             (viewModel.language == "ne" ? "अनलाइन" : "Online") :
                             (viewModel.language == "ne" ? "जडान छैन" : "Not Connected"))
                            .font(.caption.bold())
                            .foregroundColor(viewModel.isOnline ? .green : .red)
                    }
                }
                
                Spacer()
                
                // Analogue Clock representation
                AnalogueClockView()
                    .frame(width: 90, height: 90)
            }
            .padding(16)
        }
        .frame(height: 180)
    }
}

// MARK: - Analogue Clock
struct AnalogueClockView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    
    var body: some View {
        let calendar = Calendar.current
        let hour = calendar.component(.hour, from: viewModel.currentTime)
        let minute = calendar.component(.minute, from: viewModel.currentTime)
        let second = calendar.component(.second, from: viewModel.currentTime)
        
        let hourAngle = Double(hour % 12) / 12.0 * 360.0 + Double(minute) / 60.0 * 30.0
        let minuteAngle = Double(minute) / 60.0 * 360.0
        let secondAngle = Double(second) / 60.0 * 360.0
        
        ZStack {
            Circle()
                .stroke(Color.white.opacity(0.3), lineWidth: 2)
            
            // Hour markers
            ForEach(0..<12) { i in
                Rectangle()
                    .fill(Color.white.opacity(0.6))
                    .frame(width: 1.5, height: 6)
                    .offset(y: -35)
                    .rotationEffect(.degrees(Double(i) * 30))
            }
            
            // Hour hand
            Rectangle()
                .fill(Color.white)
                .frame(width: 2.5, height: 22)
                .offset(y: -11)
                .rotationEffect(.degrees(hourAngle))
            
            // Minute hand
            Rectangle()
                .fill(Color.white)
                .frame(width: 2, height: 30)
                .offset(y: -15)
                .rotationEffect(.degrees(minuteAngle))
            
            // Second hand
            Rectangle()
                .fill(Color.red)
                .frame(width: 1, height: 34)
                .offset(y: -17)
                .rotationEffect(.degrees(secondAngle))
            
            Circle()
                .fill(Color.white)
                .frame(width: 5, height: 5)
        }
    }
}

// MARK: - Service Section View
struct ServiceSectionView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    let title: String
    let items: [ServiceItem]
    let sectionId: String
    var initialLimit: Int = 3
    let onItemClick: (ServiceItem) -> Void
    
    var isExpanded: Bool {
        viewModel.expandedSections.contains(sectionId)
    }
    
    var displayItems: [ServiceItem] {
        isExpanded ? items : Array(items.prefix(initialLimit))
    }
    
    var body: some View {
        if items.isEmpty { EmptyView() }
        else {
            VStack(alignment: .leading, spacing: 8) {
                Text(title)
                    .font(.title2.bold())
                    .padding(.bottom, 4)
                
                // Grid of items (3 per row)
                let chunked = displayItems.chunked(into: 3)
                ForEach(Array(chunked.enumerated()), id: \.offset) { _, row in
                    HStack(spacing: 8) {
                        ForEach(row) { item in
                            ServiceItemCard(item: item, onTap: { onItemClick(item) })
                        }
                        // Fill remaining space
                        if row.count < 3 {
                            ForEach(0..<(3 - row.count), id: \.self) { _ in
                                Spacer().frame(maxWidth: .infinity)
                            }
                        }
                    }
                }
                
                if items.count > initialLimit {
                    Button(action: { viewModel.toggleSection(sectionId) }) {
                        HStack {
                            Text(isExpanded ?
                                 (viewModel.language == "ne" ? "कम देखाउनुहोस्" : "Show Less") :
                                 (viewModel.language == "ne" ? "थप देखाउनुहोस्" : "Show More"))
                                .font(.subheadline.weight(.medium))
                            Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                                .font(.caption)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .overlay(
                            Capsule()
                                .stroke(Color(.systemGray4), lineWidth: 1)
                        )
                    }
                    .foregroundColor(.accentColor)
                    .padding(.top, 8)
                }
            }
            .padding(.vertical, 8)
        }
    }
}

// MARK: - Service Item Card
struct ServiceItemCard: View {
    let item: ServiceItem
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 6) {
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.89, green: 0.95, blue: 1.0), Color(red: 0.73, green: 0.87, blue: 0.98), .white],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: Color(red: 0.13, green: 0.59, blue: 0.95).opacity(0.3), radius: 6, x: 0, y: 3)
                    
                    if let iconUrl = item.iconUrl, let url = URL(string: iconUrl) {
                        AsyncImage(url: url) { phase in
                            switch phase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .scaledToFit()
                                    .padding(14)
                            case .failure(_):
                                Text(item.iconChar ?? String(item.name.prefix(1)))
                                    .font(.title2.bold())
                                    .foregroundColor(Color(red: 0.1, green: 0.46, blue: 0.82))
                            case .empty:
                                ProgressView()
                                    .scaleEffect(0.5)
                            @unknown default:
                                Text(item.iconChar ?? "?")
                            }
                        }
                    } else {
                        Text(item.iconChar ?? String(item.name.prefix(1)))
                            .font(.title2.bold())
                            .foregroundColor(Color(red: 0.1, green: 0.46, blue: 0.82))
                    }
                }
                .frame(width: 68, height: 68)
                
                Text(item.name)
                    .font(.caption2.bold())
                    .lineLimit(1)
                    .foregroundColor(.primary)
                
                if let subtitle = item.subtitle {
                    Text(subtitle)
                        .font(.system(size: 8))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Array Extension
extension Array {
    func chunked(into size: Int) -> [[Element]] {
        stride(from: 0, to: count, by: size).map {
            Array(self[$0..<Swift.min($0 + size, count)])
        }
    }
}

#Preview {
    HomeView(
        onNavigateToBrowser: { _, _, _ in },
        onNavigateToSettings: {}
    )
    .environmentObject(HomeViewModel())
}
