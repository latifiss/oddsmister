import MarketsPageClient from './client';
import type { Metadata } from 'next';
import { getStatisticsByCompanyId } from '@/lib/api/stocks';
import {
  getForexByCode,
  getCommodityByCode,
  getIndexByCode,
  getCryptoById,
  getForexInterbankRateByCode,
} from '@/lib/api/markets';
import { getArticlesByTag } from '@/lib/api/articles';

export const metadata: Metadata = {
  title: 'Markets | Ghanapolitan',
  description: 'Live market data including forex, commodities, stock indexes, cryptocurrencies, and Ghana stock exchange data.',
  openGraph: {
    title: 'Markets | Ghanapolitan',
    description: 'Live market data including forex, commodities, stock indexes, cryptocurrencies, and Ghana stock exchange data.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Markets | Ghanapolitan',
    description: 'Live market data including forex, commodities, stock indexes, cryptocurrencies, and Ghana stock exchange data.',
  },
  keywords: ['markets', 'forex', 'commodities', 'stocks', 'Ghana Stock Exchange', 'GSE', 'crypto', 'cryptocurrencies'],
};

async function getMarketData() {
  const TICKERS = [
    'UNIL','ACCESS','ADB','ALW','AADS','ASG','ALLGH','BOPP','CAL','CMLT','CLYD','CPC','DASPHARMA','DIGICUT','EGH','ETI','EGL','FML','FAB','GCB','GOIL','GGBL','HORDS','IIL','MAC','MMH','MTNGH','GLD','PBC','RBGH','SAMBA','SIC','SOGEGH','SCB','SCBPREF','TOTAL','TBL','TLW'
  ];

  const fetchStats = async () => {
    const results = await Promise.all(
      TICKERS.map(async (t) => {
        try {
          const res = await getStatisticsByCompanyId(t);
          // Unwrap AFX stocks response: outer ApiResponse, inner `data` is the statistics object
          const apiData: any = (res as any)?.data ?? res;
          const stats = apiData?.statistics ?? apiData ?? null;
          return { t, stats };
        } catch {
          return { t, stats: null };
        }
      })
    );

    const map: Record<string, any> = {};
    for (const r of results) {
      map[r.t] = r.stats;
    }
    return map;
  };

  const fetchMarketData = async () => {
    const forexAndCommodities = await Promise.all([
      getForexByCode('usdghs'),
      getForexByCode('eurghs'),
      getForexByCode('gbpghs'),
      getForexByCode('cnyghs'),
      getForexByCode('ghsngn'),
      getForexByCode('ghsxof'),
      getForexByCode('cadghs'),
      getForexByCode('ghszar'),
      getForexByCode('jpyghs'),
      getCommodityByCode('gold'),
      getCommodityByCode('cocoa'),
      getCommodityByCode('brent'),
      getCommodityByCode('crudeoil'),
      getCommodityByCode('coffee'),
      getCommodityByCode('copper'),
      getCommodityByCode('steel'),
      getCommodityByCode('lithium'),
      getCommodityByCode('rubber'),
      getIndexByCode('GGSECI'),
      getIndexByCode('US100'),
      getIndexByCode('UKX'),
      getIndexByCode('NGSEINDX'),
      getIndexByCode('CAC'),
      getIndexByCode('JALSH'),
      getIndexByCode('SHCOMP'),
      getIndexByCode('SPX'),
      getIndexByCode('DAX'),
    ]);

    // Fetch interbank FX rates on the server so the client has initial interbank data
    const interbankResults = await Promise.all([
      getForexInterbankRateByCode('USDGHS'),
      getForexInterbankRateByCode('EURGHS'),
      getForexInterbankRateByCode('GBPGHS'),
    ]);

    const cryptoData = await Promise.all([
      getCryptoById('bitcoin'),
      getCryptoById('ethereum'),
      getCryptoById('tether'),
      getCryptoById('ripple'),
      getCryptoById('binancecoin'),
      getCryptoById('chainlink'),
      getCryptoById('cardano'),
      getCryptoById('dogecoin'),
    ]);

    const [
      usdRes, eurRes, gbpRes, cnyRes, ghsNgnRes, ghsXofRes, cadRes, ghsZarRes, jpyRes,
      goldRes, cocoaRes, brentRes, crudeRes, coffeeRes, copperRes, steelRes, lithiumRes, rubberRes,
      gseRes, nasdaqRes, ftseRes, ngxRes, cacRes, jseRes, shanghaiRes, sp500Res, daxRes
    ] = forexAndCommodities;

    const [
      usdInterbankRes, eurInterbankRes, gbpInterbankRes
    ] = interbankResults;

    const [
      bitcoinRes, ethereumRes, tetherRes, xrpRes, binanceRes, chainlinkRes, cardanoRes, dogecoinRes
    ] = cryptoData;

    return {
      usdData: usdRes,
      eurData: eurRes,
      gbpData: gbpRes,
      cnyData: cnyRes,
      ghsNgnData: ghsNgnRes,
      ghsXofData: ghsXofRes,
      cadData: cadRes,
      ghsZarData: ghsZarRes,
      jpyData: jpyRes,
      // Unwrap interbank data so the client gets the inner `data` object
      usdInterbankData: (usdInterbankRes as any)?.data ?? usdInterbankRes ?? null,
      eurInterbankData: (eurInterbankRes as any)?.data ?? eurInterbankRes ?? null,
      gbpInterbankData: (gbpInterbankRes as any)?.data ?? gbpInterbankRes ?? null,
      goldData: goldRes,
      cocoaData: cocoaRes,
      brentData: brentRes,
      crudeData: crudeRes,
      coffeeData: coffeeRes,
      copperData: copperRes,
      steelData: steelRes,
      lithiumData: lithiumRes,
      rubberData: rubberRes,
      gseData: gseRes,
      nasdaqData: nasdaqRes,
      ftseData: ftseRes,
      ngxData: ngxRes,
      cacData: cacRes,
      jseData: jseRes,
      shanghaiData: shanghaiRes,
      sp500Data: sp500Res,
      daxData: daxRes,
      bitcoinData: bitcoinRes,
      ethereumData: ethereumRes,
      tetherData: tetherRes,
      xrpData: xrpRes,
      binanceData: binanceRes,
      chainlinkData: chainlinkRes,
      cardanoData: cardanoRes,
      dogecoinData: dogecoinRes
    };
  };

  const fetchArticles = async () => {
    try {
      const [currencyRes, commodityRes, cryptocurrencyRes, treasuryRes] = await Promise.all([
        getArticlesByTag('currency', 1, 2),
        getArticlesByTag('commodity', 1, 2),
        getArticlesByTag('cryptocurrency', 1, 2),
        getArticlesByTag('treasury', 1, 2)
      ]);

      return {
        currencyArticles: currencyRes?.data?.articles || [],
        commodityArticles: commodityRes?.data?.articles || [],
        cryptocurrencyArticles: cryptocurrencyRes?.data?.articles || [],
        treasuryArticles: treasuryRes?.data?.articles || []
      };
    } catch (error) {
      console.error('Error fetching articles:', error);
      return {
        currencyArticles: [],
        commodityArticles: [],
        cryptocurrencyArticles: [],
        treasuryArticles: []
      };
    }
  };

  try {
    const [stockStats, marketData, articles] = await Promise.all([
      fetchStats(),
      fetchMarketData(),
      fetchArticles()
    ]);

    return {
      stockStats,
      ...marketData,
      ...articles
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
}

export default async function Page() {
  const marketData = await getMarketData();
  return <MarketsPageClient initialData={marketData} />;
}