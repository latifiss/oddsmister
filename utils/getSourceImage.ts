export function getSourceImage(sourceName: string): string {
  const map: Record<string, string> = {
    '3news': '3news.png',
    '9to5mac': '9to5mac.png',
    '90mins': '90mins.png',
    'Accra mail': 'Accra_mail.png',
    'Adom online': 'adomonline.png',
    'Africa.com': 'africa.png',
    'Africa Intelligence': 'africaintelligence.png',
    'African Examiner': 'african_examiner.png',
    'African Insider': 'african_insider.png',
    'African Mirror': 'african_mirror.png',
    'African Entertainment': 'africanentertainment.png',
    'Africanews': 'africanews.png',
    'AJ Plus': 'aj_plus.png',
    'Aljazeera': 'aljazeera.png',
    'Ameyaw Debrah': 'ameyaw_debrah.png',
    'Android Authority': 'android_authority.png',
    'Android Central': 'android_central.png',
    'Apple': 'apple.png',
    'Apple Insider': 'apple_insider.png',
    'Ars Technica': 'ars_technica.png',
    'Arseblog': 'arseblog.png',
    'AS': 'as.png',
    'Asaase Radio': 'asaase_radio.png',
    'Barca Blaugranes': 'barcablaugranes.png',
    'Barca Universal': 'barcauniversal.png',
    'BBC': 'bbc.png',
    'BBC Sport': 'bbc-sport.png',
    'BF&T': 'bftonline.png',
    'Bundesliga Fan': 'bundesligafan.png',
    'Business Ghana': 'business_ghana.png',
    'Caught Offside': 'caught_offside.png',
    'CBS Sports': 'cbssports.png',
    'CGTN': 'cgtn.png',
    'Channels': 'channels.png',
    'China Daily': 'china_daily.png',
    'Citinewsroom': 'citinewsroom.png',
    'Citizen': 'citizen_za.png',
    'Cnet': 'cnet.png',
    'Construct Africa': 'constructafrica.png',
    'Converseer': 'converseer.png',
    'Cult Of calcio': 'cult_of_calcio.png',
    'Daily Express': 'daily_express.png',
    'Daily Mail': 'dailymail.png',
    'Daily Maverick': 'dailymaverick.png',
    'Daily Nigerian': 'dailynigerian.png',
    'Daily Post': 'dailypost.png',
    'Daily Record': 'dailyrecord.png',
    'DW': 'dw.png',
    'Economist': 'economist.png',
    'Empire Of The Kop': 'empireofthekop.png',
    'Engadget': 'engadget.png',
    'ESPN': 'espn_com.png',
    'Eye Football': 'eyefootball.png',
    'Football Espana': 'football_espana.png',
    'Football Italia': 'football_italia.png',
    'France24': 'france24.png',
    'French Football Weekly': 'frenchfootballweekly.png',
    'Financial Times': 'ft.png',
    'Get Football News Germany': 'getfootballnewsgermany.png',
    'Ghana Celebrities': 'ghana_celebrities.png',
    'Ghanaian Chronicles': 'ghanaian_chronicle.png',
    'Ghanaian Times': 'ghanaian_times.png',
    'Ghana Soccernet': 'ghanasoccernet.png',
    'Ghanaweb': 'ghanaweb.png',
    'Glamour': 'glamour.png',
    'Ghana News Agency': 'gna_ghana.png',
    'GraphicOnline': 'graphic.png',
    'GSM Arena': 'gsm_arena.png',
    'Huffpost': 'huffpost.png',
    'Imore': 'imore.png',
    'Independent Nigeria': 'independent_nigeria.png',
    'Independent': 'independent_uk.png',
    'IOL': 'iol_za.png',
    'IT News Africa': 'itnewsafrica.png',
    'Juve FC': 'juvefc.png',
    'LA Times': 'la_times.png',
    'Laliga Blog': 'laliga_blog.png',
    'Laliga Expert': 'laliga_expert.png',
    'Leadership Nigeria': 'leadership_nigeria.png',
    'Life Hacker': 'lifehacker.png',
    'Mail & Guardian': 'mail_and_guardian.png',
    'Man United': 'man_utd.png',
    'Managing Madrid': 'managing_madrid.png',
    'Manchester Evening News': 'manchester_evening.png',
    'Marca': 'marca.png',
    'Mashable': 'mashable.png',
    'Metro': 'metro.png',
    'Middle East Eye': 'middle_east_eye.png',
    'Middle East Monitor': 'middle_east_monitor.png',
    'Modern Ghana': 'modern_ghana.png',
    'Mybroadband': 'mybroadband.png',
    'MyJoyOnline': 'myjoyonline.png',
    'My London': 'mylondon.png',
    'NBC News': 'nbcnews.png',
    'News24': 'news24.png',
    'News Ghana': 'newsghana.png',
    'Nigerian Eye': 'nigerianeye.png',
    'NPR': 'npr.png',
    'NUFC Blog': 'nufcblog.png',
    'NYTimes': 'nytimes.png',
    'PC World': 'pc_world.png',
    'Peace Fm Online': 'peacefmonline.png',
    'PM News Nigeria': 'pmnewsnigeria.png',
    'Premium Times Nigeria': 'premium_times_nigeria.png',
    'RC Celta': 'rccelta.png',
    'Real Madrid News': 'realmadrid_news.png',
    'Ripples Nigeria': 'ripples_nigeria.png',
    'Roma Press': 'roma_press.png',
    'RT': 'rt.png',
    'Reuters': 'reuters.png',
    'Sahara Football': 'sahara_football.png',
    'Samsung': 'samsung.png',
    'SBI Soccer': 'sbisoccer.png',
    'SCMP': 'scmp.png',
    'Six Sports': 'six_sports.png',
    'Sky_sports': 'sky_sports.png',
    'Sky News': 'skynews.png',
    'Sowetan Live': 'sowetanlive.png',
    'Sport': 'sport.png',
    'Sports Mole': 'sportsmole.png',
    'Standard': 'standard.png',
    'Talk Chelsea': 'talk_chelsea.png',
    'Talksport': 'talksport.png',
    'Tech Central': 'tech_central.png',
    'Tech Radar': 'tech_radar.png',
    'Techcabal': 'techcabal.png',
    'Techcrunch': 'techcrunch.png',
    'The Next Web': 'the_next_web.png',
    'The Bureau Nigeria': 'thebureau_nigeria.png',
    'The Guardian': 'theguardian.png',
    'The Herald Ghana': 'theheraldghana.png',
    'The Kop Times': 'thekoptimes.png',
    'The Mag': 'themag.png',
    'The NFF': 'thenff.png',
    'The Scotsman': 'thescotsman.png',
    'The South afrcian': 'thesouthafrican.png',
    'The Verge': 'theverge.png',
    'This is Anfield': 'thisisanfield.png',
    'Time': 'time.png',
    'Toffee Web': 'toffeeweb.png',
    'Tori Nigeria': 'tori_nigeria.png',
    'Vanguard': 'vanguard.png',
    'WSJ': 'wall_stree.png',
    'Windoes Central': 'windows_central.png',
    'Xinhua': 'xinhua.png',
    'Yahoo': 'yahoo.png',
    'Yawa': 'yawa.png',
    'Yen': 'yen.png',
    'Fox Sports': 'fox-sports.png',
    'GiveMeSport': 'givemesport.png',
    'Africa Top Sports': 'africa-top-sports.png',
    'African Sports News': 'african-sports-news.png',
    'Pan African Football': 'pan-african-football.png',
    'Afro Foot': 'afro-foot.png',
    'KichGh': 'kickgh.png',
    'Supersport': 'supersport.png',
    'Caf Online': 'caf-online.png',
    'Premier League': 'premier-league.png',
    'Laliga': 'laliga.png',
    'Bundesliga': 'bundesliga.png',
    'SerieA': 'serie-a.png',
    'Ligue1': 'ligue-1.png',
    'Fifa.com': 'fifa-com.png',
    'Abidjan.net': 'abidjan.net.png',
    'GhanaScore': 'ghana-score.png',
  };

  if (!sourceName) return '/assets/sources/default.png';

  const normalizedInput = sourceName.trim().toLowerCase();
  
  const normalizedMap: Record<string, string> = {};
  for (const [key, filename] of Object.entries(map)) {
    normalizedMap[key.toLowerCase()] = filename;
  }

  if (normalizedMap[normalizedInput]) {
    return `/assets/sources/${normalizedMap[normalizedInput]}`;
  }

  for (const [key, filename] of Object.entries(normalizedMap)) {
    if (normalizedInput.includes(key)) {
      return `/assets/sources/${filename}`;
    }
  }

  const inputWords = normalizedInput.split(/\s+/);
  for (const [key, filename] of Object.entries(normalizedMap)) {
    const keyWords = key.split(/\s+/);
    for (const inputWord of inputWords) {
      for (const keyWord of keyWords) {
        if (inputWord === keyWord || keyWord.includes(inputWord) || inputWord.includes(keyWord)) {
          return `/assets/sources/${filename}`;
        }
      }
    }
  }

  for (const [key, filename] of Object.entries(normalizedMap)) {
    if (key.includes(normalizedInput) || normalizedInput.includes(key)) {
      return `/assets/sources/${filename}`;
    }
  }

  return '/assets/sources/default.png';
}