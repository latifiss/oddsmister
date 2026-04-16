'use client';

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components';
import Image from 'next/image';

import IndexChartDemo from '@/components/idDemo';
import { StockItem } from '@/components/stockItem';
import OverviewTable from '@/components/tables/overview';
import FinHighlight from '@/components/tables/finHighlight';
import DividendTable from '@/components/tables/dividentTable';
import HolderTable from '@/components/tables/holderTable';
import OwnershipTable from '@/components/tables/ownershipTable';
import PerformanceChart from '@/components/charts/performanceChart';
import Card from '@/components/card';
import stocksApi, { Profile, Statistics, Dividends, Earnings, Financial, Holders, PriceHistory } from '@/lib/api/stocks';
import { getStockLogo } from '@/utils/getStockLogo';
import { formatPercentage } from '@/utils/percentageFormatter';
import { getArticlesByTag } from '@/lib/api/articles';
import type { Article } from '@/lib/api/articles';

const blink = keyframes`
    0% {
        box-shadow: 0 0 0 0px rgba(74,178,75, 0.7);
    }
    50% {
        box-shadow: 0 0 0 5px rgba(74,178,75, 0);
    }
    100% {
        box-shadow: 0 0 0 0px rgba(74,178,75, 0.7);
    }
`;

const MarketDot = styled.div<{ $isOpen: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ $isOpen }) => ($isOpen ? '#4ab24b' : '#00c1d1')};
    
    ${({ $isOpen }) => $isOpen && css`
        animation: ${blink} 1.5s infinite;
    `}
`;

const MarketStatusText = styled.p<{ $isOpen: boolean }>`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    margin: 0;
    font-family: inherit;
    color: ${({ $isOpen }) => ($isOpen ? '#4ab24b' : '#00c1d1')};
`;

const MarketStatus: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <React.Fragment>
        <MarketDot $isOpen={isOpen} />
        <MarketStatusText $isOpen={isOpen}>
            {isOpen ? 'Market Open' : 'Market Closed'}
        </MarketStatusText>
    </React.Fragment>
);

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 16px;
    margin-left: 100px;
    margin-right: 100px;
    margin-bottom: 100px;

    @media only screen and (max-width: 576px) { 
        padding-top: 12px;
        margin-left: 16px;
        margin-right: 16px;
        max-width: 100vw;
    }
    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        padding-top: 12px;
        margin-left: 16px;
        margin-right: 16px;
        max-width: 100vw;
    }
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 70% 30%;
    gap: 32px;
    position: relative;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1.5px;
        background: #e7e7e7;
        left: 70%;
        transform: translateX(-0.75px);
    }

    @media only screen and (max-width: 768px) {
        grid-template-columns: 1fr;
        &:before {
            display: none;
        }
    }
`;

const Left = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    padding: 16px 24px;

    @media only screen and (max-width: 576px) { 
    padding: 16px 0px;
  }

  @media only screen and (min-width: 577px) and (max-width: 768px) { 
    padding: 16px 0px;
  }
`;

const Right = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

const HeaderText = styled.p`
    font-size: 20px;
    line-height: 24px;
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

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;

    @media (max-width: 768px) {
        gap: 2px;
    }
`;

const StockHead = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    gap: 18px;
`;

const StockHeadInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
    margin-top: -12px;
`;

const StockTitle = styled.p`
    font-size: 40px;
    line-height: 48px;
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

const StockLogo = styled(Image)`
    object-fit: cover;
    width: 168px;
    height: 168px;
    border-radius: 99px;

    @media only screen and (max-width: 768px) {
        width: 68px;
        height: 68px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        width: 88px;
        height: 88px;
    }
`

const StockHeadInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    height: 36px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    padding: 0px 12px;

    @media only screen and (max-width: 768px) {
        margin-top: -12px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        margin-top: -8px;
    }
`

const StockSymbol = styled.p`
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};

    @media only screen and (max-width: 768px) {
        font-size: 17px;
        line-height: 20px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        font-size: 17px;
        line-height: 20px;
    }
`;

const StockDot = styled.p`
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};

    @media only screen and (max-width: 768px) {
        font-size: 13px;
        line-height: 13px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        font-size: 13px;
        line-height: 13px;
    }
`;

const StockExchange = styled.p`
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};

    @media only screen and (max-width: 768px) {
        font-size: 17px;
        line-height: 20px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        font-size: 17px;
        line-height: 20px;
    }
`;

const StockPriceRow = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    width: 100%;
    gap: 8px;
    margin-top: 2px;
    margin-bottom: 8px;

    @media only screen and (max-width: 768px) {
        margin-bottom: 13px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        margin-bottom: 13px;
    }
`;

const StockValueRow = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    width: fit-content;
    gap: 4px;
`;

const StockValue = styled.p`
    font-size: 38px;
    line-height: 38px;
    font-weight: 700;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};

    @media only screen and (max-width: 768px) {
        font-size: 28px;
        line-height: 28px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        font-size: 28px;
        line-height: 28px;
    }
`;

const StockCurrency = styled.p`
    font-size: 18px;
    line-height: 22px;
    font-weight: 700;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};

    @media only screen and (max-width: 768px) {
        font-size: 14px;
        line-height: 16px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        font-size: 14px;
        line-height: 16px;
    }
`;

const StockChange = styled.p<{ $isPositive: boolean; $isUnchanged: boolean }>`
    font-size: 28px;
    line-height: 32px;
    font-weight: 700;
    margin: 0;
    font-family: inherit;
    color: ${({ $isPositive, $isUnchanged }) => 
        $isUnchanged 
            ? '#727e8a' 
            : $isPositive 
                ? '#4ab24b' 
                : '#FF0606'};

    @media only screen and (max-width: 768px) {
        font-size: 21px;
        line-height: 21px;
    }

    @media only screen and (min-width: 769px) and (max-width: 992px) {
        font-size: 21px;
        line-height: 21px;
    }
`;

const InfoContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
`;

const TabsContainer = styled.div`
    display: flex;
    gap: 16px;
    width: 100%;
    overflow: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const TabButton = styled.button<{ $isActive: boolean }>`
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    background: transparent;
    border: none;
    width: fit-content;
    padding: 8px 0px;
    outline: none;
    cursor: pointer;
    color: ${({ $isActive }) => ($isActive ? '#2a5599' : '#888')};
    border-bottom: 2px solid ${({ $isActive }) => ($isActive ? '#2a5599' : 'transparent')};
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
`;

const TabContent = styled.div`
    margin-top: 16px;
    font-family: inherit;
    font-size: 14px;
    width: 100%;
    margin-right: 24px;

    @media only screen and (max-width: 576px) { 
    margin-right: 0px;
  }

  @media only screen and (min-width: 577px) and (max-width: 768px) { 
    margin-right: 0px;
  }
`;

const SectInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
`;

const SectInfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
`

const SectTextHead = styled.p`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.grayText};
    text-align: left;
`;

const SectTextBody = styled.p`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};
    text-align: right;
`;

const SectTextDesc = styled.p`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    margin: 0;
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
    margin-top: 8px;
`;

const TabContentInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
`;

const TabContentInnerGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 50px;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    @media only screen and (max-width: 576px) { 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }

  @media only screen and (min-width: 577px) and (max-width: 768px) { 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }
`;

const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: 12px 0px;
  gap: 12px;
`;

const ErrorText = styled.p`
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
    margin: 0;
    font-family: inherit;
    color: #FF0606;
    text-align: center;
    width: 100%;
    padding: 40px 0;
`;

const DebugContainer = styled.div`
    background: #f5f5f5;
    padding: 16px;
    border-radius: 8px;
    margin: 16px 0;
    font-family: monospace;
    font-size: 12px;
    max-height: 300px;
    overflow-y: auto;
`;

const formatDate = (timestamp?: string) => {
  if (!timestamp) return ' ';
  return new Date(timestamp).toLocaleString();
};

const getTagType = (article?: Article | null) => {
  if (!article) return '';
  if (article.tags && article.tags.length > 0) return article.tags[0];
  return article.category || '';
};

interface CompanyData {
  profile: Profile | null;
  statistics: Statistics | null;
  dividends: Dividends | null;
  earnings: Earnings | null;
  financial: Financial | null;
  holders: Holders | null;
  priceHistory: PriceHistory | null;
}

interface StockPageClientProps {
  companyId: string;
  initialData: CompanyData | null;
}

const StockPageClient = ({ companyId, initialData }: StockPageClientProps) => {
    const [isMarketOpen, setIsMarketOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [companyData, setCompanyData] = useState<CompanyData>(initialData || {
      profile: null,
      statistics: null,
      dividends: null,
      earnings: null,
      financial: null,
      holders: null,
      priceHistory: null
    });
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [newsArticles, setNewsArticles] = useState<Article[]>([]);
    const [moreStockStats, setMoreStockStats] = useState<Record<string, Statistics | null>>({});
    
    useEffect(() => {
        if (!initialData) {
            const fetchCompanyData = async () => {
                try {
                    setDebugInfo('Starting API calls...\n');
                    
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
                    
                    let debugLog = 'API Responses:\n';
                    debugLog += `Profile: ${profileRes.status} - ${profileRes.status === 'fulfilled' ? JSON.stringify(profileRes.value).substring(0, 200) + '...' : 'Rejected'}\n`;
                    debugLog += `Statistics: ${statisticsRes.status} - ${statisticsRes.status === 'fulfilled' ? JSON.stringify(statisticsRes.value).substring(0, 200) + '...' : 'Rejected'}\n`;
                    debugLog += `Dividends: ${dividendsRes.status} - ${dividendsRes.status === 'fulfilled' ? JSON.stringify(dividendsRes.value).substring(0, 200) + '...' : 'Rejected'}\n`;
                    debugLog += `Earnings: ${earningsRes.status} - ${earningsRes.status === 'fulfilled' ? JSON.stringify(earningsRes.value).substring(0, 200) + '...' : 'Rejected'}\n`;
                    debugLog += `Financial: ${financialRes.status} - ${financialRes.status === 'fulfilled' ? JSON.stringify(financialRes.value).substring(0, 200) + '...' : 'Rejected'}\n`;
                    debugLog += `Holders: ${holdersRes.status} - ${holdersRes.status === 'fulfilled' ? JSON.stringify(holdersRes.value).substring(0, 200) + '...' : 'Rejected'}\n`;
                    debugLog += `PriceHistory: ${priceHistoryRes.status} - ${priceHistoryRes.status === 'fulfilled' ? JSON.stringify(priceHistoryRes.value).substring(0, 200) + '...' : 'Rejected'}\n`;
                    
                    setDebugInfo(debugLog);
                    
                    const extractData = (result: PromiseSettledResult<any>, dataKey?: string) => {
                        if (result.status === 'rejected') {
                            console.error('API call rejected:', result.reason);
                            return null;
                        }
                        
                        const response = result.value;
                        console.log('API Response:', response);
                        
                        if (response.data) {
                            if (dataKey && response.data[dataKey]) {
                                return response.data[dataKey];
                            }
                            return response.data;
                        }
                        
                        return response;
                    };
                    
                    const newData: CompanyData = {
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
                    
                    console.log('Processed Company Data:', newData);
                    
                    setCompanyData(newData);
                    
                    if (newData.statistics?.key_statistics?.status) {
                        setIsMarketOpen(newData.statistics.key_statistics.status === 'open');
                    }
                    
                    if (!newData.profile && !newData.statistics) {
                      setError('Unable to load company data. Please try again.');
                    }
                    
                } catch (err) {
                    console.error('Error fetching company data:', err);
                    setError('Failed to load company data. Please try again later.');
                    setDebugInfo(prev => prev + `\nError: ${err}`);
                }
            };
            
            if (companyId) {
                fetchCompanyData();
            }
        } else {
            if (initialData.statistics?.key_statistics?.status) {
                setIsMarketOpen(initialData.statistics.key_statistics.status === 'open');
            }
        }
    }, [companyId, initialData]);

    useEffect(() => {
        const TICKERS = [
          'ACCESS','AADS','ASG','ALLGH','EGH','GCB','GOIL','GGBL','MTNGH',
          'SOGEGH','SCB','TOTAL','TLW','UNIL','SIC','RBGH','TBL','FML'
        ];

        const fetchMoreStocks = async () => {
          try {
            const results = await Promise.all(
              TICKERS.map(async (t) => {
                try {
                  const res = await stocksApi.getStatisticsByCompanyId(t);
                  const apiData: any = (res as any)?.data ?? res;
                  const stats = apiData?.statistics ?? apiData ?? null;
                  return { t, stats };
                } catch (err) {
                  console.error(`Error fetching stats for ${t}:`, err);
                  return { t, stats: null };
                }
              })
            );

            const map: Record<string, Statistics | null> = {};
            for (const r of results) {
              map[r.t] = r.stats;
            }
            setMoreStockStats(map);
          } catch (err) {
            console.error('Error fetching more stock statistics:', err);
          }
        };

        fetchMoreStocks();
    }, []);

    useEffect(() => {
        const name = companyData.profile?.about?.company_name;
        if (!name) return;

        const fetchArticles = async () => {
            try {
                const res = await getArticlesByTag(name, 1, 3);
                const articles = res?.data?.articles || [];
                setNewsArticles(articles.slice(0, 3));
            } catch (err) {
                console.error('Error fetching related articles:', err);
                setNewsArticles([]);
            }
        };

        fetchArticles();
    }, [companyData.profile]);
    
    const toggleMarket = () => {
        setIsMarketOpen(prev => !prev);
    };
    
    if (error || (!companyData.profile && !companyData.statistics)) {
        return (
            <PageWrapper>
                <ContentWrapper>
                    <Left>
                        <ErrorText>{error || 'Company not found'}</ErrorText>
                        {debugInfo && (
                            <DebugContainer>
                                <pre>{debugInfo}</pre>
                            </DebugContainer>
                        )}
                    </Left>
                </ContentWrapper>
            </PageWrapper>
        );
    }
    
    const { profile, statistics, dividends, earnings, financial, holders, priceHistory } = companyData;
    
    const about = profile?.about || {
      company_name: 'Company',
      ticker_symbol: '',
      exchange_symbol: 'GSE',
      industry: 'N/A',
      chief_executive_officer: 'N/A',
      number_of_employees: 'N/A',
      headquaters: 'N/A',
      year_founded: 'N/A',
      isin_symbol: 'N/A',
      company_description: 'No description available.',
      slug: '',
      country: 'Ghana',
      currency: 'GHS'
    };
    
    const keyStats = statistics?.key_statistics || {
      current_price: '0.00',
      percentage_change: 0,
      currency: 'GHS',
      status: 'closed'
    };
    
    const currentPrice = keyStats.current_price || '0.00';
    const priceChange = keyStats.percentage_change || 0;
    const isPositiveChange = priceChange > 0;
    const isUnchangedChange = priceChange === 0;
    const formattedChange = formatPercentage(priceChange);
    const currency = keyStats.currency || 'GHS';
    const tickerSymbol = about.ticker_symbol || '';
    const companyName = about.company_name || 'Company';
    const exchangeName = about.exchange_symbol ? `${about.exchange_symbol} Stock Exchange` : 'Ghana Stock Exchange';
    const logoUrl = getStockLogo(tickerSymbol);

    return (
        <PageWrapper>
            <ContentWrapper>
                <Left>
                    <StockHead>
                        <StockLogo 
                            src={logoUrl} 
                            alt={`${companyName} Logo`} 
                            width={168} 
                            height={168}
                        />
                        <StockHeadInner>
                            <StockTitle>{companyName}</StockTitle>
                            
                            <StockHeadInfo onClick={toggleMarket} title='Click to toggle market status'>
                                <StockSymbol>{tickerSymbol}</StockSymbol>
                                <StockDot>•</StockDot>
                                <StockExchange>{exchangeName}</StockExchange>
                            </StockHeadInfo>
                            
                            <StockPriceRow>
                                <StockValueRow>
                                    <StockValue>{currentPrice}</StockValue>
                                    <StockCurrency>{currency}</StockCurrency>
                                </StockValueRow>
                                <StockChange $isPositive={isPositiveChange} $isUnchanged={isUnchangedChange}>
                                    {formattedChange}
                                </StockChange>
                            </StockPriceRow>
                            <StockHeadInfo onClick={toggleMarket} title='Click to toggle market status'>
                                <MarketStatus isOpen={isMarketOpen} /> 
                            </StockHeadInfo>
                        </StockHeadInner>
                    </StockHead>
                    
                    <IndexChartDemo companyData={companyData} />
                    
                    <InfoContainer>
                        <TabsContainer>
                        {['Overview', 'Financials', 'Earnings & Dividends', 'Ownership'].map(tab => (
                            <TabButton
                                key={tab}
                                $isActive={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </TabButton>
                        ))}
                        </TabsContainer>

                        <TabContent>
                            {activeTab === 'Overview' && (
                                <TabContentInner>
                                    <OverviewTable companyData={companyData} />
                                    
                                    <TabContentInnerGrid>
                                        <PerformanceChart 
                                            financialData={companyData.financial}
                                            title="Financial Performance"
                                            companyId={companyId}
                                            />
                                    </TabContentInnerGrid>
                                    
                                    <SectInfo>
                                        <Header>
                                            <HeaderText>About</HeaderText>
                                        </Header>
                                        <SectInfoRow>
                                            <SectTextHead>Sector</SectTextHead>
                                            <SectTextBody>{about.industry}</SectTextBody>
                                        </SectInfoRow>
                                        <SectInfoRow>
                                            <SectTextHead>Industry</SectTextHead>
                                            <SectTextBody>{about.industry}</SectTextBody>
                                        </SectInfoRow>
                                        <SectInfoRow>
                                            <SectTextHead>CEO</SectTextHead>
                                            <SectTextBody>{about.chief_executive_officer}</SectTextBody>
                                        </SectInfoRow>
                                        <SectInfoRow>
                                            <SectTextHead>Employees</SectTextHead>
                                            <SectTextBody>{about.number_of_employees}</SectTextBody>
                                        </SectInfoRow>
                                        <SectInfoRow>
                                            <SectTextHead>Headquarters</SectTextHead>
                                            <SectTextBody>{about.headquaters}</SectTextBody>
                                        </SectInfoRow>
                                        <SectInfoRow>
                                            <SectTextHead>Founded</SectTextHead>
                                            <SectTextBody>{about.year_founded}</SectTextBody>
                                        </SectInfoRow>
                                        <SectInfoRow>
                                            <SectTextHead>ISIN</SectTextHead>
                                            <SectTextBody>{about.isin_symbol}</SectTextBody>
                                        </SectInfoRow>
                                        <SectTextDesc>
                                            {about.company_description}
                                        </SectTextDesc>
                                    </SectInfo>
                                </TabContentInner>
                            )}
                            
                            {activeTab === 'Financials' && (
                                <TabContentInner>
                                    <FinHighlight companyData={companyData} />
                                </TabContentInner>
                            )}
                            
                            {activeTab === 'Earnings & Dividends' && (
                                <TabContentInner>
                                    <DividendTable companyData={companyData} />
                                </TabContentInner>
                            )}
                            
                            {activeTab === 'Ownership' && (
                                <TabContentInner>
                                    <HolderTable companyData={companyData} />
                                    <OwnershipTable companyData={companyData} />
                                </TabContentInner>
                            )}
                        </TabContent>
                    </InfoContainer>
                </Left>

                <Right>
                    <Header>
                        <HeaderText>More Stocks on GSE</HeaderText>
                    </Header>
                    <Content>
                        <StockItem
                          image="/assets/stocks/access.svg"
                          label="Access Bank"
                          code="ACCESS"
                          value={moreStockStats['ACCESS']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['ACCESS']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/ACCESS"
                        />
                        <StockItem
                          image="/assets/stocks/anglogold.svg"
                          label="AngloGold Ashanti"
                          code="AGA"
                          value={moreStockStats['AADS']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['AADS']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/AADS"
                        />
                        <StockItem
                          image="/assets/stocks/asante-gold.svg"
                          label="Asante Gold"
                          code="ASG"
                          value={moreStockStats['ASG']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['ASG']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/ASG"
                        />
                        <StockItem
                          image="/assets/stocks/atlantic-lithium.svg"
                          label="Atlantic Lithium"
                          code="ALLGH"
                          value={moreStockStats['ALLGH']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['ALLGH']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/ALLGH"
                        />
                        <StockItem
                          image="/assets/stocks/ecobank.svg"
                          label="Ecobank"
                          code="EGH"
                          value={moreStockStats['EGH']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['EGH']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/EGH"
                        />
                        <StockItem
                          image="/assets/stocks/gcb.webp"
                          label="Ghana Commercial Bank"
                          code="GCB"
                          value={moreStockStats['GCB']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['GCB']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/GCB"
                        />
                        <StockItem
                          image="/assets/stocks/goil.svg"
                          label="Goil"
                          code="GOIL"
                          value={moreStockStats['GOIL']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['GOIL']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/GOIL"
                        />
                        <StockItem
                          image="/assets/stocks/guiness.svg"
                          label="Guinness Ghana"
                          code="GGBL"
                          value={moreStockStats['GGBL']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['GGBL']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/GGBL"
                        />
                        <StockItem
                          image="/assets/stocks/mtn.svg"
                          label="MTN"
                          code="MTNGH"
                          value={moreStockStats['MTNGH']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['MTNGH']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/MTNGH"
                        />
                        <StockItem
                          image="/assets/stocks/societe-general.svg"
                          label="Societe Generale"
                          code="SOGEGH"
                          value={moreStockStats['SOGEGH']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['SOGEGH']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/SOGEGH"
                        />
                        <StockItem
                          image="/assets/stocks/standard-chartered.svg"
                          label="Standard Chartered"
                          code="SCB"
                          value={moreStockStats['SCB']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['SCB']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/SCB"
                        />
                        <StockItem
                          image="/assets/stocks/total.svg"
                          label="TotalEnergies"
                          code="TOTAL"
                          value={moreStockStats['TOTAL']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['TOTAL']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/TOTAL"
                        />
                        <StockItem
                          image="/assets/stocks/tullow-oil.svg"
                          label="Tullow Oil"
                          code="TLW"
                          value={moreStockStats['TLW']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['TLW']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/TLW"
                        />
                        <StockItem
                          image="/assets/stocks/unilever.svg"
                          label="Unilever Ghana"
                          code="UNIL"
                          value={moreStockStats['UNIL']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['UNIL']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/UNIL"
                        />
                        <StockItem
                          image="/assets/stocks/sic.png"
                          label="SIC Insurance"
                          code="SIC"
                          value={moreStockStats['SIC']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['SIC']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/SIC"
                        />
                        <StockItem
                          image="/assets/stocks/republic.webp"
                          label="Republic Bank"
                          code="RBGH"
                          value={moreStockStats['RBGH']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['RBGH']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/RBGH"
                        />
                        <StockItem
                          image="/assets/stocks/trustbank.jpg"
                          label="Trust Bank Gambia"
                          code="TBL"
                          value={moreStockStats['TBL']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['TBL']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/TBL"
                        />
                        <StockItem
                          image="/assets/stocks/fanmilk.png"
                          label="Fan Milk"
                          code="FML"
                          value={moreStockStats['FML']?.key_statistics?.current_price || ' '}
                          change={Number(moreStockStats['FML']?.key_statistics?.percentage_change ?? 0)}
                          link="/stock/FML"
                        />
                    </Content>
                </Right>
            </ContentWrapper>
        </PageWrapper>
    )
}

export default StockPageClient;