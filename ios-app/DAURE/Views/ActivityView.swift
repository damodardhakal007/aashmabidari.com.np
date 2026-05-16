import SwiftUI

struct ActivityView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    let onNavigateToBrowser: (String, String, String) -> Void
    
    @State private var selectedPeriod = 60
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text(viewModel.language == "ne" ? "📊 गतिविधि" : "📊 Activity")
                    .font(.largeTitle.bold())
                    .padding(.top, 16)
                
                // Period Selector
                Picker("Period", selection: $selectedPeriod) {
                    Text("7 Days").tag(7)
                    Text("30 Days").tag(30)
                    Text("60 Days").tag(60)
                }
                .pickerStyle(.segmented)
                
                // Chart Section
                if !viewModel.chartData.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text(viewModel.language == "ne" ? "शीर्ष सेवाहरू" : "Top Services")
                            .font(.headline)
                        
                        ForEach(Array(viewModel.chartData.enumerated()), id: \.offset) { index, item in
                            let (service, duration) = item
                            let maxDuration = viewModel.chartData.first?.1 ?? 1
                            
                            HStack(spacing: 12) {
                                Text(service.iconChar ?? "📱")
                                    .font(.title3)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(viewModel.language == "ne" ? service.nameNe : service.name)
                                        .font(.caption.bold())
                                        .lineLimit(1)
                                    
                                    GeometryReader { geometry in
                                        RoundedRectangle(cornerRadius: 4)
                                            .fill(barColor(for: index))
                                            .frame(width: geometry.size.width * CGFloat(duration) / CGFloat(maxDuration))
                                    }
                                    .frame(height: 8)
                                }
                                
                                Text(formatDuration(duration))
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color(.systemGray6))
                    )
                }
                
                // Recent Activities
                VStack(alignment: .leading, spacing: 12) {
                    Text(viewModel.language == "ne" ? "भर्खरको गतिविधि" : "Recent Activity")
                        .font(.headline)
                    
                    if viewModel.latest50Activities.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "chart.bar.xaxis")
                                .font(.system(size: 40))
                                .foregroundColor(.secondary)
                            Text(viewModel.language == "ne" ? "कुनै गतिविधि छैन" : "No activity yet")
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 40)
                    } else {
                        ForEach(Array(viewModel.latest50Activities.enumerated()), id: \.offset) { _, item in
                            let (activity, service) = item
                            
                            Button(action: {
                                if viewModel.isOnline {
                                    onNavigateToBrowser(service.url, service.name, service.id)
                                }
                            }) {
                                HStack(spacing: 12) {
                                    Text(service.iconChar ?? "📱")
                                        .font(.title2)
                                        .frame(width: 40, height: 40)
                                        .background(Color(.systemGray5))
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(viewModel.language == "ne" ? service.nameNe : service.name)
                                            .font(.subheadline.bold())
                                            .foregroundColor(.primary)
                                        Text(formatDate(activity.timestamp))
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                    
                                    Spacer()
                                    
                                    Text(formatDuration(activity.durationSeconds))
                                        .font(.caption.bold())
                                        .foregroundColor(.accentColor)
                                }
                                .padding(.vertical, 4)
                            }
                            .buttonStyle(PlainButtonStyle())
                            
                            Divider()
                        }
                    }
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(.systemGray6))
                )
                
                Spacer().frame(height: 32)
            }
            .padding(.horizontal, 16)
        }
    }
    
    private func barColor(for index: Int) -> Color {
        let colors: [Color] = [.blue, .green, .orange, .purple, .red, .teal, .indigo]
        return colors[index % colors.count]
    }
    
    private func formatDuration(_ seconds: Int) -> String {
        if seconds >= 3600 {
            let h = seconds / 3600
            let m = (seconds % 3600) / 60
            return "\(h)h \(m)m"
        } else if seconds >= 60 {
            let m = seconds / 60
            let s = seconds % 60
            return "\(m)m \(s)s"
        }
        return "\(seconds)s"
    }
    
    private func formatDate(_ timestamp: Double) -> String {
        let date = Date(timeIntervalSince1970: timestamp)
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

#Preview {
    ActivityView(onNavigateToBrowser: { _, _, _ in })
        .environmentObject(HomeViewModel())
}
