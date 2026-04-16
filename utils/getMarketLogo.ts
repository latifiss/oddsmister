export function getMarketLogoByName(stockName: string): string {
  const map: Record<string, string> = {
    'access bank ghana': '/assets/stocks/access.svg',
    'agricultural dev. bank': '/assets/stocks/adb.webp',
    'aluworks ltd': '/assets/stocks/aluworks.jpg',
    'anglogold ashanti': '/assets/stocks/anglogold.svg',
    'asante gold': '/assets/stocks/asante-gold.svg',
    'atlantic lithium': '/assets/stocks/atlantic-lithium.svg',
    'benso oil palm': '/assets/stocks/benso-oil.png',
    'calbank plc': '/assets/stocks/cal.webp',
    'camelot ghana': '/assets/stocks/camelot.jpg',
    'clydestone ghana': '/assets/stocks/clydestone.jpg',
    'cocoa processing co.': '/assets/stocks/cpc.jpg',
    'dannex ayrton starwin': '/assets/stocks/das.webp',
    'digicut advertising': '/assets/stocks/digicut.jpg',
    'ecobank ghana': '/assets/stocks/ecobank.svg',
    'ecobank transnational': '/assets/stocks/ecobank.svg',
    'enterprise group': '/assets/stocks/enterprise.png',
    'fan milk': '/assets/stocks/fanmilk.png',
    'first atlantic bank': '/assets/stocks/first.webp',
    'gcb bank': '/assets/stocks/gcb.webp',
    'goil plc': '/assets/stocks/goil.svg',
    'guinness ghana': '/assets/stocks/guiness.svg',
    'hords ltd': '/assets/stocks/hords.png',
    'intravenous infusions': '/assets/stocks/iil.png',
    'mega african capital': '/assets/stocks/mega.webp',
    'meridian-marshalls': '/assets/stocks/meridian.jpg',
    'mtn ghana': '/assets/stocks/mtn.svg',
    'newgold etf': '/assets/stocks/newgold.png',
    'produce buying co.': '/assets/stocks/pbc.jpg',
    'republic bank': '/assets/stocks/republic.webp',
    'sam-woode ltd': '/assets/stocks/samwood.png',
    'samba foods': '/assets/stocks/samba.jpg',
    'sic insurance': '/assets/stocks/sic.png',
    'societe generale': '/assets/stocks/societe-general.svg',
    'standard chartered': '/assets/stocks/standard-chartered.svg',
    'stanchart preference': '/assets/stocks/standard-chartered.svg',
    'totalenergies': '/assets/stocks/total.svg',
    'trust bank gambia': '/assets/stocks/trustbank.jpg',
    'tullow oil': '/assets/stocks/tullow-oil.svg',
    'unilever ghana': '/assets/stocks/unilever.svg',

    'bank of ghana': '/assets/core/bog.png',
    'cocobod': '/assets/core/cocobod.png',
    'goldbod': '/assets/core/goldbod.png',
    'comac': '/assets/core/comac.png',
    'gse': '/assets/core/gse.png',
    'ghana stock exchange': '/assets/sources/gse.png',

    'cocoa': '/assets/core/cocoa.svg',
    'crude-oil': '/assets/core/crude-oil.svg',
    'us-dollar': '/assets/core/dollar.svg',
    'us dollar': '/assets/core/dollar.svg',
    'dollar': '/assets/core/dollar.svg',
    'gold': '/assets/core/gold.svg',
    'silver': '/assets/core/silver.svg',
    'world': '/assets/core/world.svg',
    'lithium': '/assets/core/lithium.svg',

    'kasapreko': '/assets/core/kasapreko.png',
  };

  if (!stockName) return '/assets/stocks/default.svg';

  const key = stockName.trim().toLowerCase();
  
  if (map[key]) {
    return map[key];
  }

  const countryCodes: Record<string, string> = {
    'united states': 'US',
    'usa': 'US',
    'america': 'US',
    'united kingdom': 'GB',
    'uk': 'GB',
    'great britain': 'GB',
    'britain': 'GB',
    'england': 'GB',
    'canada': 'CA',
    'australia': 'AU',
    'germany': 'DE',
    'france': 'FR',
    'japan': 'JP',
    'china': 'CN',
    'india': 'IN',
    'south africa': 'ZA',
    'nigeria': 'NG',
    'ghana': 'GH',
    'kenya': 'KE',
    'egypt': 'EG',
    'brazil': 'BR',
    'mexico': 'MX',
    'south korea': 'KR',
    'russia': 'RU',
    'italy': 'IT',
    'spain': 'ES',
    'netherlands': 'NL',
    'switzerland': 'CH',
    'sweden': 'SE',
    'norway': 'NO',
    'denmark': 'DK',
    'finland': 'FI',
    'belgium': 'BE',
    'austria': 'AT',
    'poland': 'PL',
    'turkey': 'TR',
    'saudi arabia': 'SA',
    'uae': 'AE',
    'united arab emirates': 'AE',
    'singapore': 'SG',
    'malaysia': 'MY',
    'indonesia': 'ID',
    'philippines': 'PH',
    'vietnam': 'VN',
    'thailand': 'TH',
  };

  const countryKey = stockName.trim().toLowerCase();
  if (countryCodes[countryKey]) {
    return `https://s3-symbol-logo.tradingview.com/country/${countryCodes[countryKey]}.svg`;
  }

  const formattedName = stockName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `https://s3-symbol-logo.tradingview.com/${formattedName}--big.svg`;
}