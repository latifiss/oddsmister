import StockPageClient from './client';
import type { Metadata } from 'next';
import stocksApi from '@/lib/api/stocks';

type Props = {
  params: Promise<{ company_id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company_id } = await params;
  
  try {
    const [profileRes, statisticsRes] = await Promise.allSettled([
      stocksApi.getProfileByCompanyId(company_id),
      stocksApi.getStatisticsByCompanyId(company_id)
    ]);

    const profile = profileRes.status === 'fulfilled' 
      ? (profileRes.value?.data?.profile || profileRes.value?.profile || profileRes.value?.data || profileRes.value)
      : null;
    
    const statistics = statisticsRes.status === 'fulfilled'
      ? (statisticsRes.value?.data?.statistics || statisticsRes.value?.statistics || statisticsRes.value?.data || statisticsRes.value)
      : null;

    const companyName = profile?.company_name || profile?.name || 'Company';
    const ticker = profile?.ticker_symbol || company_id;
    const currentPrice = statistics?.key_statistics?.current_price || '0.00';
    const priceChange = statistics?.key_statistics?.percentage_change || 0;
    const changeText = priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`;

    return {
      title: `${ticker} | ${companyName} | Ghanapolitan`,
      description: `Stock information for ${companyName} (${ticker}) - Current price: ${currentPrice} (${changeText}). View financials, earnings, dividends, and ownership data.`,
      openGraph: {
        title: `${ticker} | ${companyName} | Ghanapolitan`,
        description: `Stock information for ${companyName} (${ticker}) - Current price: ${currentPrice} (${changeText})`,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: `${ticker} | ${companyName} | Ghanapolitan`,
        description: `Stock information for ${companyName} (${ticker}) - Current price: ${currentPrice} (${changeText})`,
      },
      keywords: [companyName, ticker, 'stock', 'Ghana Stock Exchange', 'GSE', 'investing', 'shares', 'trading'],
    };
  } catch {
    return {
      title: 'Stock | Ghanapolitan',
      description: 'Stock information on Ghana Stock Exchange',
    };
  }
}

async function getCompanyData(companyId: string) {
  try {
    const [
      profileRes,
      statisticsRes,
      dividendsRes,
      earningsRes,
      financialRes,
      holdersRes,
      priceHistoryRes
    ] = await Promise.allSettled([
      stocksApi.getProfileByCompanyId(companyId),
      stocksApi.getStatisticsByCompanyId(companyId),
      stocksApi.getDividendsByCompanyId(companyId),
      stocksApi.getEarningsByCompanyId(companyId),
      stocksApi.getFinancialByCompanyId(companyId),
      stocksApi.getHoldersByCompanyId(companyId),
      stocksApi.getCompanyPriceHistory(companyId)
    ]);

    const extractData = (result: PromiseSettledResult<any>, dataKey?: string) => {
      if (result.status === 'rejected') {
        return null;
      }
      
      const response = result.value;
      
      if (response.data) {
        if (dataKey && response.data[dataKey]) {
          return response.data[dataKey];
        }
        return response.data;
      }
      
      return response;
    };

    const companyData = {
      profile: extractData(profileRes, 'profile') || 
              (profileRes.status === 'fulfilled' ? profileRes.value : null),
      statistics: extractData(statisticsRes, 'statistics') || 
                 (statisticsRes.status === 'fulfilled' ? statisticsRes.value : null),
      dividends: extractData(dividendsRes, 'dividends') || 
                (dividendsRes.status === 'fulfilled' ? dividendsRes.value : null),
      earnings: extractData(earningsRes, 'earnings') || 
               (earningsRes.status === 'fulfilled' ? earningsRes.value : null),
      financial: extractData(financialRes, 'financial') || 
                (financialRes.status === 'fulfilled' ? financialRes.value : null),
      holders: extractData(holdersRes, 'holders') || 
              (holdersRes.status === 'fulfilled' ? holdersRes.value : null),
      priceHistory: extractData(priceHistoryRes, 'priceHistory') || 
                   (priceHistoryRes.status === 'fulfilled' ? priceHistoryRes.value : null)
    };

    return companyData;
  } catch (error) {
    console.error('Error fetching company data:', error);
    return null;
  }
}

export default async function Page({ params }: Props) {
  const { company_id } = await params;
  const companyData = await getCompanyData(company_id);
  
  return <StockPageClient companyId={company_id} initialData={companyData} />;
}