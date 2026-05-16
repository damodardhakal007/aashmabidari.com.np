import SwiftUI

struct WelcomeView: View {
    let onGetStarted: () -> Void
    
    @State private var flagScale: CGFloat = 0.8
    @State private var flagOpacity: Double = 0.0
    
    var body: some View {
        ZStack {
            // Dark background
            Color(red: 0.05, green: 0.07, blue: 0.09)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Top section with Nepal flag
                Spacer()
                
                // Nepal Flag representation
                VStack(spacing: 16) {
                    Image(systemName: "flag.fill")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 120, height: 120)
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color(red: 0.86, green: 0.08, blue: 0.24), Color(red: 0.0, green: 0.25, blue: 0.53)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                    
                    Text("🇳🇵")
                        .font(.system(size: 80))
                }
                .scaleEffect(flagScale)
                .opacity(flagOpacity)
                .onAppear {
                    withAnimation(.easeOut(duration: 1.0)) {
                        flagScale = 1.0
                        flagOpacity = 1.0
                    }
                }
                
                Spacer()
                
                // Bottom white card
                VStack(alignment: .leading, spacing: 0) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Welcome To")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.black)
                        
                        Text("DAURE")
                            .font(.system(size: 40, weight: .heavy))
                            .foregroundColor(Color(red: 0.1, green: 0.46, blue: 0.82))
                    }
                    .padding(.top, 32)
                    
                    Spacer()
                    
                    HStack {
                        Spacer()
                        Button(action: onGetStarted) {
                            HStack(spacing: 8) {
                                Text("get started")
                                    .font(.system(size: 18, weight: .bold))
                                Image(systemName: "arrow.right")
                                    .font(.system(size: 16, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 16)
                            .background(Color(red: 0.0, green: 0.47, blue: 0.42))
                            .clipShape(RoundedRectangle(cornerRadius: 28))
                        }
                    }
                    .padding(.bottom, 32)
                }
                .padding(.horizontal, 32)
                .frame(maxWidth: .infinity)
                .frame(height: UIScreen.main.bounds.height * 0.35)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 40, style: .continuous))
            }
        }
    }
}

#Preview {
    WelcomeView(onGetStarted: {})
}
