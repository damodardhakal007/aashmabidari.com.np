import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var viewModel: HomeViewModel
    @Environment(\.dismiss) private var dismiss
    
    @State private var name: String = ""
    @State private var phone: String = ""
    @State private var location: String = ""
    @State private var gender: String = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text(viewModel.language == "ne" ? "प्रोफाइल" : "Profile")) {
                    // Profile Image placeholder
                    HStack {
                        Spacer()
                        ZStack {
                            Circle()
                                .fill(Color(.systemGray4))
                                .frame(width: 80, height: 80)
                            
                            if let imageUrl = viewModel.profileImage, let url = URL(string: imageUrl) {
                                AsyncImage(url: url) { phase in
                                    switch phase {
                                    case .success(let image):
                                        image
                                            .resizable()
                                            .scaledToFill()
                                            .frame(width: 80, height: 80)
                                            .clipShape(Circle())
                                    default:
                                        Image(systemName: "person.fill")
                                            .font(.title)
                                            .foregroundColor(.gray)
                                    }
                                }
                            } else {
                                Image(systemName: "person.fill")
                                    .font(.title)
                                    .foregroundColor(.gray)
                            }
                        }
                        Spacer()
                    }
                }
                
                Section(header: Text(viewModel.language == "ne" ? "विवरण" : "Details")) {
                    TextField(viewModel.language == "ne" ? "नाम" : "Name", text: $name)
                    TextField(viewModel.language == "ne" ? "फोन" : "Phone", text: $phone)
                        .keyboardType(.phonePad)
                    TextField(viewModel.language == "ne" ? "ठेगाना" : "Location", text: $location)
                    
                    Picker(viewModel.language == "ne" ? "लिंग" : "Gender", selection: $gender) {
                        Text(viewModel.language == "ne" ? "छान्नुहोस्" : "Select").tag("")
                        Text(viewModel.language == "ne" ? "पुरुष" : "Male").tag("Male")
                        Text(viewModel.language == "ne" ? "महिला" : "Female").tag("Female")
                        Text(viewModel.language == "ne" ? "अन्य" : "Other").tag("Other")
                    }
                }
                
                Section {
                    Button(action: saveProfile) {
                        HStack {
                            Spacer()
                            Text(viewModel.language == "ne" ? "सेभ गर्नुहोस्" : "Save Profile")
                                .fontWeight(.semibold)
                            Spacer()
                        }
                    }
                    .foregroundColor(.accentColor)
                }
            }
            .navigationTitle(viewModel.language == "ne" ? "प्रोफाइल" : "Profile")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .onAppear {
                name = viewModel.profileName
                phone = viewModel.profilePhone
                location = viewModel.profileLocation
                gender = viewModel.profileGender
            }
        }
    }
    
    private func saveProfile() {
        viewModel.updateProfile(
            name: name,
            phone: phone,
            location: location,
            gender: gender,
            imageUri: viewModel.profileImage
        )
        dismiss()
    }
}

#Preview {
    ProfileView()
        .environmentObject(HomeViewModel())
}
