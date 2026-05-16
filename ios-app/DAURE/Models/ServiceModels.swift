import Foundation

struct ServiceItem: Identifiable, Codable, Equatable {
    let id: String
    let name: String
    let nameNe: String
    let url: String
    let iconUrl: String?
    let iconChar: String?
    let isTms: Bool
    let subtitle: String?
    
    init(id: String, name: String, nameNe: String, url: String, iconUrl: String? = nil, iconChar: String? = nil, isTms: Bool = false, subtitle: String? = nil) {
        self.id = id
        self.name = name
        self.nameNe = nameNe
        self.url = url
        self.iconUrl = iconUrl
        self.iconChar = iconChar
        self.isTms = isTms
        self.subtitle = subtitle
    }
}

struct ServiceActivity: Identifiable, Codable {
    var id: String { "\(serviceId)_\(timestamp)" }
    let serviceId: String
    let timestamp: Double
    let durationSeconds: Int
}

func getLogoUrl(_ domain: String) -> String {
    return "https://logo.clearbit.com/\(domain)"
}

// MARK: - Government Services
let GovernmentServices: [ServiceItem] = [
    ServiceItem(id: "official_portal", name: "Official Portal", nameNe: "नेपाल पोर्टल", url: "https://nepal.gov.np", iconUrl: getLogoUrl("nepal.gov.np"), iconChar: "🇳🇵"),
    ServiceItem(id: "opmcm", name: "OPMCM", nameNe: "प्रधानमन्त्री कार्यालय", url: "https://opmcm.gov.np", iconUrl: getLogoUrl("opmcm.gov.np"), iconChar: "🏛️"),
    ServiceItem(id: "moha", name: "MOHA", nameNe: "गृह मन्त्रालय", url: "https://moha.gov.np", iconUrl: getLogoUrl("moha.gov.np"), iconChar: "🏠"),
    ServiceItem(id: "passport", name: "Passport", nameNe: "राहदानी विभाग", url: "https://nepalpassport.gov.np", iconUrl: getLogoUrl("nepalpassport.gov.np"), iconChar: "🛂"),
    ServiceItem(id: "dotm_gov", name: "DOTM", nameNe: "यातायात व्यवस्था", url: "https://dotm.gov.np", iconUrl: getLogoUrl("dotm.gov.np"), iconChar: "🚗"),
    ServiceItem(id: "ird_gov", name: "IRD (PAN)", nameNe: "आन्तरिक राजस्व", url: "https://ird.gov.np", iconUrl: getLogoUrl("ird.gov.np"), iconChar: "📑"),
    ServiceItem(id: "nrb", name: "NRB", nameNe: "नेपाल राष्ट्र बैंक", url: "https://nrb.org.np", iconUrl: getLogoUrl("nrb.org.np"), iconChar: "🏦"),
    ServiceItem(id: "nea_gov", name: "NEA", nameNe: "विद्युत प्राधिकरण", url: "https://nea.org.np", iconUrl: getLogoUrl("nea.org.np"), iconChar: "⚡"),
    ServiceItem(id: "nagarik_app", name: "Nagarik App", nameNe: "नागरिक एप", url: "https://web.nagarikapp.gov.np/", iconUrl: getLogoUrl("nagarikapp.gov.np"), iconChar: "🇳🇵"),
    ServiceItem(id: "psc", name: "PSC", nameNe: "लोक सेवा आयोग", url: "https://psc.gov.np", iconUrl: getLogoUrl("psc.gov.np"), iconChar: "🎓"),
    ServiceItem(id: "immigration", name: "Immigration", nameNe: "अध्यागमन विभाग", url: "https://immigration.gov.np", iconUrl: getLogoUrl("immigration.gov.np"), iconChar: "✈️"),
    ServiceItem(id: "pratipakchya", name: "Pratipakchya", nameNe: "प्रतिपक्ष", url: "https://pratipakchya.com/", iconUrl: getLogoUrl("pratipakchya.com"), iconChar: "📰")
]

// MARK: - Document Verify Services
let DocumentVerifyServices: [ServiceItem] = [
    ServiceItem(id: "pan", name: "PAN", nameNe: "प्यान", url: "https://ird.gov.np/pan-search/", iconUrl: getLogoUrl("ird.gov.np"), iconChar: "📑"),
    ServiceItem(id: "voter_id", name: "Voter ID", nameNe: "मतदाता परिचयपत्र", url: "https://election.gov.np/np/page/voter-list-db", iconUrl: getLogoUrl("election.gov.np"), iconChar: "🗳️"),
    ServiceItem(id: "license", name: "License", nameNe: "लाइसेन्स", url: "https://applydl.dotm.gov.np/licensecheck", iconUrl: getLogoUrl("dotm.gov.np"), iconChar: "🪪"),
    ServiceItem(id: "nea_bill", name: "NEA Bill", nameNe: "नेपाल विद्युत प्राधिकरण बिल", url: "https://www.neabilling.com/viewonline/", iconUrl: getLogoUrl("nea.org.np"), iconChar: "⚡"),
    ServiceItem(id: "dofe", name: "DOFE", nameNe: "वैदेशिक रोजगार विभाग", url: "https://foreignjob.dofe.gov.np/", iconUrl: getLogoUrl("dofe.gov.np"), iconChar: "💼"),
    ServiceItem(id: "nagita", name: "Nagarik App", nameNe: "नागरिक एप", url: "https://web.nagarikapp.gov.np/citizen/login", iconUrl: getLogoUrl("nagarikapp.gov.np"), iconChar: "🇳🇵")
]

// MARK: - Finance Services
let FinanceServices: [ServiceItem] = [
    ServiceItem(id: "tms", name: "TMS", nameNe: "टीएमएस", url: "https://tms01.nepsetms.com.np/login", iconUrl: getLogoUrl("nepalstock.com.np"), iconChar: "🐂", isTms: true),
    ServiceItem(id: "meroshare", name: "Mero Share", nameNe: "मेरो शेयर", url: "https://meroshare.cdsc.com.np/", iconUrl: getLogoUrl("cdsc.com.np"), iconChar: "🐂"),
    ServiceItem(id: "sharesansar", name: "ShareSansar", nameNe: "सेयर संसार", url: "https://www.sharesansar.com/", iconUrl: getLogoUrl("sharesansar.com"), iconChar: "💰"),
    ServiceItem(id: "nepsealpha", name: "NEPSE Alpha", nameNe: "नेप्से अल्फा", url: "https://nepsealpha.com/", iconUrl: getLogoUrl("nepsealpha.com"), iconChar: "📊"),
    ServiceItem(id: "merolagani", name: "Mero Lagani", nameNe: "मेरो लगानी", url: "https://merolagani.com/", iconUrl: getLogoUrl("merolagani.com"), iconChar: "💰")
]

// MARK: - AI Services
let AIServices: [ServiceItem] = [
    ServiceItem(id: "chatgpt", name: "ChatGPT", nameNe: "च्याटजीपीटी", url: "https://chatgpt.com/", iconUrl: getLogoUrl("openai.com"), iconChar: "🤖", subtitle: "Chat & Logic"),
    ServiceItem(id: "gemini", name: "Gemini", nameNe: "जेमिनी", url: "https://gemini.google.com/", iconUrl: getLogoUrl("google.com"), iconChar: "♊", subtitle: "Google AI"),
    ServiceItem(id: "canva", name: "Canva AI", nameNe: "क्यानभा एआई", url: "https://canva.com/", iconUrl: getLogoUrl("canva.com"), iconChar: "🎨", subtitle: "Design"),
    ServiceItem(id: "claude", name: "Claude", nameNe: "क्लाउड", url: "https://claude.ai/", iconUrl: getLogoUrl("anthropic.com"), iconChar: "✍️", subtitle: "Writing"),
    ServiceItem(id: "perplexity", name: "Perplexity AI", nameNe: "परप्लेक्सिटी एआई", url: "https://perplexity.ai/", iconUrl: getLogoUrl("perplexity.ai"), iconChar: "🔍", subtitle: "Search"),
    ServiceItem(id: "grammarly", name: "Grammarly", nameNe: "ग्रामरली", url: "https://grammarly.com/", iconUrl: getLogoUrl("grammarly.com"), iconChar: "📝", subtitle: "Grammar"),
    ServiceItem(id: "deepseek", name: "DeepSeek", nameNe: "दीपसीक", url: "https://deepseek.com/", iconUrl: getLogoUrl("deepseek.com"), iconChar: "🧪", subtitle: "Code & Reasoning")
]

// MARK: - Radio Services
let RadioServices: [ServiceItem] = [
    ServiceItem(id: "radio_nepal", name: "Radio Nepal", nameNe: "रेडियो नेपाल", url: "https://radionepal.gov.np/", iconUrl: getLogoUrl("radionepal.gov.np"), iconChar: "📻", subtitle: "National"),
    ServiceItem(id: "kantipur", name: "Radio Kantipur", nameNe: "रेडियो कान्तिपुर", url: "https://radiokantipur.com/", iconUrl: getLogoUrl("radiokantipur.com"), iconChar: "📻", subtitle: "96.1 MHz"),
    ServiceItem(id: "ujyaalo", name: "Ujyaalo 90", nameNe: "उज्यालो ९०", url: "https://ujyaaloonline.com/", iconUrl: getLogoUrl("ujyaaloonline.com"), iconChar: "📻", subtitle: "90.0 MHz"),
    ServiceItem(id: "hits", name: "Hits FM", nameNe: "हिट्स एफएम", url: "https://hitsfm.com.np/", iconUrl: getLogoUrl("hitsfm.com.np"), iconChar: "📻", subtitle: "91.2 MHz"),
    ServiceItem(id: "image", name: "Image FM", nameNe: "इमेज एफएम", url: "https://imagefm.com.np/", iconUrl: getLogoUrl("imagefm.com.np"), iconChar: "📻", subtitle: "97.9 MHz"),
    ServiceItem(id: "audio", name: "Radio Audio", nameNe: "रेडियो अडियो", url: "https://radioaudio.com.np/", iconUrl: getLogoUrl("radioaudio.com.np"), iconChar: "📻", subtitle: "106.3 MHz"),
    ServiceItem(id: "bbc_nepali", name: "BBC Nepali", nameNe: "बीबीसी नेपाली", url: "https://bbc.com/nepali", iconUrl: getLogoUrl("bbc.co.uk"), iconChar: "📻", subtitle: "News"),
    ServiceItem(id: "sagarmatha", name: "Radio Sagarmatha", nameNe: "रेडियो सगरमाथा", url: "https://radiosagarmatha.org.np/", iconUrl: getLogoUrl("radiosagarmatha.org.np"), iconChar: "📻", subtitle: "102.4 MHz"),
    ServiceItem(id: "nepaliko", name: "Nepaliko Radio", nameNe: "नेपालीको रेडियो", url: "https://nepalikoradio.com.np/", iconUrl: getLogoUrl("nepalikoradio.com.np"), iconChar: "📻", subtitle: "88.8 MHz"),
    ServiceItem(id: "kalika", name: "Kalika FM", nameNe: "कालिका एफएम", url: "https://kalikafm.com.np/", iconUrl: getLogoUrl("kalikafm.com.np"), iconChar: "📻", subtitle: "95.2 MHz")
]

// MARK: - News Services
let NewsServices: [ServiceItem] = [
    ServiceItem(id: "bbc", name: "BBC News", nameNe: "बीबीसी न्यूज", url: "https://www.bbc.com/news", iconUrl: getLogoUrl("bbc.co.uk"), iconChar: "📰"),
    ServiceItem(id: "reuters", name: "Reuters", nameNe: "रोयटर्स", url: "https://reuters.com/", iconUrl: getLogoUrl("reuters.com"), iconChar: "📰"),
    ServiceItem(id: "cnn", name: "CNN", nameNe: "सीएनएन", url: "https://edition.cnn.com/", iconUrl: getLogoUrl("cnn.com"), iconChar: "📰"),
    ServiceItem(id: "al_jazeera", name: "Al Jazeera", nameNe: "अल जजीरा", url: "https://aljazeera.com/", iconUrl: getLogoUrl("aljazeera.com"), iconChar: "📰"),
    ServiceItem(id: "the_guardian", name: "The Guardian", nameNe: "द गार्डियन", url: "https://theguardian.com/", iconUrl: getLogoUrl("theguardian.com"), iconChar: "📰"),
    ServiceItem(id: "online_khabar", name: "Online Khabar", nameNe: "अनलाइन खबर", url: "https://onlinekhabar.com/", iconUrl: getLogoUrl("onlinekhabar.com"), iconChar: "📰"),
    ServiceItem(id: "ratopati", name: "Ratopati", nameNe: "रातोपाटी", url: "https://ratopati.com/", iconUrl: getLogoUrl("ratopati.com"), iconChar: "📰"),
    ServiceItem(id: "ekantipur", name: "Ekantipur", nameNe: "कान्तिपुर", url: "https://ekantipur.com/", iconUrl: getLogoUrl("ekantipur.com"), iconChar: "📰"),
    ServiceItem(id: "setopati", name: "Setopati", nameNe: "सेतोपाटी", url: "https://setopati.com/", iconUrl: getLogoUrl("setopati.com"), iconChar: "📰"),
    ServiceItem(id: "naya_patrika", name: "Naya Patrika", nameNe: "नयाँ पत्रिका", url: "https://nayapatrikadaily.com/", iconUrl: getLogoUrl("nayapatrikadaily.com"), iconChar: "📰"),
    ServiceItem(id: "nepal_khabar", name: "Nepal Khabar", nameNe: "नेपाल खबर", url: "https://nepalkhabar.com/", iconUrl: getLogoUrl("nepalkhabar.com"), iconChar: "📰"),
    ServiceItem(id: "ujyaalo_online", name: "Ujyaalo Online", nameNe: "उज्यालो अनलाइन", url: "https://ujyaaloonline.com/", iconUrl: getLogoUrl("ujyaaloonline.com"), iconChar: "📰"),
    ServiceItem(id: "the_kathmandu_post", name: "The Kathmandu Post", nameNe: "द काठमाडौं पोस्ट", url: "https://kathmandupost.com/", iconUrl: getLogoUrl("kathmandupost.com"), iconChar: "📰"),
    ServiceItem(id: "the_himalayan_times", name: "The Himalayan Times", nameNe: "द हिमालयन टाइम्स", url: "https://thehimalayantimes.com/", iconUrl: getLogoUrl("thehimalayantimes.com"), iconChar: "📰"),
    ServiceItem(id: "my_republica", name: "My Republica", nameNe: "माई रिपब्लिका", url: "https://myrepublica.nagariknetwork.com/", iconUrl: getLogoUrl("nagariknetwork.com"), iconChar: "📰"),
    ServiceItem(id: "nepali_times", name: "Nepali Times", nameNe: "नेपाली टाइम्स", url: "https://nepalitimes.com/", iconUrl: getLogoUrl("nepalitimes.com"), iconChar: "📰")
]

// MARK: - Social Media Services
let SocialMediaServices: [ServiceItem] = [
    ServiceItem(id: "facebook", name: "Facebook", nameNe: "फेसबुक", url: "https://facebook.com", iconUrl: getLogoUrl("facebook.com"), iconChar: "🔵"),
    ServiceItem(id: "x", name: "X", nameNe: "एक्स", url: "https://x.com", iconUrl: getLogoUrl("x.com"), iconChar: "🌑"),
    ServiceItem(id: "youtube", name: "YouTube", nameNe: "यूट्यूब", url: "https://youtube.com", iconUrl: getLogoUrl("youtube.com"), iconChar: "🔴"),
    ServiceItem(id: "instagram", name: "Instagram", nameNe: "इन्स्टाग्राम", url: "https://instagram.com", iconUrl: getLogoUrl("instagram.com"), iconChar: "📸"),
    ServiceItem(id: "linkedin", name: "LinkedIn", nameNe: "लिंक्डइन", url: "https://linkedin.com", iconUrl: getLogoUrl("linkedin.com"), iconChar: "💼"),
    ServiceItem(id: "tiktok", name: "TikTok", nameNe: "टिकटक", url: "https://tiktok.com", iconUrl: getLogoUrl("tiktok.com"), iconChar: "🎵"),
    ServiceItem(id: "netflix", name: "Netflix", nameNe: "नेटफ्लिक्स", url: "https://netflix.com", iconUrl: getLogoUrl("netflix.com"), iconChar: "📺")
]

// MARK: - Google Services
let GoogleServices: [ServiceItem] = [
    ServiceItem(id: "google_gemini", name: "Gemini", nameNe: "जेमिनी", url: "https://gemini.google.com/", iconUrl: getLogoUrl("gemini.google.com"), iconChar: "♊", subtitle: "AI Assistant"),
    ServiceItem(id: "google_notebooklm", name: "NotebookLM", nameNe: "नोटबुक एलएम", url: "https://notebooklm.google.com/", iconUrl: getLogoUrl("notebooklm.google.com"), iconChar: "📓", subtitle: "AI Research"),
    ServiceItem(id: "google_labs", name: "Google Labs", nameNe: "गुगल ल्याब्स", url: "https://labs.google", iconUrl: getLogoUrl("labs.google"), iconChar: "🧪", subtitle: "AI Playground"),
    ServiceItem(id: "google_search", name: "Search", nameNe: "खोज्नुहोस्", url: "https://google.com", iconUrl: getLogoUrl("google.com"), iconChar: "🔍", subtitle: "Search Engine"),
    ServiceItem(id: "google_gmail", name: "Gmail", nameNe: "जीमेल", url: "https://mail.google.com/", iconUrl: getLogoUrl("mail.google.com"), iconChar: "📧", subtitle: "Email"),
    ServiceItem(id: "google_maps", name: "Maps", nameNe: "नक्सा", url: "https://maps.google.com/", iconUrl: getLogoUrl("maps.google.com"), iconChar: "📍", subtitle: "Navigation"),
    ServiceItem(id: "google_youtube", name: "YouTube", nameNe: "यूट्यूब", url: "https://youtube.com/", iconUrl: getLogoUrl("youtube.com"), iconChar: "📹", subtitle: "Video"),
    ServiceItem(id: "google_photos", name: "Photos", nameNe: "फोटोहरू", url: "https://photos.google.com/", iconUrl: getLogoUrl("photos.google.com"), iconChar: "🖼️", subtitle: "Storage"),
    ServiceItem(id: "google_drive", name: "Drive", nameNe: "ड्राइभ", url: "https://drive.google.com/", iconUrl: getLogoUrl("drive.google.com"), iconChar: "📁", subtitle: "File Storage"),
    ServiceItem(id: "google_docs", name: "Docs", nameNe: "डक्स", url: "https://docs.google.com/", iconUrl: getLogoUrl("docs.google.com"), iconChar: "📄", subtitle: "Editors"),
    ServiceItem(id: "google_calendar", name: "Calendar", nameNe: "क्यालेन्डर", url: "https://calendar.google.com/", iconUrl: getLogoUrl("calendar.google.com"), iconChar: "📅", subtitle: "Schedule"),
    ServiceItem(id: "google_meet", name: "Meet", nameNe: "मिट", url: "https://meet.google.com/", iconUrl: getLogoUrl("meet.google.com"), iconChar: "📹", subtitle: "Conferencing")
]

// MARK: - TV Channel Services
let TVChannelServices: [ServiceItem] = [
    ServiceItem(id: "tv_ntv", name: "Nepal TV", nameNe: "नेपाल टेलिभिजन", url: "https://ntv.org.np", iconUrl: getLogoUrl("ntv.org.np"), iconChar: "📺", subtitle: "National"),
    ServiceItem(id: "tv_kantipur", name: "Kantipur TV", nameNe: "कान्तिपुर टेलिभिजन", url: "https://kantipurtv.com", iconUrl: getLogoUrl("kantipurtv.com"), iconChar: "📺", subtitle: "HD News"),
    ServiceItem(id: "tv_ap1", name: "AP1 HD", nameNe: "एपी वान", url: "https://ap1hdtv.com", iconUrl: getLogoUrl("ap1hdtv.com"), iconChar: "📺", subtitle: "Premium"),
    ServiceItem(id: "tv_himalaya", name: "Himalaya TV", nameNe: "हिमालय टेलिभिजन", url: "https://himalayatv.com", iconUrl: getLogoUrl("himalayatv.com"), iconChar: "📺", subtitle: "Entertainment"),
    ServiceItem(id: "tv_news24", name: "News 24", nameNe: "न्यूज २४", url: "https://news24nepal.tv", iconUrl: getLogoUrl("news24nepal.tv"), iconChar: "📺", subtitle: "Investigation"),
    ServiceItem(id: "tv_image", name: "Image Channel", nameNe: "इमेज च्यानल", url: "https://imagechannel.com.np", iconUrl: getLogoUrl("imagechannel.com.np"), iconChar: "📺", subtitle: "Music & News"),
    ServiceItem(id: "tv_galaxy", name: "Galaxy 4K", nameNe: "ग्यालेक्सी ४के", url: "https://galaxy4k.com", iconUrl: getLogoUrl("galaxy4k.com"), iconChar: "📺", subtitle: "4K Content"),
    ServiceItem(id: "tv_bbc_world", name: "BBC World", nameNe: "बीबीसी वर्ल्ड", url: "https://www.bbc.com/news", iconUrl: getLogoUrl("bbc.com"), iconChar: "🌏", subtitle: "UK"),
    ServiceItem(id: "tv_cnn", name: "CNN", nameNe: "सीएनएन", url: "https://edition.cnn.com", iconUrl: getLogoUrl("cnn.com"), iconChar: "🌏", subtitle: "USA"),
    ServiceItem(id: "tv_aljazeera", name: "Al Jazeera", nameNe: "अल जजीरा", url: "https://www.aljazeera.com", iconUrl: getLogoUrl("aljazeera.com"), iconChar: "🌏", subtitle: "Qatar"),
    ServiceItem(id: "tv_dw", name: "DW News", nameNe: "डीडब्ल्यू न्यूज", url: "https://www.dw.com", iconUrl: getLogoUrl("dw.com"), iconChar: "🌏", subtitle: "Germany"),
    ServiceItem(id: "tv_nhk", name: "NHK World", nameNe: "एनएचके वर्ल्ड", url: "https://www3.nhk.or.jp/nhkworld/", iconUrl: getLogoUrl("nhk.or.jp"), iconChar: "🌏", subtitle: "Japan"),
    ServiceItem(id: "tv_france24", name: "France 24", nameNe: "फ्रान्स २४", url: "https://www.france24.com", iconUrl: getLogoUrl("france24.com"), iconChar: "🌏", subtitle: "France")
]

// MARK: - Children Services
let ChildrenServices: [ServiceItem] = [
    ServiceItem(id: "kids_ntv_plus", name: "NTV Plus", nameNe: "नेपाल टेलिभिजन प्लस", url: "https://ntv.org.np", iconUrl: getLogoUrl("ntv.org.np"), iconChar: "👶", subtitle: "Nepali Kids"),
    ServiceItem(id: "kids_chuchu", name: "ChuChu TV", nameNe: "चुचु टिभी", url: "https://chuchutv.com", iconUrl: getLogoUrl("chuchutv.com"), iconChar: "👶", subtitle: "Rhymes"),
    ServiceItem(id: "kids_nick_in", name: "Nick India", nameNe: "निक इन्डिया", url: "https://www.nickindia.com", iconUrl: getLogoUrl("nickindia.com"), iconChar: "👶", subtitle: "Cartoons"),
    ServiceItem(id: "kids_disney_in", name: "Disney Kids", nameNe: "डिस्ने किड्स", url: "https://www.disney.in", iconUrl: getLogoUrl("disney.in"), iconChar: "👶", subtitle: "Doraemon"),
    ServiceItem(id: "kids_babytv", name: "BabyTV", nameNe: "बेबी टिभी", url: "https://www.babytv.com", iconUrl: getLogoUrl("babytv.com"), iconChar: "🍼", subtitle: "Toddlers"),
    ServiceItem(id: "kids_cbeebies", name: "CBeebies", nameNe: "सीबिबिज", url: "https://global.cbeebies.com", iconUrl: getLogoUrl("cbeebies.com"), iconChar: "🍼", subtitle: "Preschool"),
    ServiceItem(id: "kids_disney_jr", name: "Disney Jr", nameNe: "डिस्ने जुनियर", url: "https://www.disneynow.com", iconUrl: getLogoUrl("disney.com"), iconChar: "🍼", subtitle: "Storytelling"),
    ServiceItem(id: "kids_pbs", name: "PBS Kids", nameNe: "पीबीएस किड्स", url: "https://pbskids.org", iconUrl: getLogoUrl("pbskids.org"), iconChar: "🧒", subtitle: "Educational"),
    ServiceItem(id: "kids_cn", name: "Cartoon Network", nameNe: "कार्टुन नेटवर्क", url: "https://www.cartoonnetwork.com", iconUrl: getLogoUrl("cartoonnetwork.com"), iconChar: "🧒", subtitle: "Animation"),
    ServiceItem(id: "kids_discovery", name: "Discovery Kids", nameNe: "डिस्कभरी किड्स", url: "https://www.discoverykids.com", iconUrl: getLogoUrl("discoverykids.com"), iconChar: "🧒", subtitle: "Science"),
    ServiceItem(id: "kids_nick", name: "Nickelodeon", nameNe: "निकललोडियन", url: "https://www.nick.com", iconUrl: getLogoUrl("nick.com"), iconChar: "🧒", subtitle: "Live Action")
]

// MARK: - Portfolio Services
let PortfolioServices: [ServiceItem] = [
    ServiceItem(id: "sip_nabil", name: "Nabil Invest", nameNe: "नबिल इन्भेस्ट", url: "https://sip.nabilinvest.com.np/", iconUrl: getLogoUrl("nabilinvest.com.np"), iconChar: "🏦", subtitle: "Nabil Flexi Cap"),
    ServiceItem(id: "sip_nic", name: "NIC ASIA Capital", nameNe: "एनआईसी एशिया क्यापिटल", url: "https://nicasiacapital.com/sip-registration", iconUrl: getLogoUrl("nicasiacapital.com"), iconChar: "🏦", subtitle: "Dynamic Debt Fund"),
    ServiceItem(id: "sip_nimb", name: "NIMB Ace Capital", nameNe: "एनआईएमबी एस क्यापिटल", url: "https://online.nimbacecapital.com/#/sipRegistration", iconUrl: getLogoUrl("nimbacecapital.com"), iconChar: "🏦", subtitle: "Sahabajika Fund"),
    ServiceItem(id: "sip_siddhartha", name: "Siddhartha Capital", nameNe: "सिद्धार्थ क्यापिटल", url: "https://siddharthacapital.com/sip-registration/", iconUrl: getLogoUrl("siddharthacapital.com"), iconChar: "🏦", subtitle: "Systematic Scheme"),
    ServiceItem(id: "sip_sanima", name: "Sanima Capital", nameNe: "सनिमा क्यापिटल", url: "https://sanimacapital.com/sip-registration", iconUrl: getLogoUrl("sanimacapital.com"), iconChar: "🏦", subtitle: "Sanima Flexi Fund"),
    ServiceItem(id: "sip_kumari", name: "Kumari Capital", nameNe: "कुमारी क्यापिटल", url: "https://kumaricapital.com/sip-registration", iconUrl: getLogoUrl("kumaricapital.com"), iconChar: "🏦", subtitle: "Sunaulo Lagani"),
    ServiceItem(id: "sip_laxmi", name: "Laxmi Sunrise Capital", nameNe: "लक्ष्मी सनराइज क्यापिटल", url: "https://lscapital.com.np/sip-registration", iconUrl: getLogoUrl("lscapital.com.np"), iconChar: "🏦", subtitle: "Shubha Laxmi Kosh"),
    ServiceItem(id: "sip_prabhu", name: "Prabhu Capital", nameNe: "प्रभु क्यापिटल", url: "https://prabhucapital.com/sip-registration", iconUrl: getLogoUrl("prabhucapital.com"), iconChar: "🏦", subtitle: "Systematic Scheme"),
    ServiceItem(id: "sip_global", name: "Global IME Capital", nameNe: "ग्लोबल आइएमई क्यापिटल", url: "https://globalimecapital.com/sip-registration", iconUrl: getLogoUrl("globalimecapital.com"), iconChar: "🏦", subtitle: "Samunnati Fund"),
    ServiceItem(id: "sip_citizens", name: "Citizens Capital", nameNe: "सिटिजन्स क्यापिटल", url: "https://citizenscapital.com.np/sip-registration", iconUrl: getLogoUrl("citizenscapital.com.np"), iconChar: "🏦", subtitle: "Sadabahar Yojana")
]

// MARK: - Game Services
let GameServices: [ServiceItem] = [
    ServiceItem(id: "game_poki", name: "Poki", nameNe: "पोकी गेम्स", url: "https://poki.com", iconUrl: getLogoUrl("poki.com"), iconChar: "🎮", subtitle: "Online Games"),
    ServiceItem(id: "game_crazygames", name: "CrazyGames", nameNe: "क्रेजी गेम्स", url: "https://crazygames.com", iconUrl: getLogoUrl("crazygames.com"), iconChar: "🎮", subtitle: "Browser Games"),
    ServiceItem(id: "game_y8", name: "Y8 Games", nameNe: "Y8 गेम्स", url: "https://y8.com", iconUrl: getLogoUrl("y8.com"), iconChar: "🎮", subtitle: "Classic Games"),
    ServiceItem(id: "game_chess", name: "Chess.com", nameNe: "चेस", url: "https://chess.com", iconUrl: getLogoUrl("chess.com"), iconChar: "♟️", subtitle: "Play Chess"),
    ServiceItem(id: "game_2048", name: "2048", nameNe: "२०४८", url: "https://play2048.co", iconUrl: getLogoUrl("play2048.co"), iconChar: "🔢", subtitle: "Puzzle"),
    ServiceItem(id: "game_tetris", name: "Tetris", nameNe: "टेट्रिस", url: "https://tetris.com/play-tetris", iconUrl: getLogoUrl("tetris.com"), iconChar: "🧱", subtitle: "Classic Puzzle")
]

// MARK: - All Services
let AllServices: [ServiceItem] = GovernmentServices + DocumentVerifyServices + FinanceServices + AIServices + RadioServices + NewsServices + SocialMediaServices + GoogleServices + TVChannelServices + ChildrenServices + PortfolioServices + GameServices
