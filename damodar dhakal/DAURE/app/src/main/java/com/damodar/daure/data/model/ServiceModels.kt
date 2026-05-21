package com.damodar.daure.data.model

data class ServiceItem(
    val id: String,
    val name: String,
    val nameNe: String,
    val url: String,
    val iconUrl: String? = null,
    val iconChar: String? = null,
    val isTms: Boolean = false,
    val subtitle: String? = null
)

data class ServiceActivity(
    val serviceId: String,
    val timestamp: Long,
    val durationSeconds: Long
)

fun getLogoUrl(domain: String): String = "https://logo.clearbit.com/$domain"

val GovernmentServices = listOf(
    ServiceItem("official_portal", "Official Portal", "नेपाल पोर्टल", "https://nepal.gov.np", getLogoUrl("nepal.gov.np"), "🇳🇵"),
    ServiceItem("opmcm", "OPMCM", "प्रधानमन्त्री कार्यालय", "https://opmcm.gov.np", getLogoUrl("opmcm.gov.np"), "🏛️"),
    ServiceItem("moha", "MOHA", "गृह मन्त्रालय", "https://moha.gov.np", getLogoUrl("moha.gov.np"), "🏠"),
    ServiceItem("passport", "Passport", "राहदानी विभाग", "https://nepalpassport.gov.np", getLogoUrl("nepalpassport.gov.np"), "🛂"),
    ServiceItem("dotm_gov", "DOTM", "यातायात व्यवस्था", "https://dotm.gov.np", getLogoUrl("dotm.gov.np"), "🚗"),
    ServiceItem("ird_gov", "IRD (PAN)", "आन्तरिक राजस्व", "https://ird.gov.np", getLogoUrl("ird.gov.np"), "📑"),
    ServiceItem("nrb", "NRB", "नेपाल राष्ट्र बैंक", "https://nrb.org.np", getLogoUrl("nrb.org.np"), "🏦"),
    ServiceItem("nea_gov", "NEA", "विद्युत प्राधिकरण", "https://nea.org.np", getLogoUrl("nea.org.np"), "⚡"),
    ServiceItem("nagarik_app", "Nagarik App", "नागरिक एप", "https://web.nagarikapp.gov.np/", getLogoUrl("nagarikapp.gov.np"), "🇳🇵"),
    ServiceItem("psc", "PSC", "लोक सेवा आयोग", "https://psc.gov.np", getLogoUrl("psc.gov.np"), "🎓"),
    ServiceItem("immigration", "Immigration", "अध्यागमन विभाग", "https://immigration.gov.np", getLogoUrl("immigration.gov.np"), "✈️"),
    ServiceItem("pratipakchya", "Pratipakchya", "प्रतिपक्ष", "https://pratipakchya.com/", getLogoUrl("pratipakchya.com"), "📰")
)

val DocumentVerifyServices = listOf(
    ServiceItem("pan", "PAN", "प्यान", "https://ird.gov.np/pan-search/", getLogoUrl("ird.gov.np"), "📑"),
    ServiceItem("voter_id", "Voter ID", "मतदाता परिचयपत्र", "https://election.gov.np/np/page/voter-list-db", getLogoUrl("election.gov.np"), "🗳️"),
    ServiceItem("license", "License", "लाइसेन्स", "https://applydl.dotm.gov.np/licensecheck", getLogoUrl("dotm.gov.np"), "🪪"),
    ServiceItem("nea_bill", "NEA Bill", "नेपाल विद्युत प्राधिकरण बिल", "https://www.neabilling.com/viewonline/", getLogoUrl("nea.org.np"), "⚡"),
    ServiceItem("dofe", "DOFE", "वैदेशिक रोजगार विभाग", "https://foreignjob.dofe.gov.np/", getLogoUrl("dofe.gov.np"), "💼"),
    ServiceItem("nagita", "Nagarik App", "नागरिक एप", "https://web.nagarikapp.gov.np/citizen/login", getLogoUrl("nagarikapp.gov.np"), "🇳🇵")
)

val FinanceServices = listOf(
    ServiceItem("tms", "TMS", "टीएमएस", "https://tms01.nepsetms.com.np/login", getLogoUrl("nepalstock.com.np"), "🐂", isTms = true),
    ServiceItem("meroshare", "Mero Share", "मेरो शेयर", "https://meroshare.cdsc.com.np/", getLogoUrl("cdsc.com.np"), "🐂"),
    ServiceItem("sharesansar", "ShareSansar", "सेयर संसार", "https://www.sharesansar.com/", getLogoUrl("sharesansar.com"), "💰"),
    ServiceItem("nepsealpha", "NEPSE Alpha", "नेप्से अल्फा", "https://nepsealpha.com/", getLogoUrl("nepsealpha.com"), "📊"),
    ServiceItem("merolagani", "Mero Lagani", "मेरो लगानी", "https://merolagani.com/", getLogoUrl("merolagani.com"), "💰")
)

val AIServices = listOf(
    ServiceItem("chatgpt", "ChatGPT", "च्याटजीपीटी", "https://chatgpt.com/", getLogoUrl("openai.com"), "🤖", subtitle = "Chat & Logic"),
    ServiceItem("gemini", "Gemini", "जेमिनी", "https://gemini.google.com/", getLogoUrl("google.com"), "♊", subtitle = "Google AI"),
    ServiceItem("canva", "Canva AI", "क्यानभा एआई", "https://canva.com/", getLogoUrl("canva.com"), "🎨", subtitle = "Design"),
    ServiceItem("claude", "Claude", "क्लाउड", "https://claude.ai/", getLogoUrl("anthropic.com"), "✍️", subtitle = "Writing"),
    ServiceItem("perplexity", "Perplexity AI", "परप्लेक्सिटी एआई", "https://perplexity.ai/", getLogoUrl("perplexity.ai"), "🔍", subtitle = "Search"),
    ServiceItem("grammarly", "Grammarly", "ग्रामरली", "https://grammarly.com/", getLogoUrl("grammarly.com"), "📝", subtitle = "Grammar"),
    ServiceItem("deepseek", "DeepSeek", "दीपसीक", "https://deepseek.com/", getLogoUrl("deepseek.com"), "🧪", subtitle = "Code & Reasoning")
)

val RadioServices = listOf(
    ServiceItem("radio_nepal", "Radio Nepal", "रेडियो नेपाल", "https://radionepal.gov.np/", getLogoUrl("radionepal.gov.np"), "📻", subtitle = "National"),
    ServiceItem("kantipur", "Radio Kantipur", "रेडियो कान्तिपुर", "https://radiokantipur.com/", getLogoUrl("radiokantipur.com"), "📻", subtitle = "96.1 MHz"),
    ServiceItem("ujyaalo", "Ujyaalo 90", "उज्यालो ९०", "https://ujyaaloonline.com/", getLogoUrl("ujyaaloonline.com"), "📻", subtitle = "90.0 MHz"),
    ServiceItem("hits", "Hits FM", "हिट्स एफएम", "https://hitsfm.com.np/", getLogoUrl("hitsfm.com.np"), "📻", subtitle = "91.2 MHz"),
    ServiceItem("image", "Image FM", "इमेज एफएम", "https://imagefm.com.np/", getLogoUrl("imagefm.com.np"), "📻", subtitle = "97.9 MHz"),
    ServiceItem("audio", "Radio Audio", "रेडियो अडियो", "https://radioaudio.com.np/", getLogoUrl("radioaudio.com.np"), "📻", subtitle = "106.3 MHz"),
    ServiceItem("bbc_nepali", "BBC Nepali", "बीबीसी नेपाली", "https://bbc.com/nepali", getLogoUrl("bbc.co.uk"), "📻", subtitle = "News"),
    ServiceItem("sagarmatha", "Radio Sagarmatha", "रेडियो सगरमाथा", "https://radiosagarmatha.org.np/", getLogoUrl("radiosagarmatha.org.np"), "📻", subtitle = "102.4 MHz"),
    ServiceItem("nepaliko", "Nepaliko Radio", "नेपालीको रेडियो", "https://nepalikoradio.com.np/", getLogoUrl("nepalikoradio.com.np"), "📻", subtitle = "88.8 MHz"),
    ServiceItem("kalika", "Kalika FM", "कालिका एफएम", "https://kalikafm.com.np/", getLogoUrl("kalikafm.com.np"), "📻", subtitle = "95.2 MHz")
)

val NewsServices = listOf(
    ServiceItem("bbc", "BBC News", "बीबीसी न्यूज", "https://www.bbc.com/news", getLogoUrl("bbc.co.uk"), "📰"),
    ServiceItem("reuters", "Reuters", "रोयटर्स", "https://reuters.com/", getLogoUrl("reuters.com"), "📰"),
    ServiceItem("cnn", "CNN", "सीएनएन", "https://edition.cnn.com/", getLogoUrl("cnn.com"), "📰"),
    ServiceItem("al_jazeera", "Al Jazeera", "अल जजीरा", "https://aljazeera.com/", getLogoUrl("aljazeera.com"), "📰"),
    ServiceItem("the_guardian", "The Guardian", "द गार्डियन", "https://theguardian.com/", getLogoUrl("theguardian.com"), "📰"),
    ServiceItem("online_khabar", "Online Khabar", "अनलाइन खबर", "https://onlinekhabar.com/", getLogoUrl("onlinekhabar.com"), "📰"),
    ServiceItem("ratopati", "Ratopati", "रातोपाटी", "https://ratopati.com/", getLogoUrl("ratopati.com"), "📰"),
    ServiceItem("ekantipur", "Ekantipur", "कान्तिपुर", "https://ekantipur.com/", getLogoUrl("ekantipur.com"), "📰"),
    ServiceItem("setopati", "Setopati", "सेतोपाटी", "https://setopati.com/", getLogoUrl("setopati.com"), "📰"),
    ServiceItem("naya_patrika", "Naya Patrika", "नयाँ पत्रिका", "https://nayapatrikadaily.com/", getLogoUrl("nayapatrikadaily.com"), "📰"),
    ServiceItem("nepal_khabar", "Nepal Khabar", "नेपाल खबर", "https://nepalkhabar.com/", getLogoUrl("nepalkhabar.com"), "📰"),
    ServiceItem("ujyaalo_online", "Ujyaalo Online", "उज्यालो अनलाइन", "https://ujyaaloonline.com/", getLogoUrl("ujyaaloonline.com"), "📰"),
    ServiceItem("deshsanchar", "Deshsanchar", "देशसञ्चार", "https://deshsanchar.com/", getLogoUrl("deshsanchar.com"), "📰"),
    ServiceItem("himal_khabar", "Himal Khabar", "हिमाल खबर", "https://himalkhabar.com/", getLogoUrl("himalkhabar.com"), "📰"),
    ServiceItem("kharibot", "Kharibot", "खरीबोट", "https://kharibot.com/", getLogoUrl("kharibot.com"), "📰"),
    ServiceItem("the_kathmandu_post", "The Kathmandu Post", "द काठमाडौं पोस्ट", "https://kathmandupost.com/", getLogoUrl("kathmandupost.com"), "📰"),
    ServiceItem("the_himalayan_times", "The Himalayan Times", "द हिमालयन टाइम्स", "https://thehimalayantimes.com/", getLogoUrl("thehimalayantimes.com"), "📰"),
    ServiceItem("my_republica", "My Republica", "माई रिपब्लिका", "https://myrepublica.nagariknetwork.com/", getLogoUrl("nagariknetwork.com"), "📰"),
    ServiceItem("nepal_news", "Nepal News", "नेपाल न्यूज", "https://nepalnews.com/", getLogoUrl("nepalnews.com"), "📰"),
    ServiceItem("nepali_times", "Nepali Times", "नेपाली टाइम्स", "https://nepalitimes.com/", getLogoUrl("nepalitimes.com"), "📰")
)

val SocialMediaServices = listOf(
    ServiceItem("facebook", "Facebook", "फेसबुक", "https://facebook.com", getLogoUrl("facebook.com"), "🔵"),
    ServiceItem("x", "X", "एक्स", "https://x.com", getLogoUrl("x.com"), "🌑"),
    ServiceItem("youtube", "YouTube", "यूट्यूब", "https://youtube.com", getLogoUrl("youtube.com"), "🔴"),
    ServiceItem("instagram", "Instagram", "इन्स्टाग्राम", "https://instagram.com", getLogoUrl("instagram.com"), "📸"),
    ServiceItem("linkedin", "LinkedIn", "लिंक्डइन", "https://linkedin.com", getLogoUrl("linkedin.com"), "💼"),
    ServiceItem("tiktok", "TikTok", "टिकटक", "https://tiktok.com", getLogoUrl("tiktok.com"), "🎵"),
    ServiceItem("netflix", "Netflix", "नेटफ्लिक्स", "https://netflix.com", getLogoUrl("netflix.com"), "📺")
)

val GoogleServices = listOf(
    // AI & Innovation
    ServiceItem("google_gemini", "Gemini", "जेमिनी", "https://gemini.google.com/", getLogoUrl("gemini.google.com"), "♊", subtitle = "AI Assistant"),
    ServiceItem("google_notebooklm", "NotebookLM", "नोटबुक एलएम", "https://notebooklm.google.com/", getLogoUrl("notebooklm.google.com"), "📓", subtitle = "AI Research"),
    ServiceItem("google_labs", "Google Labs", "गुगल ल्याब्स", "https://labs.google", getLogoUrl("labs.google"), "🧪", subtitle = "AI Playground"),
    
    // Everyday Essentials
    ServiceItem("google_search", "Search", "खोज्नुहोस्", "https://google.com", getLogoUrl("google.com"), "🔍", subtitle = "Search Engine"),
    ServiceItem("google_gmail", "Gmail", "जीमेल", "https://mail.google.com/", getLogoUrl("mail.google.com"), "📧", subtitle = "Email"),
    ServiceItem("google_maps", "Maps", "नक्सा", "https://maps.google.com/", getLogoUrl("maps.google.com"), "📍", subtitle = "Navigation"),
    ServiceItem("google_youtube", "YouTube", "यूट्यूब", "https://youtube.com/", getLogoUrl("youtube.com"), "📹", subtitle = "Video"),
    ServiceItem("google_photos", "Photos", "फोटोहरू", "https://photos.google.com/", getLogoUrl("photos.google.com"), "🖼️", subtitle = "Storage"),
    
    // Productivity & Workspace
    ServiceItem("google_drive", "Drive", "ड्राइभ", "https://drive.google.com/", getLogoUrl("drive.google.com"), "📁", subtitle = "File Storage"),
    ServiceItem("google_docs", "Docs", "डक्स", "https://docs.google.com/", getLogoUrl("docs.google.com"), "📄", subtitle = "Editors"),
    ServiceItem("google_calendar", "Calendar", "क्यालेन्डर", "https://calendar.google.com/", getLogoUrl("calendar.google.com"), "📅", subtitle = "Schedule"),
    ServiceItem("google_meet", "Meet", "मिट", "https://meet.google.com/", getLogoUrl("meet.google.com"), "📹", subtitle = "Conferencing")
)

val TVChannelServices = listOf(
    // Top Nepali TV Channels
    ServiceItem("tv_ntv", "Nepal TV", "नेपाल टेलिभिजन", "https://ntv.org.np", getLogoUrl("ntv.org.np"), "📺", subtitle = "National"),
    ServiceItem("tv_kantipur", "Kantipur TV", "कान्तिपुर टेलिभिजन", "https://kantipurtv.com", getLogoUrl("kantipurtv.com"), "📺", subtitle = "HD News"),
    ServiceItem("tv_ap1", "AP1 HD", "एपी वान", "https://ap1hdtv.com", getLogoUrl("ap1hdtv.com"), "📺", subtitle = "Premium"),
    ServiceItem("tv_himalaya", "Himalaya TV", "हिमालय टेलिभिजन", "https://himalayatv.com", getLogoUrl("himalayatv.com"), "📺", subtitle = "Entertainment"),
    ServiceItem("tv_news24", "News 24", "न्यूज २४", "https://news24nepal.tv", getLogoUrl("news24nepal.tv"), "📺", subtitle = "Investigation"),
    ServiceItem("tv_image", "Image Channel", "इमेज च्यानल", "https://imagechannel.com.np", getLogoUrl("imagechannel.com.np"), "📺", subtitle = "Music & News"),
    ServiceItem("tv_galaxy", "Galaxy 4K", "ग्यालेक्सी ४के", "https://galaxy4k.com", getLogoUrl("galaxy4k.com"), "📺", subtitle = "4K Content"),
    
    // International Channels
    ServiceItem("tv_bbc_world", "BBC World", "बीबीसी वर्ल्ड", "https://www.bbc.com/news", getLogoUrl("bbc.com"), "🌏", subtitle = "UK"),
    ServiceItem("tv_cnn", "CNN", "सीएनएन", "https://edition.cnn.com", getLogoUrl("cnn.com"), "🌏", subtitle = "USA"),
    ServiceItem("tv_aljazeera", "Al Jazeera", "अल जजीरा", "https://www.aljazeera.com", getLogoUrl("aljazeera.com"), "🌏", subtitle = "Qatar"),
    ServiceItem("tv_dw", "DW News", "डीडब्ल्यू न्यूज", "https://www.dw.com", getLogoUrl("dw.com"), "🌏", subtitle = "Germany"),
    ServiceItem("tv_nhk", "NHK World", "एनएचके वर्ल्ड", "https://www3.nhk.or.jp/nhkworld/", getLogoUrl("nhk.or.jp"), "🌏", subtitle = "Japan"),
    ServiceItem("tv_france24", "France 24", "फ्रान्स २४", "https://www.france24.com", getLogoUrl("france24.com"), "🌏", subtitle = "France")
)

val ChildrenServices = listOf(
    // Nepali & Popular Regional
    ServiceItem("kids_ntv_plus", "NTV Plus", "नेपाल टेलिभिजन प्लस", "https://ntv.org.np", getLogoUrl("ntv.org.np"), "👶", subtitle = "Nepali Kids"),
    ServiceItem("kids_chuchu", "ChuChu TV", "चुचु टिभी", "https://chuchutv.com", getLogoUrl("chuchutv.com"), "👶", subtitle = "Rhymes"),
    ServiceItem("kids_nick_in", "Nick India", "निक इन्डिया", "https://www.nickindia.com", getLogoUrl("nickindia.com"), "👶", subtitle = "Cartoons"),
    ServiceItem("kids_disney_in", "Disney Kids", "डिस्ने किड्स", "https://www.disney.in", getLogoUrl("disney.in"), "👶", subtitle = "Doraemon"),
    
    // Babies & Toddlers
    ServiceItem("kids_babytv", "BabyTV", "बेबी टिभी", "https://www.babytv.com", getLogoUrl("babytv.com"), "🍼", subtitle = "Toddlers"),
    ServiceItem("kids_cbeebies", "CBeebies", "सीबिबिज", "https://global.cbeebies.com", getLogoUrl("cbeebies.com"), "🍼", subtitle = "Preschool"),
    ServiceItem("kids_disney_jr", "Disney Jr", "डिस्ने जुनियर", "https://www.disneynow.com", getLogoUrl("disney.com"), "🍼", subtitle = "Storytelling"),
    ServiceItem("kids_babyfirst", "BabyFirst", "बेबी फर्स्ट", "https://www.babyfirsttv.com", getLogoUrl("babyfirsttv.com"), "🍼", subtitle = "Milestones"),
    
    // Children (4-12)
    ServiceItem("kids_pbs", "PBS Kids", "पीबीएस किड्स", "https://pbskids.org", getLogoUrl("pbskids.org"), "🧒", subtitle = "Educational"),
    ServiceItem("kids_cn", "Cartoon Network", "कार्टुन नेटवर्क", "https://www.cartoonnetwork.com", getLogoUrl("cartoonnetwork.com"), "🧒", subtitle = "Animation"),
    ServiceItem("kids_discovery", "Discovery Kids", "डिस्कभरी किड्स", "https://www.discoverykids.com", getLogoUrl("discoverykids.com"), "🧒", subtitle = "Science"),
    ServiceItem("kids_nick", "Nickelodeon", "निकललोडियन", "https://www.nick.com", getLogoUrl("nick.com"), "🧒", subtitle = "Live Action")
)

val PortfolioServices = listOf(
    ServiceItem("sip_nabil", "Nabil Invest", "नबिल इन्भेस्ट", "https://sip.nabilinvest.com.np/", getLogoUrl("nabilinvest.com.np"), "🏦", subtitle = "Nabil Flexi Cap"),
    ServiceItem("sip_nic", "NIC ASIA Capital", "एनआईसी एशिया क्यापिटल", "https://nicasiacapital.com/sip-registration", getLogoUrl("nicasiacapital.com"), "🏦", subtitle = "Dynamic Debt Fund"),
    ServiceItem("sip_nimb", "NIMB Ace Capital", "एनआईएमबी एस क्यापिटल", "https://online.nimbacecapital.com/#/sipRegistration", getLogoUrl("nimbacecapital.com"), "🏦", subtitle = "Sahabajika Fund"),
    ServiceItem("sip_siddhartha", "Siddhartha Capital", "सिद्धार्थ क्यापिटल", "https://siddharthacapital.com/sip-registration/", getLogoUrl("siddharthacapital.com"), "🏦", subtitle = "Systematic Scheme"),
    ServiceItem("sip_sanima", "Sanima Capital", "सनिमा क्यापिटल", "https://sanimacapital.com/sip-registration", getLogoUrl("sanimacapital.com"), "🏦", subtitle = "Sanima Flexi Fund"),
    ServiceItem("sip_kumari", "Kumari Capital", "कुमारी क्यापिटल", "https://kumaricapital.com/sip-registration", getLogoUrl("kumaricapital.com"), "🏦", subtitle = "Sunaulo Lagani"),
    ServiceItem("sip_laxmi", "Laxmi Sunrise Capital", "लक्ष्मी सनराइज क्यापिटल", "https://lscapital.com.np/sip-registration", getLogoUrl("lscapital.com.np"), "🏦", subtitle = "Shubha Laxmi Kosh"),
    ServiceItem("sip_prabhu", "Prabhu Capital", "प्रभु क्यापिटल", "https://prabhucapital.com/sip-registration", getLogoUrl("prabhucapital.com"), "🏦", subtitle = "Systematic Scheme"),
    ServiceItem("sip_global", "Global IME Capital", "ग्लोबल आइएमई क्यापिटल", "https://globalimecapital.com/sip-registration", getLogoUrl("globalimecapital.com"), "🏦", subtitle = "Samunnati Fund"),
    ServiceItem("sip_citizens", "Citizens Capital", "सिटिजन्स क्यापिटल", "https://citizenscapital.com.np/sip-registration", getLogoUrl("citizenscapital.com.np"), "🏦", subtitle = "Sadabahar Yojana")
)

val GameServices = listOf(
    ServiceItem("game_poki", "Poki", "पोकी गेम्स", "https://poki.com", getLogoUrl("poki.com"), "🎮", subtitle = "Online Games"),
    ServiceItem("game_crazygames", "CrazyGames", "क्रेजी गेम्स", "https://crazygames.com", getLogoUrl("crazygames.com"), "🎮", subtitle = "Browser Games"),
    ServiceItem("game_y8", "Y8 Games", "Y8 गेम्स", "https://y8.com", getLogoUrl("y8.com"), "🎮", subtitle = "Classic Games"),
    ServiceItem("game_chess", "Chess.com", "चेस", "https://chess.com", getLogoUrl("chess.com"), "♟️", subtitle = "Play Chess"),
    ServiceItem("game_2048", "2048", "२०४८", "https://play2048.co", getLogoUrl("play2048.co"), "🔢", subtitle = "Puzzle"),
    ServiceItem("game_tetris", "Tetris", "टेट्रिस", "https://tetris.com/play-tetris", getLogoUrl("tetris.com"), "🧱", subtitle = "Classic Puzzle")
)


