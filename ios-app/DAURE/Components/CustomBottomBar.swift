import SwiftUI

struct CustomBottomBar: View {
    @Binding var selectedTab: MainTabView.Tab
    
    var body: some View {
        HStack(spacing: 0) {
            BottomBarItem(
                icon: "house.fill",
                title: "Home",
                isSelected: selectedTab == .home,
                action: { selectedTab = .home }
            )
            
            BottomBarItem(
                icon: "globe",
                title: "Browser",
                isSelected: selectedTab == .browser,
                action: { selectedTab = .browser }
            )
            
            BottomBarItem(
                icon: "gamecontroller.fill",
                title: "Games",
                isSelected: selectedTab == .games,
                action: { selectedTab = .games }
            )
            
            BottomBarItem(
                icon: "chart.bar.fill",
                title: "Activity",
                isSelected: selectedTab == .activity,
                action: { selectedTab = .activity }
            )
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 8)
        .padding(.bottom, 20) // Safe area padding
        .background(
            Rectangle()
                .fill(.ultraThinMaterial)
                .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: -4)
                .ignoresSafeArea(edges: .bottom)
        )
    }
}

struct BottomBarItem: View {
    let icon: String
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: isSelected ? .bold : .regular))
                    .foregroundColor(isSelected ? .accentColor : .gray)
                
                Text(title)
                    .font(.system(size: 10, weight: isSelected ? .bold : .regular))
                    .foregroundColor(isSelected ? .accentColor : .gray)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 4)
        }
    }
}

#Preview {
    CustomBottomBar(selectedTab: .constant(.home))
}
