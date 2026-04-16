export function getStockLogo(stockCode: string): string {
  const map: Record<string, string> = {
    'ACCESS': 'access.svg',
    'ADB': 'adb.webp',
    'ALW': 'aluworks.jpg',
    'AGA': 'anglogold.svg',
    'ASG': 'asante-gold.svg',
    'ALLGH': 'atlantic-lithium.svg',
    'BOPP': 'benso-oil.png',
    'CAL': 'cal.webp',
    'CMLT': 'camelot.jpg',
    'CLYD': 'clydestone.jpg',
    'CPC': 'cpc.jpg',
    'DASPHARMA': 'das.webp',
    'DIGICUT': 'digicut.jpg',
    'EGH': 'ecobank.svg',
    'ETI': 'ecobank.svg',
    'EGL': 'enterprise.png',
    'FML': 'fanmilk.png',
    'FAB': 'first.webp',
    'GCB': 'gcb.webp',
    'GOIL': 'goil.svg',
    'GGBL': 'guiness.svg',
    'HORDS': 'hords.png',
    'IIL': 'iil.png',
    'MAC': 'mega.webp',
    'MMH': 'meridian.jpg',
    'MTNGH': 'mtn.svg',
    'GLD': 'newgold.png',
    'PBC': 'pbc.jpg',
    'RBGH': 'republic.webp',
    'SWL': 'samwood.png',
    'SAMBA': 'samba.jpg',
    'SIC': 'sic.png',
    'SOGEGH': 'societe-general.svg',
    'SCB': 'standard-chartered.svg',
    'SCB PREF': 'standard-chartered.svg',
    'TOTAL': 'total.svg',
    'TBL': 'trustbank.jpg',
    'TLW': 'tullow-oil.svg',
    'UNIL': 'unilever.svg',
  };

  if (!stockCode) return '/assets/stocks/default.svg';

  const key = stockCode.trim().toUpperCase();
  const filename = map[key];

  return filename ? `/assets/stocks/${filename}` : '/assets/stocks/default.svg';
}

export function getStockLogoByName(stockName: string): string {
  const map: Record<string, string> = {
    'access bank ghana': 'access.svg',
    'agricultural dev. bank': 'adb.webp',
    'aluworks ltd': 'aluworks.jpg',
    'anglogold ashanti': 'anglogold.svg',
    'asante gold': 'asante-gold.svg',
    'atlantic lithium': 'atlantic-lithium.svg',
    'benso oil palm': 'benso-oil.png',
    'calbank plc': 'cal.webp',
    'camelot ghana': 'camelot.jpg',
    'clydestone ghana': 'clydestone.jpg',
    'cocoa processing co.': 'cpc.jpg',
    'dannex ayrton starwin': 'das.webp',
    'digicut advertising': 'digicut.jpg',
    'ecobank ghana': 'ecobank.svg',
    'ecobank transnational': 'ecobank.svg',
    'enterprise group': 'enterprise.png',
    'fan milk': 'fanmilk.png',
    'first atlantic bank': 'first.webp',
    'gcb bank': 'gcb.webp',
    'goil plc': 'goil.svg',
    'guinness ghana': 'guiness.svg',
    'hords ltd': 'hords.png',
    'intravenous infusions': 'iil.png',
    'mega african capital': 'mega.webp',
    'meridian-marshalls': 'meridian.jpg',
    'mtn ghana': 'mtn.svg',
    'newgold etf': 'newgold.png',
    'produce buying co.': 'pbc.jpg',
    'republic bank': 'republic.webp',
    'sam-woode ltd': 'samwood.png',
    'samba foods': 'samba.jpg',
    'sic insurance': 'sic.png',
    'societe generale': 'societe-general.svg',
    'standard chartered': 'standard-chartered.svg',
    'stanchart preference': 'standard-chartered.svg',
    'totalenergies': 'total.svg',
    'trust bank gambia': 'trustbank.jpg',
    'tullow oil': 'tullow-oil.svg',
    'unilever ghana': 'unilever.svg',
  };

  if (!stockName) return '/assets/stocks/default.svg';

  const key = stockName.trim().toLowerCase();
  const filename = map[key];

  return filename ? `/assets/stocks/${filename}` : '/assets/stocks/default.svg';
}

export function getStockLogoByIdentifier(identifier: string, byName: boolean = false): string {
  if (!identifier) return '/assets/stocks/default.svg';
  
  return byName ? getStockLogoByName(identifier) : getStockLogo(identifier);
}