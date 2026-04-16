'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import IndexChart, { ChartDataPoint } from '@/components/indexChart';
import { CurrencyItem } from '@/components/currencyItems';
import { StockItem } from '@/components/stockItem';
import { getStatisticsByCompanyId } from '@/lib/api/stocks';
import {
  getForexByCode,
  getForexInterbankRateByCode,
  getCommodityByCode,
  getIndexByCode,
  getCryptoById
} from '@/lib/api/markets';
import { getArticlesByTag } from '@/lib/api/articles';
import LoadingComponent from './loading';
import { BOGItem } from '@/components/bogItem';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 26px 30px 60px 30px;
  max-width: 100%;

  @media only screen and (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    padding: 20px 16px 60px 16px;
  }

  @media only screen and (min-width: 577px) and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 12px 20px 60px 20px;
  }

  @media only screen and (min-width: 769px) and (max-width: 992px) {
    padding: 16px 24px 60px 24px;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 30px;
  width: 100%;

  @media only screen and (max-width: 576px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 16px;
  }

  @media only screen and (min-width: 577px) and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    gap: 16px;
  }
`;

const ChartItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 12px;
  background: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 0.1px solid var(--border);

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const Currency = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
`;

const HeaderText = styled.p`
  font-size: 28px;
  line-height: 32px;
  font-weight: 700;
  margin: 0;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};

  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }

  @media only screen and (min-width: 769px) and (max-width: 992px) {
    font-size: 22px;
  }
`;

const SubHeader = styled.p`
  font-size: 14px;
  line-height: 1.2;
  font-weight: 700;
  margin: 0;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
`;

const ChartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--gray-text);
  width: 100%;
  margin-top: 16px;
`;

const DataSource = styled.span`
  display: none;
`;

const LastUpdated = styled.span`
  font-size: 12px;
  line-height: 1.2;
  color: var(--gray-text);
`;

const OtherContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 16px;
`;

const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: 12px 0px;
  gap: 12px;
`;

interface MarketsData {
  stockStats: Record<string, any>;
  usdData: any;
  eurData: any;
  gbpData: any;
  cnyData: any;
  ghsNgnData: any;
  ghsXofData: any;
  cadData: any;
  ghsZarData: any;
  jpyData: any;
  usdInterbankData: any;
  eurInterbankData: any;
  gbpInterbankData: any;
  goldData: any;
  cocoaData: any;
  brentData: any;
  crudeData: any;
  coffeeData: any;
  copperData: any;
  steelData: any;
  lithiumData: any;
  rubberData: any;
  gseData: any;
  nasdaqData: any;
  ftseData: any;
  ngxData: any;
  cacData: any;
  jseData: any;
  shanghaiData: any;
  sp500Data: any;
  daxData: any;
  bitcoinData: any;
  ethereumData: any;
  tetherData: any;
  xrpData: any;
  binanceData: any;
  chainlinkData: any;
  cardanoData: any;
  dogecoinData: any;
  currencyArticles?: any[];
  commodityArticles?: any[];
  cryptoArticles?: any[];
  treasuryArticles?: any[];
}

interface MarketsPageClientProps {
  initialData: MarketsData | null;
}

export default function MarketsPageClient({ initialData }: MarketsPageClientProps) {
  console.log('MarketsPageClient initialData:', initialData);
  const [usdData, setUsdData] = useState<any>(initialData?.usdData || null);
  const [eurData, setEurData] = useState<any>(initialData?.eurData || null);
  const [gbpData, setGbpData] = useState<any>(initialData?.gbpData || null);
  const [cnyData, setCnyData] = useState<any>(initialData?.cnyData || null);
  const [ghsNgnData, setGhsNgnData] = useState<any>(initialData?.ghsNgnData || null);
  const [ghsXofData, setGhsXofData] = useState<any>(initialData?.ghsXofData || null);
  const [cadData, setCadData] = useState<any>(initialData?.cadData || null);
  const [ghsZarData, setGhsZarData] = useState<any>(initialData?.ghsZarData || null);
  const [jpyData, setJpyData] = useState<any>(initialData?.jpyData || null);
  const [usdInterbankData, setUsdInterbankData] = useState<any>(initialData?.usdInterbankData || null);
  const [eurInterbankData, setEurInterbankData] = useState<any>(initialData?.eurInterbankData || null);
  const [gbpInterbankData, setGbpInterbankData] = useState<any>(initialData?.gbpInterbankData || null);
  const [goldData, setGoldData] = useState<any>(initialData?.goldData || null);
  const [cocoaData, setCocoaData] = useState<any>(initialData?.cocoaData || null);
  const [brentData, setBrentData] = useState<any>(initialData?.brentData || null);
  const [crudeData, setCrudeData] = useState<any>(initialData?.crudeData || null);
  const [coffeeData, setCoffeeData] = useState<any>(initialData?.coffeeData || null);
  const [copperData, setCopperData] = useState<any>(initialData?.copperData || null);
  const [steelData, setSteelData] = useState<any>(initialData?.steelData || null);
  const [lithiumData, setLithiumData] = useState<any>(initialData?.lithiumData || null);
  const [rubberData, setRubberData] = useState<any>(initialData?.rubberData || null);
  const [gseData, setGseData] = useState<any>(initialData?.gseData || null);
  const [nasdaqData, setNasdaqData] = useState<any>(initialData?.nasdaqData || null);
  const [ftseData, setFtseData] = useState<any>(initialData?.ftseData || null);
  const [ngxData, setNgxData] = useState<any>(initialData?.ngxData || null);
  const [cacData, setCacData] = useState<any>(initialData?.cacData || null);
  const [jseData, setJseData] = useState<any>(initialData?.jseData || null);
  const [shanghaiData, setShanghaiData] = useState<any>(initialData?.shanghaiData || null);
  const [sp500Data, setSp500Data] = useState<any>(initialData?.sp500Data || null);
  const [daxData, setDaxData] = useState<any>(initialData?.daxData || null);
  const [bitcoinData, setBitcoinData] = useState<any>(initialData?.bitcoinData || null);
  const [ethereumData, setEthereumData] = useState<any>(initialData?.ethereumData || null);
  const [tetherData, setTetherData] = useState<any>(initialData?.tetherData || null);
  const [xrpData, setXrpData] = useState<any>(initialData?.xrpData || null);
  const [binanceData, setBinanceData] = useState<any>(initialData?.binanceData || null);
  const [chainlinkData, setChainlinkData] = useState<any>(initialData?.chainlinkData || null);
  const [cardanoData, setCardanoData] = useState<any>(initialData?.cardanoData || null);
  const [dogecoinData, setDogecoinData] = useState<any>(initialData?.dogecoinData || null);
  const [stockStats, setStockStats] = useState<Record<string, any>>(initialData?.stockStats || {});
  const [loading, setLoading] = useState(!initialData);

  const [currencyArticles, setCurrencyArticles] = useState<any[]>(initialData?.currencyArticles || []);
  const [commodityArticles, setCommodityArticles] = useState<any[]>(initialData?.commodityArticles || []);
  const [cryptoArticles, setCryptoArticles] = useState<any[]>(initialData?.cryptoArticles || []);
  const [treasuryArticles, setTreasuryArticles] = useState<any[]>(initialData?.treasuryArticles || []);

  useEffect(() => {
    if (!initialData) {
      const TICKERS = [
        'UNIL','ACCESS','ADB','ALW','AADS','ASG','ALLGH','BOPP','CAL','CMLT','CLYD','CPC','DASPHARMA','DIGICUT','EGH','ETI','EGL','FML','FAB','GCB','GOIL','GGBL','HORDS','IIL','MAC','MMH','MTNGH','GLD','PBC','RBGH','SAMBA','SIC','SOGEGH','SCB','SCBPREF','TOTAL','TBL','TLW'
      ];

      const fetchStats = async () => {
        try {
          const results = await Promise.all(
            TICKERS.map(async (t) => {
              try {
                const res = await getStatisticsByCompanyId(t);
                const apiData: any = (res as any)?.data ?? res;
                const stats = apiData?.statistics ?? apiData ?? null;
                return { t, stats };
              } catch (err) {
                console.error(`Error fetching stats for ${t}:`, err);
                return { t, stats: null };
              }
            })
          );

          const map: Record<string, any> = {};
          for (const r of results) {
            map[r.t] = r.stats;
          }
          setStockStats(map);
        } catch (err) {
          console.error('Error fetching stock statistics:', err);
        }
      };

     const fetchData = async () => {
  try {
    console.log('MarketsPageClient fetching live market data...');

    const [
      usdRes,
      eurRes,
      gbpRes,
      cnyRes,
      ghsNgnRes,
      ghsXofRes,
      cadRes,
      ghsZarRes,
      jpyRes,
      usdInterbankRes,
      eurInterbankRes,
      gbpInterbankRes,
      goldRes,
      cocoaRes,
      brentRes,
      crudeRes,
      coffeeRes,
      copperRes,
      steelRes,
      lithiumRes,
      rubberRes,
      gseRes,
      nasdaqRes,
      ftseRes,
      ngxRes,
      cacRes,
      jseRes,
      shanghaiRes,
      sp500Res,
      daxRes,
      bitcoinRes,
      ethereumRes,
      tetherRes,
      xrpRes,
      binanceRes,
      chainlinkRes,
      cardanoRes,
      dogecoinRes
    ] = await Promise.all([
      getForexByCode('usdghs'),
      getForexByCode('eurghs'),
      getForexByCode('gbpghs'),
      getForexByCode('cnyghs'),
      getForexByCode('ghsngn'),
      getForexByCode('ghsxof'),
      getForexByCode('cadghs'),
      getForexByCode('ghszar'),
      getForexByCode('jpyghs'),
      getForexInterbankRateByCode('USDGHS'),
      getForexInterbankRateByCode('EURGHS'),
      getForexInterbankRateByCode('GBPGHS'),
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
      getCryptoById('bitcoin'),
      getCryptoById('ethereum'),
      getCryptoById('tether'),
      getCryptoById('ripple'),
      getCryptoById('binancecoin'),
      getCryptoById('chainlink'),
      getCryptoById('cardano'),
      getCryptoById('dogecoin'),
    ]);

    // Regular Forex Data
    setUsdData(usdRes);
    setEurData(eurRes);
    setGbpData(gbpRes);
    setCnyData(cnyRes);
    setGhsNgnData(ghsNgnRes);
    setGhsXofData(ghsXofRes);
    setCadData(cadRes);
    setGhsZarData(ghsZarRes);
    setJpyData(jpyRes);

    // Interbank Data - Extracting the nested .data object from the API response
    // We check for .data because your API structure is { success: true, data: { ... } }
    setUsdInterbankData(usdInterbankRes?.data || usdInterbankRes || null);
    setEurInterbankData(eurInterbankRes?.data || eurInterbankRes || null);
    setGbpInterbankData(gbpInterbankRes?.data || gbpInterbankRes || null);

    // Commodities
    setGoldData(goldRes);
    setCocoaData(cocoaRes);
    setBrentData(brentRes);
    setCrudeData(crudeRes);
    setCoffeeData(coffeeRes);
    setCopperData(copperRes);
    setSteelData(steelRes);
    setLithiumData(lithiumRes);
    setRubberData(rubberRes);

    // Indices
    setGseData(gseRes);
    setNasdaqData(nasdaqRes);
    setFtseData(ftseRes);
    setNgxData(ngxRes);
    setCacData(cacRes);
    setJseData(jseRes);
    setShanghaiData(shanghaiRes);
    setSp500Data(sp500Res);
    setDaxData(daxRes);

    // Crypto
    setBitcoinData(bitcoinRes);
    setEthereumData(ethereumRes);
    setTetherData(tetherRes);
    setXrpData(xrpRes);
    setBinanceData(binanceRes);
    setChainlinkData(chainlinkRes);
    setCardanoData(cardanoRes);
    setDogecoinData(dogecoinRes);

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

      fetchStats();
      fetchData();
    }
  }, [initialData]);

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit'
    });
  };
  
  function getLast5BusinessDaysFromData(price_history) {
    if (!price_history || !Array.isArray(price_history)) return [];
    
    const isBusinessDay = date => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    };
  
    const sorted = price_history
      .map(p => ({
        date: new Date(p.date),
        price: p.midrate_price || p.price || p.current_price || 0
      }))
      .filter(p => !isNaN(p.date) && isBusinessDay(p.date))
      .sort((a, b) => b.date - a.date);
  
    const daysIncluded = new Set();
    const result = [];
  
    for (const point of sorted) {
      const dayKey = point.date.toISOString().split("T")[0];

      if (daysIncluded.size >= 5 && !daysIncluded.has(dayKey)) break;
  
      daysIncluded.add(dayKey);
      result.push(point);
    }
  
    return result.sort((a, b) => a.date - b.date);
  }

  const usdChartData: (ChartDataPoint & { originalDate: string })[] =
    usdData?.price_history
      ? getLast5BusinessDaysFromData(usdData.price_history).map(point => ({
          date: formatDate(point.date),
          value: point.price,
          originalDate: point.date
        }))
      : [];

  const goldChartData: (ChartDataPoint & { originalDate: string })[] =
    goldData?.price_history
      ? getLast5BusinessDaysFromData(goldData.price_history).map(point => ({
          date: formatDate(point.date),
          value: point.price,
          originalDate: point.date
        }))
      : [];

  const gseChartData: (ChartDataPoint & { originalDate: string })[] =
    gseData?.price_history
      ? getLast5BusinessDaysFromData(gseData.price_history).map(point => ({
          date: formatDate(point.date),
          value: point.price,
          originalDate: point.date
        }))
      : [];

  const bitcoinChartData: (ChartDataPoint & { originalDate: string })[] =
    bitcoinData?.price_history
      ? getLast5BusinessDaysFromData(bitcoinData.price_history).map(point => ({
          date: formatDate(point.date),
          value: point.price,
          originalDate: point.date
        }))
      : [];

  const xAxisTickFormatter = (value: string): string => {
    const isMidnight = value.includes('00:00');
    return isMidnight ? value.split(',')[0] : '';
  };

  const formatTooltip = (data: any, dataKey: string, dataType: string): string => {
    if (!data.payload?.[0]) return '';
    const payload = data.payload[0].payload;
    const value = payload.value;
    const originalDate = payload.originalDate;
    const formattedDate = new Date(originalDate).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    switch (dataType) {
      case 'usdghs':
        return `${formattedDate} : ${value.toFixed(2)} GHS/USD`;
      case 'gold':
        return `${formattedDate} : $${value.toFixed(2)}`;
      case 'gse':
        return `${formattedDate} : ${value.toFixed(2)}`;
      case 'bitcoin':
        return `${formattedDate} : $${value.toFixed(2)}`;
      default:
        return `${formattedDate} : ${value.toFixed(2)}`;
    }
  };

  const formatInterbankValue = (data: any, prefix: string = '₵'): string => {
    if (!data) return ' ';
    const price = data.current_midrate_price;
    if (typeof price === 'number') return `${prefix}${price.toFixed(2)}`;
    return ' ';
  };

  const formatInterbankChange = (data: any): number => {
    if (!data) return 0;
    return data.midrate_percentage_change || 0;
  };

  const formatValue = (value: any, prefix: string = '', decimals: number = 2): string => {
    if (value === null || value === undefined) return ' ';
    if (typeof value === 'number') return `${prefix}${value.toFixed(decimals)}`;
    return `${prefix}${value}`;
  };

  if (loading) return <LoadingComponent />;

  return (
    <PageWrapper>
      <Wrapper>
        <ChartItem>
          <Header>
            <HeaderText>Currencies</HeaderText>
            <Currency>
              <CurrencyItem
                image="/assets/forex/usd-ghs.png"
                label="Dollar to Cedi"
                code="USDGHS"
                value={formatValue(usdData?.currentPrice)}
                change={usdData?.percentage_change || 0}
              />
              <BOGItem 
                label="BOG Interbank Rate" 
                code="US Dollar to Cedi" 
                value={formatInterbankValue(usdInterbankData)} 
                change={formatInterbankChange(usdInterbankData)} 
              />
            </Currency>
          </Header>

          <IndexChart
            data={usdChartData}
            color={usdData?.current_price >= 0 ? "#13D14C" : "#FF0606"}
            height={400}
            showGrid
            xAxisOptions={{
              tickFormatter: xAxisTickFormatter,
              tickRotation: -45,
              interval: Math.ceil(usdChartData.length / 10)
            }}
            yAxisOptions={{
              tickFormat: (value: number) => value.toFixed(2),
              domain: ['dataMin - 0.5', 'dataMax + 0.5'],
              label: {
                value: 'GHS/USD',
                angle: -90,
                position: 'insideLeft'
              }
            }}
            lineOptions={{
              strokeWidth: 2,
              curveType: 'monotone',
              showDot: false
            }}
            margin={{ left: 50, right: 20, top: 20, bottom: 12 }}
            tooltipFormatter={(data) => formatTooltip(data, 'value', 'usdghs')}
          />
          <OtherContainer>
            <Header>
              <SubHeader>Other Currencies</SubHeader>
            </Header>
            <CurrencyItem image="/assets/forex/eur-ghs.png" label="Euro to Cedi" code="EURGHS" value={formatValue(eurData?.currentPrice)} change={eurData?.percentage_change || 0} />
            <BOGItem 
              label="BOG Interbank Rate" 
              code="Euro to Cedi" 
              value={formatInterbankValue(eurInterbankData)} 
              change={formatInterbankChange(eurInterbankData)} 
            />
            <CurrencyItem image="/assets/forex/gbp-ghs.png" label="Pounds to Cedi" code="GBPGHS" value={formatValue(gbpData?.currentPrice)} change={gbpData?.percentage_change || 0} />
            <BOGItem 
              label="BOG Interbank Rate" 
              code="Pounds to Cedi" 
              value={formatInterbankValue(gbpInterbankData)} 
              change={formatInterbankChange(gbpInterbankData)} 
            />
            <CurrencyItem image="/assets/forex/cny-ghs.png" label="Yuan to Cedi" code="CNYGHS" value={formatValue(cnyData?.currentPrice)} change={cnyData?.percentage_change || 0} />
            <CurrencyItem image="/assets/forex/ghs-ngn.png" label="Cedi to Naira" code="GHSNGN" value={formatValue(ghsNgnData?.currentPrice)} change={ghsNgnData?.percentage_change || 0} />
            <CurrencyItem image="/assets/forex/ghs-xof.png" label="Cedi to Cfa" code="GHSXOF" value={formatValue(ghsXofData?.currentPrice)} change={ghsXofData?.percentage_change || 0} />
            <CurrencyItem image="/assets/forex/cad-ghs.png" label="Canadian dollar to Cedi" code="CADGHS" value={formatValue(cadData?.currentPrice)} change={cadData?.percentage_change || 0} />
            <CurrencyItem image="/assets/forex/ghs-zar.png" label="Cedi to Rand" code="GHSZAR" value={formatValue(ghsZarData?.currentPrice)} change={ghsZarData?.percentage_change || 0} />
            <CurrencyItem image="/assets/forex/jpy-ghs.png" label="Yen to Cedi" code="JPYGHS" value={formatValue(jpyData?.currentPrice)} change={jpyData?.percentage_change || 0} />
          </OtherContainer>

          <ChartFooter>
            <DataSource>Source: Central Bank of Ghana</DataSource>
            <LastUpdated>
            Last updated: {usdData?.last_updated 
              ? new Date(usdData.last_updated).toLocaleString() 
              : ' '}
            </LastUpdated>
          </ChartFooter>
        </ChartItem>
        
        <ChartItem>
          <Header>
            <HeaderText>Commodities</HeaderText>
            <Currency>
              <CurrencyItem
                label="Gold"
                code="XAU"
                value={formatValue(goldData?.currentPrice, '$')}
                change={goldData?.percentage_change || 0}
              />
            </Currency>
          </Header>

          <IndexChart
            data={goldChartData}
            color={goldData?.current_price >= 0 ? "#13D14C" : "#FF0606"}
            height={400}
            showGrid
            xAxisOptions={{
              tickFormatter: xAxisTickFormatter,
              tickRotation: -45,
              interval: Math.ceil(goldChartData.length / 10)
            }}
            yAxisOptions={{
              tickFormat: (value: number) => value.toFixed(2),
              domain: ['dataMin - 0.5', 'dataMax + 0.5'],
              label: {
                value: 'USD',
                angle: -90,
                position: 'insideLeft'
              }
            }}
            lineOptions={{
              strokeWidth: 2,
              curveType: 'monotone',
              showDot: false
            }}
            margin={{ left: 50, right: 20, top: 20, bottom: 12 }}
            tooltipFormatter={(data) => formatTooltip(data, 'value', 'gold')}
          />

          <OtherContainer>
            <Header>
              <SubHeader>Other Commodities</SubHeader>
            </Header>
            <CurrencyItem label="Cocoa" code="USD/T" value={formatValue(cocoaData?.currentPrice, '$')} change={cocoaData?.percentage_change || 0} />
            <CurrencyItem label="Brent" code="USD/Bbl" value={formatValue(brentData?.currentPrice, '$')} change={brentData?.percentage_change || 0} />
            <CurrencyItem label="Crude oil" code="USD/Bbl" value={formatValue(crudeData?.currentPrice, '$')} change={crudeData?.percentage_change || 0} />
            <CurrencyItem label="Coffee" code="USD/lbs" value={formatValue(coffeeData?.currentPrice, '$')} change={coffeeData?.percentage_change || 0} />
            <CurrencyItem label="Copper" code="USD/lbs" value={formatValue(copperData?.currentPrice, '$')} change={copperData?.percentage_change || 0} />
            <CurrencyItem label="Steel" code="CNY/T" value={formatValue(steelData?.currentPrice, '¥')} change={steelData?.percentage_change || 0} />
            <CurrencyItem label="Lithium" code="CNY/T" value={formatValue(lithiumData?.currentPrice, '¥')} change={lithiumData?.percentage_change || 0} />
            <CurrencyItem label="Rubber" code="USD Cents / Kg" value={formatValue(rubberData?.currentPrice, '$')} change={rubberData?.percentage_change || 0} />
          </OtherContainer>

          <ChartFooter>
            <DataSource>Source: Central Bank of Ghana</DataSource>
            <LastUpdated>
            Last updated: {goldData?.last_updated 
              ? new Date(goldData.last_updated).toLocaleString() 
              : ' '}
            </LastUpdated>
          </ChartFooter>
        </ChartItem>

        <ChartItem>
          <Header>
            <HeaderText>Ghana Listed Stocks (GSE)</HeaderText>
          </Header>

          <OtherContainer>
            <Header>
              <SubHeader></SubHeader>
            </Header>
            <StockItem image="/assets/stocks/unilever.svg" label="Unilever Ghana" code="UNIL" value={stockStats['UNIL']?.key_statistics?.current_price || ' '} change={Number(stockStats['UNIL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['UNIL']?.company_id ? `/stock/${stockStats['UNIL'].company_id}` : (stockStats['UNIL']?._id ? `/stock/${stockStats['UNIL']._id}` : '/stock/UNIL')} />
            <StockItem image="/assets/stocks/access.svg" label="Access Bank Ghana" code="ACCESS" value={stockStats['ACCESS']?.key_statistics?.current_price || ' '} change={Number(stockStats['ACCESS']?.key_statistics?.percentage_change ?? 0)} link={stockStats['ACCESS']?.company_id ? `/stock/${stockStats['ACCESS'].company_id}` : (stockStats['ACCESS']?._id ? `/stock/${stockStats['ACCESS']._id}` : '/stock/ACCESS')} />
            <StockItem image="/assets/stocks/adb.webp" label="Agricultural Dev. Bank" code="ADB" value={stockStats['ADB']?.key_statistics?.current_price || ' '} change={Number(stockStats['ADB']?.key_statistics?.percentage_change ?? 0)} link={stockStats['ADB']?.company_id ? `/stock/${stockStats['ADB'].company_id}` : (stockStats['ADB']?._id ? `/stock/${stockStats['ADB']._id}` : '/stock/ADB')} />
            <StockItem image="/assets/stocks/aluworks.jpg" label="Aluworks Ltd" code="ALW" value={stockStats['ALW']?.key_statistics?.current_price || ' '} change={Number(stockStats['ALW']?.key_statistics?.percentage_change ?? 0)} link={stockStats['ALW']?.company_id ? `/stock/${stockStats['ALW'].company_id}` : (stockStats['ALW']?._id ? `/stock/${stockStats['ALW']._id}` : '/stock/ALW')} />
            <StockItem image="/assets/stocks/anglogold.svg" label="AngloGold Ashanti" code="AADS" value={stockStats['AADS']?.key_statistics?.current_price || ' '} change={Number(stockStats['AADS']?.key_statistics?.percentage_change ?? 0)} link={stockStats['AADS']?.company_id ? `/stock/${stockStats['AADS'].company_id}` : (stockStats['AADS']?._id ? `/stock/${stockStats['AADS']._id}` : '/stock/AADS')} />
            <StockItem image="/assets/stocks/asante-gold.svg" label="Asante Gold" code="ASG" value={stockStats['ASG']?.key_statistics?.current_price || ' '} change={Number(stockStats['ASG']?.key_statistics?.percentage_change ?? 0)} link={stockStats['ASG']?.company_id ? `/stock/${stockStats['ASG'].company_id}` : (stockStats['ASG']?._id ? `/stock/${stockStats['ASG']._id}` : '/stock/ASG')} />
            <StockItem image="/assets/stocks/atlantic-lithium.svg" label="Atlantic Lithium" code="ALLGH" value={stockStats['ALLGH']?.key_statistics?.current_price || ' '} change={Number(stockStats['ALLGH']?.key_statistics?.percentage_change ?? 0)} link={stockStats['ALLGH']?.company_id ? `/stock/${stockStats['ALLGH'].company_id}` : (stockStats['ALLGH']?._id ? `/stock/${stockStats['ALLGH']._id}` : '/stock/ALLGH')} />
            <StockItem image="/assets/stocks/benso-oil.png" label="Benso Oil Palm" code="BOPP" value={stockStats['BOPP']?.key_statistics?.current_price || ' '} change={Number(stockStats['BOPP']?.key_statistics?.percentage_change ?? 0)} link={stockStats['BOPP']?.company_id ? `/stock/${stockStats['BOPP'].company_id}` : (stockStats['BOPP']?._id ? `/stock/${stockStats['BOPP']._id}` : '/stock/BOPP')} />
            <StockItem image="/assets/stocks/cal.webp" label="CalBank PLC" code="CAL" value={stockStats['CAL']?.key_statistics?.current_price || ' '} change={Number(stockStats['CAL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['CAL']?.company_id ? `/stock/${stockStats['CAL'].company_id}` : (stockStats['CAL']?._id ? `/stock/${stockStats['CAL']._id}` : '/stock/CAL')} />
            <StockItem image="/assets/stocks/camelot.jpg" label="Camelot Ghana" code="CMLT" value={stockStats['CMLT']?.key_statistics?.current_price || ' '} change={Number(stockStats['CMLT']?.key_statistics?.percentage_change ?? 0)} link={stockStats['CMLT']?.company_id ? `/stock/${stockStats['CMLT'].company_id}` : (stockStats['CMLT']?._id ? `/stock/${stockStats['CMLT']._id}` : '/stock/CMLT')} />
            <StockItem image="/assets/stocks/clydestone.jpg" label="Clydestone Ghana" code="CLYD" value={stockStats['CLYD']?.key_statistics?.current_price || ' '} change={Number(stockStats['CLYD']?.key_statistics?.percentage_change ?? 0)} link={stockStats['CLYD']?.company_id ? `/stock/${stockStats['CLYD'].company_id}` : (stockStats['CLYD']?._id ? `/stock/${stockStats['CLYD']._id}` : '/stock/CLYD')} />
            <StockItem image="/assets/stocks/cpc.jpg" label="Cocoa Processing Co." code="CPC" value={stockStats['CPC']?.key_statistics?.current_price || ' '} change={Number(stockStats['CPC']?.key_statistics?.percentage_change ?? 0)} link={stockStats['CPC']?.company_id ? `/stock/${stockStats['CPC'].company_id}` : (stockStats['CPC']?._id ? `/stock/${stockStats['CPC']._id}` : '/stock/CPC')} />
            <StockItem image="/assets/stocks/das.webp" label="Dannex Ayrton Starwin" code="DASPHARMA" value={stockStats['DASPHARMA']?.key_statistics?.current_price || ' '} change={Number(stockStats['DASPHARMA']?.key_statistics?.percentage_change ?? 0)} link={stockStats['DASPHARMA']?.company_id ? `/stock/${stockStats['DASPHARMA'].company_id}` : (stockStats['DASPHARMA']?._id ? `/stock/${stockStats['DASPHARMA']._id}` : '/stock/DASPHARMA')} />
            <StockItem image="/assets/stocks/digicut.jpg" label="Digicut Advertising" code="DIGICUT" value={stockStats['DIGICUT']?.key_statistics?.current_price || ' '} change={Number(stockStats['DIGICUT']?.key_statistics?.percentage_change ?? 0)} link={stockStats['DIGICUT']?.company_id ? `/stock/${stockStats['DIGICUT'].company_id}` : (stockStats['DIGICUT']?._id ? `/stock/${stockStats['DIGICUT']._id}` : '/stock/DIGICUT')} />
            <StockItem image="/assets/stocks/ecobank.svg" label="Ecobank Ghana" code="EGH" value={stockStats['EGH']?.key_statistics?.current_price || ' '} change={Number(stockStats['EGH']?.key_statistics?.percentage_change ?? 0)} link={stockStats['EGH']?.company_id ? `/stock/${stockStats['EGH'].company_id}` : (stockStats['EGH']?._id ? `/stock/${stockStats['EGH']._id}` : '/stock/EGH')} />
            <StockItem image="/assets/stocks/ecobank.svg" label="Ecobank Transnational" code="ETI" value={stockStats['ETI']?.key_statistics?.current_price || ' '} change={Number(stockStats['ETI']?.key_statistics?.percentage_change ?? 0)} link={stockStats['ETI']?.company_id ? `/stock/${stockStats['ETI'].company_id}` : (stockStats['ETI']?._id ? `/stock/${stockStats['ETI']._id}` : '/stock/ETI')} />
            <StockItem image="/assets/stocks/enterprise.png" label="Enterprise Group" code="EGL" value={stockStats['EGL']?.key_statistics?.current_price || ' '} change={Number(stockStats['EGL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['EGL']?.company_id ? `/stock/${stockStats['EGL'].company_id}` : (stockStats['EGL']?._id ? `/stock/${stockStats['EGL']._id}` : '/stock/EGL')} />
            <StockItem image="/assets/stocks/fanmilk.png" label="Fan Milk" code="FML" value={stockStats['FML']?.key_statistics?.current_price || ' '} change={Number(stockStats['FML']?.key_statistics?.percentage_change ?? 0)} link={stockStats['FML']?.company_id ? `/stock/${stockStats['FML'].company_id}` : (stockStats['FML']?._id ? `/stock/${stockStats['FML']._id}` : '/stock/FML')} />
            <StockItem image="/assets/stocks/first.webp" label="First Atlantic Bank" code="FAB" value={stockStats['FAB']?.key_statistics?.current_price || ' '} change={Number(stockStats['FAB']?.key_statistics?.percentage_change ?? 0)} link={stockStats['FAB']?.company_id ? `/stock/${stockStats['FAB'].company_id}` : (stockStats['FAB']?._id ? `/stock/${stockStats['FAB']._id}` : '/stock/FAB')} />
            <StockItem image="/assets/stocks/gcb.webp" label="GCB Bank" code="GCB" value={stockStats['GCB']?.key_statistics?.current_price || ' '} change={Number(stockStats['GCB']?.key_statistics?.percentage_change ?? 0)} link={stockStats['GCB']?.company_id ? `/stock/${stockStats['GCB'].company_id}` : (stockStats['GCB']?._id ? `/stock/${stockStats['GCB']._id}` : '/stock/GCB')} />
            <StockItem image="/assets/stocks/goil.svg" label="GOIL PLC" code="GOIL" value={stockStats['GOIL']?.key_statistics?.current_price || ' '} change={Number(stockStats['GOIL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['GOIL']?.company_id ? `/stock/${stockStats['GOIL'].company_id}` : (stockStats['GOIL']?._id ? `/stock/${stockStats['GOIL']._id}` : '/stock/GOIL')} />
            <StockItem image="/assets/stocks/guiness.svg" label="Guinness Ghana" code="GGBL" value={stockStats['GGBL']?.key_statistics?.current_price || ' '} change={Number(stockStats['GGBL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['GGBL']?.company_id ? `/stock/${stockStats['GGBL'].company_id}` : (stockStats['GGBL']?._id ? `/stock/${stockStats['GGBL']._id}` : '/stock/GGBL')} />
            <StockItem image="/assets/stocks/hords.png" label="Hords Ltd" code="HORDS" value={stockStats['HORDS']?.key_statistics?.current_price || ' '} change={Number(stockStats['HORDS']?.key_statistics?.percentage_change ?? 0)} link={stockStats['HORDS']?.company_id ? `/stock/${stockStats['HORDS'].company_id}` : (stockStats['HORDS']?._id ? `/stock/${stockStats['HORDS']._id}` : '/stock/HORDS')} />
            <StockItem image="/assets/stocks/iil.png" label="Intravenous Infusions" code="IIL" value={stockStats['IIL']?.key_statistics?.current_price || ' '} change={Number(stockStats['IIL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['IIL']?.company_id ? `/stock/${stockStats['IIL'].company_id}` : (stockStats['IIL']?._id ? `/stock/${stockStats['IIL']._id}` : '/stock/IIL')} />
            <StockItem image="/assets/stocks/mega.webp" label="Mega African Capital" code="MAC" value={stockStats['MAC']?.key_statistics?.current_price || ' '} change={Number(stockStats['MAC']?.key_statistics?.percentage_change ?? 0)} link={stockStats['MAC']?.company_id ? `/stock/${stockStats['MAC'].company_id}` : (stockStats['MAC']?._id ? `/stock/${stockStats['MAC']._id}` : '/stock/MAC')} />
            <StockItem image="/assets/stocks/meridian.jpg" label="Meridian-Marshalls" code="MMH" value={stockStats['MMH']?.key_statistics?.current_price || ' '} change={Number(stockStats['MMH']?.key_statistics?.percentage_change ?? 0)} link={stockStats['MMH']?.company_id ? `/stock/${stockStats['MMH'].company_id}` : (stockStats['MMH']?._id ? `/stock/${stockStats['MMH']._id}` : '/stock/MMH')} />
            <StockItem image="/assets/stocks/mtn.svg" label="MTN Ghana" code="MTNGH" value={stockStats['MTNGH']?.key_statistics?.current_price || ' '} change={Number(stockStats['MTNGH']?.key_statistics?.percentage_change ?? 0)} link={stockStats['MTNGH']?.company_id ? `/stock/${stockStats['MTNGH'].company_id}` : (stockStats['MTNGH']?._id ? `/stock/${stockStats['MTNGH']._id}` : '/stock/MTNGH')} />
            <StockItem image="/assets/stocks/newgold.png" label="NewGold ETF" code="GLD" value={stockStats['GLD']?.key_statistics?.current_price || ' '} change={Number(stockStats['GLD']?.key_statistics?.percentage_change ?? 0)} link={stockStats['GLD']?.company_id ? `/stock/${stockStats['GLD'].company_id}` : (stockStats['GLD']?._id ? `/stock/${stockStats['GLD']._id}` : '/stock/GLD')} />
            <StockItem image="/assets/stocks/pbc.jpg" label="Produce Buying Co." code="PBC" value={stockStats['PBC']?.key_statistics?.current_price || ' '} change={Number(stockStats['PBC']?.key_statistics?.percentage_change ?? 0)} link={stockStats['PBC']?.company_id ? `/stock/${stockStats['PBC'].company_id}` : (stockStats['PBC']?._id ? `/stock/${stockStats['PBC']._id}` : '/stock/PBC')} />
            <StockItem image="/assets/stocks/republic.webp" label="Republic Bank" code="RBGH" value={stockStats['RBGH']?.key_statistics?.current_price || ' '} change={Number(stockStats['RBGH']?.key_statistics?.percentage_change ?? 0)} link={stockStats['RBGH']?.company_id ? `/stock/${stockStats['RBGH'].company_id}` : (stockStats['RBGH']?._id ? `/stock/${stockStats['RBGH']._id}` : '/stock/RBGH')} />
            <StockItem image="/assets/stocks/samba.jpg" label="Samba Foods" code="SAMBA" value={stockStats['SAMBA']?.key_statistics?.current_price || ' '} change={Number(stockStats['SAMBA']?.key_statistics?.percentage_change ?? 0)} link={stockStats['SAMBA']?.company_id ? `/stock/${stockStats['SAMBA'].company_id}` : (stockStats['SAMBA']?._id ? `/stock/${stockStats['SAMBA']._id}` : '/stock/SAMBA')} />
            <StockItem image="/assets/stocks/sic.png" label="SIC Insurance" code="SIC" value={stockStats['SIC']?.key_statistics?.current_price || ' '} change={Number(stockStats['SIC']?.key_statistics?.percentage_change ?? 0)} link={stockStats['SIC']?.company_id ? `/stock/${stockStats['SIC'].company_id}` : (stockStats['SIC']?._id ? `/stock/${stockStats['SIC']._id}` : '/stock/SIC')} />
            <StockItem image="/assets/stocks/societe-general.svg" label="Societe Generale" code="SOGEGH" value={stockStats['SOGEGH']?.key_statistics?.current_price || ' '} change={Number(stockStats['SOGEGH']?.key_statistics?.percentage_change ?? 0)} link={stockStats['SOGEGH']?.company_id ? `/stock/${stockStats['SOGEGH'].company_id}` : (stockStats['SOGEGH']?._id ? `/stock/${stockStats['SOGEGH']._id}` : '/stock/SOGEGH')} />
            <StockItem image="/assets/stocks/standard-chartered.svg" label="Standard Chartered" code="SCB" value={stockStats['SCB']?.key_statistics?.current_price || ' '} change={Number(stockStats['SCB']?.key_statistics?.percentage_change ?? 0)} link={stockStats['SCB']?.company_id ? `/stock/${stockStats['SCB'].company_id}` : (stockStats['SCB']?._id ? `/stock/${stockStats['SCB']._id}` : '/stock/SCB')} />
            <StockItem image="/assets/stocks/standard-chartered.svg" label="StanChart Preference" code="SCBPREF" value={stockStats['SCBPREF']?.key_statistics?.current_price || ' '} change={Number(stockStats['SCBPREF']?.key_statistics?.percentage_change ?? 0)} link={stockStats['SCBPREF']?.company_id ? `/stock/${stockStats['SCBPREF'].company_id}` : (stockStats['SCBPREF']?._id ? `/stock/${stockStats['SCBPREF']._id}` : '/stock/SCBPREF')} />
            <StockItem image="/assets/stocks/total.svg" label="TotalEnergies" code="TOTAL" value={stockStats['TOTAL']?.key_statistics?.current_price || ' '} change={Number(stockStats['TOTAL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['TOTAL']?.company_id ? `/stock/${stockStats['TOTAL'].company_id}` : (stockStats['TOTAL']?._id ? `/stock/${stockStats['TOTAL']._id}` : '/stock/TOTAL')} />
            <StockItem image="/assets/stocks/trustbank.jpg" label="Trust Bank Gambia" code="TBL" value={stockStats['TBL']?.key_statistics?.current_price || ' '} change={Number(stockStats['TBL']?.key_statistics?.percentage_change ?? 0)} link={stockStats['TBL']?.company_id ? `/stock/${stockStats['TBL'].company_id}` : (stockStats['TBL']?._id ? `/stock/${stockStats['TBL']._id}` : '/stock/TBL')} />
            <StockItem image="/assets/stocks/tullow-oil.svg" label="Tullow Oil" code="TLW" value={stockStats['TLW']?.key_statistics?.current_price || ' '} change={Number(stockStats['TLW']?.key_statistics?.percentage_change ?? 0)} link={stockStats['TLW']?.company_id ? `/stock/${stockStats['TLW'].company_id}` : (stockStats['TLW']?._id ? `/stock/${stockStats['TLW']._id}` : '/stock/TLW')} />
          </OtherContainer>

          <ChartFooter>
            <DataSource>Source: Central Bank of Ghana</DataSource>
            <LastUpdated>
            Last updated: {gseData?.last_updated 
              ? new Date(gseData.last_updated).toLocaleString() 
              : ' '}
            </LastUpdated>
          </ChartFooter>
        </ChartItem>

        <ChartItem>
          <Header>
            <HeaderText>Cryptocurrencies</HeaderText>
            <Currency>
              <StockItem
                image="/assets/crypto/bitcoin.svg"
                label="Bitcoin"
                code="Bitcoin"
                value={formatValue(bitcoinData?.current_price, '$')}
                change={Number((bitcoinData?.price_change_percentage_24h ?? 0).toFixed(2))}
              />
            </Currency>
          </Header>

          <IndexChart
            data={bitcoinChartData}
            color={bitcoinData?.current_price >= 0 ? "#13D14C" : "#FF0606"}
            height={400}
            showGrid
            xAxisOptions={{
              tickFormatter: xAxisTickFormatter,
              tickRotation: -45,
              interval: Math.ceil(bitcoinChartData.length / 10)
            }}
            yAxisOptions={{
              tickFormat: (value: number) => value.toFixed(2),
              domain: ['dataMin - 0.5', 'dataMax + 0.5'],
              label: {
                value: 'USD',
                angle: -90,
                position: 'insideLeft'
              }
            }}
            lineOptions={{
              strokeWidth: 2,
              curveType: 'monotone',
              showDot: false
            }}
            margin={{ left: 50, right: 20, top: 20, bottom: 12 }}
            tooltipFormatter={(data) => formatTooltip(data, 'value', 'bitcoin')}
          />

          <OtherContainer>
            <Header>
              <SubHeader>Other Cryptocurrencies</SubHeader>
            </Header>
            <StockItem image="/assets/crypto/ethereum.svg" label="Ethereum" code="Ethereum" value={formatValue(ethereumData?.current_price, '$')} change={Number((ethereumData?.price_change_percentage_24h ?? 0).toFixed(2))} />
            <StockItem image="/assets/crypto/tether.svg" label="Tether" code="Tether" value={formatValue(tetherData?.current_price, '$')} change={Number((tetherData?.price_change_percentage_24h ?? 0).toFixed(2))} />
            <StockItem image="/assets/crypto/xrp.svg" label="XRP" code="XRP" value={formatValue(xrpData?.current_price, '$')} change={Number((xrpData?.price_change_percentage_24h ?? 0).toFixed(2))}/>
            <StockItem image="/assets/crypto/binance.svg" label="Binance" code="Binance" value={formatValue(binanceData?.current_price, '$')} change={Number((binanceData?.price_change_percentage_24h ?? 0).toFixed(2))} />
            <StockItem image="/assets/crypto/chainlink.svg" label="Chainlink" code="Chainlink" value={formatValue(chainlinkData?.current_price, '$')} change={Number((chainlinkData?.price_change_percentage_24h ?? 0).toFixed(2))} />
            <StockItem image="/assets/crypto/cardano.svg" label="Cardano" code="Cardano" value={formatValue(cardanoData?.current_price, '$')} change={Number((cardanoData?.price_change_percentage_24h ?? 0).toFixed(2))} />
            <StockItem image="/assets/crypto/dogecoin.svg" label="Dogecoin" code="Dogecoin" value={formatValue(dogecoinData?.current_price, '$')} change={Number((dogecoinData?.price_change_percentage_24h ?? 0).toFixed(2))} />
          </OtherContainer>

          <ChartFooter>
            <DataSource>Source: Central Bank of Ghana</DataSource>
            <LastUpdated>
            Last updated: {bitcoinData?.last_updated 
              ? new Date(bitcoinData.last_updated).toLocaleString() 
              : ' '}
            </LastUpdated>
          </ChartFooter>
        </ChartItem>
      </Wrapper>
    </PageWrapper>
  );
}