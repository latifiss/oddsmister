import axios from 'axios';

// Match backend routes: http://afx.21centurynews.com/api/stocks/equity/...
const BASE_URL = 'http://afx.21centurynews.com/api/stocks/equity';

export interface AboutSchema {
  company_name: string;
  slug: string;
  year_founded: string;
  industry: string;
  isin_symbol?: string;
  website?: string;
  headquaters: string;
  exchange_symbol: string;
  ticker_symbol: string;
  unique_symbol: string;
  company_description: string;
  number_of_employees?: string;
  country: string;
  currency: string;
  chief_executive_officer?: string;
}

export interface SharesInfo {
  exchange_listed_name?: string;
  exchange_code?: string;
  exchange_slug?: string;
  date_listed?: string;
  authorized_shares?: string;
  issued_shares?: string;
}

export interface Profile {
  _id?: string;
  company_id: string;
  about: AboutSchema;
  shares: SharesInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface KeyStatsSchema {
  market_capitalization?: string;
  price_earning_ratio?: number;
  volume?: number;
  revenue?: string;
  revenue_currency?: string;
  netIncome?: string;
  netIncome_currency?: string;
  dividend_yield?: number;
  dividend_per_share?: number;
  earnings_per_share?: number;
  shares_outstanding?: string;
  fifty_two_week_high?: number;
  fifty_two_week_high_date?: string;
  fifty_two_week_low?: number;
  fifty_two_week_low_date?: string;
  bid_size?: string;
  bid_price?: string;
  ask_size?: string;
  ask_price?: string;
  last_trade_price?: string;
  last_trade_volume?: string;
  trade_value?: string;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  percentage_change?: number;
  currency: string;
  current_price: string;
  status: 'open' | 'suspended' | 'closed';
  status_message?: string;
}

export interface ReturnsSchema {
  five_days_returns?: number;
  one_month_returns?: number;
  three_months_returns?: number;
  one_year_returns?: number;
}

export interface GrowthValuation {
  earnings_per_share?: number;
  price_earning_ratio?: number;
  dividend_per_share?: number;
  dividend_yield?: string;
  shares_outstanding?: string;
  market_capitalization?: string;
}

export interface KeyStatsHistory {
  date: Date | string;
  market_capitalization?: string;
  price_earning_ratio?: number;
  current_price?: string;
  volume?: number;
  dividend_yield?: number;
  earnings_per_share?: number;
}

export interface Statistics {
  _id?: string;
  company_id: string;
  company_name: string;
  ticker_symbol: string;
  key_statistics: KeyStatsSchema;
  returns: ReturnsSchema;
  growth_valuation: GrowthValuation;
  key_stats_history: KeyStatsHistory[];
  last_updated: Date | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DividendHistory {
  payment_date: Date | string;
  declaration_date?: Date | string;
  record_date?: Date | string;
  ex_dividend_date?: Date | string;
  amount: number;
  amount_currency: string;
  dividend_type: 'regular' | 'special' | 'extra' | 'interim' | 'final' | 'other';
  fiscal_year?: number;
  added_to_history?: Date | string;
}

export interface DividendEvents {
  next_dividend_pay_date?: Date | string;
  last_dividend_pay_date?: Date | string;
  dividend_growth?: string;
}

export interface DividendSummary {
  annual_dividend?: number;
  dividend_frequency?: 'quarterly' | 'semi-annual' | 'annual' | 'monthly' | 'irregular' | 'none';
  years_consecutive_increase?: number;
  average_yield_5yr?: number;
}

export interface Dividends {
  _id?: string;
  company_id: string;
  company_name: string;
  ticker_symbol: string;
  events: DividendEvents;
  dividend_history: DividendHistory[];
  summary: DividendSummary;
  last_updated: Date | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EarningsHistory {
  period: string;
  period_type: 'quarterly' | 'annual' | 'semi-annual';
  report_date: Date | string;
  earnings_per_share?: number;
  revenue?: number;
  revenue_currency?: string;
  net_income?: number;
  net_income_currency?: string;
  eps_estimate?: number;
  revenue_estimate?: number;
  surprise_percentage?: number;
  added_to_history?: Date | string;
}

export interface EarningsEvents {
  next_earnings_date?: Date | string;
  next_earnings_estimated_eps?: number;
  next_earnings_estimated_revenue?: number;
}

export interface AnnualNetIncomeHistory {
  for_year: number;
  value: number;
  value_currency: string;
  added_to_history?: Date | string;
}

export interface QuarterlyNetIncomeHistory {
  for_quarter: string;
  for_year: number;
  value: number;
  value_currency: string;
  added_to_history?: Date | string;
}

export interface Earnings {
  _id?: string;
  company_id: string;
  company_name: string;
  ticker_symbol: string;
  events: EarningsEvents;
  earnings_history: EarningsHistory[];
  annual_net_income_history: AnnualNetIncomeHistory[];
  quarterly_net_income_history: QuarterlyNetIncomeHistory[];
  last_updated: Date | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialStatement {
  period: string;
  period_type: 'quarterly' | 'annual';
  statement_date?: Date | string;
  revenue?: number;
  cost_of_goods_sold?: number;
  gross_profit?: number;
  operating_expenses?: number;
  operating_income?: number;
  interest_expense?: number;
  taxes?: number;
  net_income?: number;
  total_assets?: number;
  total_liabilities?: number;
  total_equity?: number;
  cash_and_equivalents?: number;
  operating_cash_flow?: number;
  investing_cash_flow?: number;
  financing_cash_flow?: number;
  free_cash_flow?: number;
  gross_margin?: number;
  operating_margin?: number;
  net_margin?: number;
  current_ratio?: number;
  debt_to_equity?: number;
  currency: string;
  added_to_history?: Date | string;
}

export interface AnnualRevenueHistory {
  for_year: number;
  value: number;
  value_currency: string;
  added_to_history?: Date | string;
}

export interface QuarterlyRevenueHistory {
  for_quarter: string;
  for_year: number;
  value: number;
  value_currency: string;
  added_to_history?: Date | string;
}

export interface AnnualNetMarginHistory {
  for_year: number;
  value: number;
  added_to_history?: Date | string;
}

export interface QuarterlyNetMarginHistory {
  for_quarter: string;
  for_year: number;
  value: number;
  added_to_history?: Date | string;
}

export interface RevenueBreakdown {
  for_year?: number;
  for_quarter?: string;
  title?: string;
  title_value?: number;
  value_currency?: string;
  added_to_history?: Date | string;
}

export interface RevenueToProfitConversion {
  revenue?: number;
  cogs?: number;
  gross_profit?: number;
  operating_expenses?: number;
  operating_income?: number;
  non_operating_income_expenses?: number;
  taxes_and_other?: number;
  net_income?: number;
}

export interface DebtLevelAndCoverage {
  for_year?: number;
  for_quarter?: string;
  debt_value?: number;
  free_cash_flow_value?: number;
  cash_and_equivalents_value?: number;
  value_currency?: string;
  added_to_history?: Date | string;
}

export interface FinancialSummary {
  latest_revenue?: number;
  latest_net_income?: number;
  total_assets?: number;
  total_debt?: number;
  profit_margin?: number;
  roe?: number;
  roa?: number;
  as_of_date?: Date | string;
}

export interface Financial {
  _id?: string;
  company_id: string;
  company_name: string;
  ticker_symbol: string;
  annual_revenue_history: AnnualRevenueHistory[];
  quarterly_revenue_history: QuarterlyRevenueHistory[];
  annual_net_margin_history: AnnualNetMarginHistory[];
  quarterly_net_margin_history: QuarterlyNetMarginHistory[];
  annual_revenue_breakdown: RevenueBreakdown[];
  quarterly_revenue_breakdown: RevenueBreakdown[];
  annual_revenue_to_profit_conversion: RevenueToProfitConversion;
  quarterly_revenue_to_profit_conversion: RevenueToProfitConversion;
  annual_debt_level_and_coverage: DebtLevelAndCoverage[];
  quarterly_debt_level_and_coverage: DebtLevelAndCoverage[];
  financial_statements: FinancialStatement[];
  financial_summary: FinancialSummary;
  last_updated: Date | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Shareholder {
  holder_name?: string;
  holder_type?: 'institution' | 'insider' | 'mutual_fund' | 'etf' | 'other' | 'pension_fund';
  shares_held?: number;
  shares_percent?: number;
  date_reported?: Date | string;
  change?: number;
  change_percent?: number;
  market_value?: number;
  market_value_currency?: string;
}

export interface InstitutionalHolder {
  institution_name?: string;
  shares_held?: number;
  shares_percent?: number;
  date_reported?: Date | string;
}

export interface InsiderTransaction {
  insider_name?: string;
  position?: string;
  transaction_date?: Date | string;
  transaction_type: 'buy' | 'sell' | 'option_exercise' | 'Grant/Award' | 'other';
  shares?: number;
  price_per_share?: number;
  total_value?: number;
}

export interface OwnershipSummary {
  percent_institutions?: number;
  percent_insiders?: number;
  percent_public?: number;
  shares_float?: number;
  shares_outstanding?: number;
  as_of_date?: Date | string;
  percent_shares_held_by_all_insiders?: number;
  percent_shares_held_by_institutions?: number;
  percent_float_held_by_institutions?: number;
  number_of_institutions?: number;
  calculated_percent_public?: number;
}

export interface InstitutionalOwnershipHistory {
  date?: Date | string;
  percent_institutions?: number;
  number_institutions?: number;
  percent_shares_held_by_all_insiders?: number;
  percent_shares_held_by_institutions?: number;
  percent_float_held_by_institutions?: number;
  added_to_history?: Date | string;
}

export interface Holders {
  _id?: string;
  company_id: string;
  company_name: string;
  ticker_symbol: string;
  ownership_summary: OwnershipSummary;
  top_institutional_holders: InstitutionalHolder[];
  top_mutual_fund_holders: Shareholder[];
  top_etf_holders: Shareholder[];
  top_insider_holders: Shareholder[];
  recent_insider_transactions: InsiderTransaction[];
  institutional_ownership_history: InstitutionalOwnershipHistory[];
  last_updated: Date | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceHistoryEntry {
  date: Date | string;
  price: string;
}

export interface PriceHistory {
  _id?: string;
  company_id: string;
  company_name: string;
  ticker_symbol: string;
  history: PriceHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyAllData {
  profile: Profile;
  statistics: Statistics;
  dividends: Dividends;
  earnings: Earnings;
  financial: Financial;
  holders: Holders;
  priceHistory: PriceHistory;
}

export interface ApiResponse<T> {
  status: string;
  cached?: boolean;
  results?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  data: T;
  message?: string;
}

export const createProfile = async (profileData: Profile): Promise<ApiResponse<{ profile: Profile }>> => {
  const res = await axios.post(`${BASE_URL}/profiles`, profileData);
  return res.data;
};

export const getProfileByCompanyId = async (company_id: string): Promise<ApiResponse<{ profile: Profile }>> => {
  const res = await axios.get(`${BASE_URL}/profiles/${company_id}`);
  return res.data;
};

export const updateProfile = async (company_id: string, profileData: Partial<Profile>): Promise<ApiResponse<{ profile: Profile }>> => {
  const res = await axios.put(`${BASE_URL}/profiles/${company_id}`, profileData);
  return res.data;
};

export const deleteProfile = async (company_id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/profiles/${company_id}`);
  return res.data;
};

export const createStatistics = async (statisticsData: Statistics): Promise<ApiResponse<{ statistics: Statistics }>> => {
  const res = await axios.post(`${BASE_URL}/statistics`, statisticsData);
  return res.data;
};

export const getStatisticsByCompanyId = async (company_id: string): Promise<ApiResponse<{ statistics: Statistics }>> => {
  const res = await axios.get(`${BASE_URL}/statistics/${company_id}`);
  return res.data;
};

export const updateStatistics = async (company_id: string, statisticsData: Partial<Statistics>): Promise<ApiResponse<{ statistics: Statistics }>> => {
  const res = await axios.put(`${BASE_URL}/statistics/${company_id}`, statisticsData);
  return res.data;
};

export const deleteStatistics = async (company_id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/statistics/${company_id}`);
  return res.data;
};

export const createDividends = async (dividendsData: Dividends): Promise<ApiResponse<{ dividends: Dividends }>> => {
  const res = await axios.post(`${BASE_URL}/dividends`, dividendsData);
  return res.data;
};

export const getDividendsByCompanyId = async (company_id: string): Promise<ApiResponse<{ dividends: Dividends }>> => {
  const res = await axios.get(`${BASE_URL}/dividends/${company_id}`);
  return res.data;
};

export const updateDividends = async (company_id: string, dividendsData: Partial<Dividends>): Promise<ApiResponse<{ dividends: Dividends }>> => {
  const res = await axios.put(`${BASE_URL}/dividends/${company_id}`, dividendsData);
  return res.data;
};

export const deleteDividends = async (company_id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/dividends/${company_id}`);
  return res.data;
};

export const createEarnings = async (earningsData: Earnings): Promise<ApiResponse<{ earnings: Earnings }>> => {
  const res = await axios.post(`${BASE_URL}/earnings`, earningsData);
  return res.data;
};

export const getEarningsByCompanyId = async (company_id: string): Promise<ApiResponse<{ earnings: Earnings }>> => {
  const res = await axios.get(`${BASE_URL}/earnings/${company_id}`);
  return res.data;
};

export const updateEarnings = async (company_id: string, earningsData: Partial<Earnings>): Promise<ApiResponse<{ earnings: Earnings }>> => {
  const res = await axios.put(`${BASE_URL}/earnings/${company_id}`, earningsData);
  return res.data;
};

export const deleteEarnings = async (company_id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/earnings/${company_id}`);
  return res.data;
};

export const createFinancial = async (financialData: Financial): Promise<ApiResponse<{ financial: Financial }>> => {
  const res = await axios.post(`${BASE_URL}/financial`, financialData);
  return res.data;
};

export const getFinancialByCompanyId = async (company_id: string): Promise<ApiResponse<{ financial: Financial }>> => {
  const res = await axios.get(`${BASE_URL}/financial/${company_id}`);
  return res.data;
};

export const updateFinancial = async (company_id: string, financialData: Partial<Financial>): Promise<ApiResponse<{ financial: Financial }>> => {
  const res = await axios.put(`${BASE_URL}/financial/${company_id}`, financialData);
  return res.data;
};

export const deleteFinancial = async (company_id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/financial/${company_id}`);
  return res.data;
};

export const createHolders = async (holdersData: Holders): Promise<ApiResponse<{ holders: Holders }>> => {
  const res = await axios.post(`${BASE_URL}/holders`, holdersData);
  return res.data;
};

export const getHoldersByCompanyId = async (company_id: string): Promise<ApiResponse<{ holders: Holders }>> => {
  const res = await axios.get(`${BASE_URL}/holders/${company_id}`);
  return res.data;
};

export const updateHolders = async (company_id: string, holdersData: Partial<Holders>): Promise<ApiResponse<{ holders: Holders }>> => {
  const res = await axios.put(`${BASE_URL}/holders/${company_id}`, holdersData);
  return res.data;
};

export const deleteHolders = async (company_id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/holders/${company_id}`);
  return res.data;
};

export const createPriceHistory = async (priceHistoryData: PriceHistory): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.post(`${BASE_URL}/price-history`, priceHistoryData);
  return res.data;
};

export const getCompanyPriceHistory = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}`);
  return res.data;
};

export const updatePriceHistory = async (company_id: string, priceHistoryData: Partial<PriceHistory>): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.put(`${BASE_URL}/price-history/${company_id}`, priceHistoryData);
  return res.data;
};

export const deletePriceHistory = async (company_id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/price-history/${company_id}`);
  return res.data;
};

export const getCompanyPriceHistoryByLast24Hours = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/24h`);
  return res.data;
};

export const getCompanyPriceHistoryByLast1Week = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/1w`);
  return res.data;
};

export const getCompanyPriceHistoryByLast3Months = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/3m`);
  return res.data;
};

export const getCompanyPriceHistoryByLast6Months = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/6m`);
  return res.data;
};

export const getCompanyPriceHistoryByYearToDate = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/ytd`);
  return res.data;
};

export const getCompanyPriceHistoryByLast1Year = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/1y`);
  return res.data;
};

export const getCompanyPriceHistoryByLast2Years = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/2y`);
  return res.data;
};

export const getCompanyPriceHistoryByLast5Years = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/5y`);
  return res.data;
};

export const getCompanyPriceHistoryByLast10Years = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/10y`);
  return res.data;
};

export const getCompanyAllTimePriceHistory = async (company_id: string): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.get(`${BASE_URL}/price-history/${company_id}/all`);
  return res.data;
};

export const addPriceEntry = async (company_id: string, priceEntry: PriceHistoryEntry): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.post(`${BASE_URL}/price-history/${company_id}/entries`, priceEntry);
  return res.data;
};

export const updateLatestPrice = async (company_id: string, priceData: { price: string }): Promise<ApiResponse<{ priceHistory: PriceHistory }>> => {
  const res = await axios.put(`${BASE_URL}/price-history/${company_id}/latest`, priceData);
  return res.data;
};

export const getCompanyAllData = async (company_id: string): Promise<ApiResponse<CompanyAllData>> => {
  const res = await axios.get(`${BASE_URL}/company/${company_id}/all`);
  return res.data;
};

const stocksApi = {
  createProfile,
  getProfileByCompanyId,
  updateProfile,
  deleteProfile,
  
  createStatistics,
  getStatisticsByCompanyId,
  updateStatistics,
  deleteStatistics,
  
  createDividends,
  getDividendsByCompanyId,
  updateDividends,
  deleteDividends,
  
  createEarnings,
  getEarningsByCompanyId,
  updateEarnings,
  deleteEarnings,
  
  createFinancial,
  getFinancialByCompanyId,
  updateFinancial,
  deleteFinancial,
  
  createHolders,
  getHoldersByCompanyId,
  updateHolders,
  deleteHolders,
  
  createPriceHistory,
  getCompanyPriceHistory,
  updatePriceHistory,
  deletePriceHistory,
  getCompanyPriceHistoryByLast24Hours,
  getCompanyPriceHistoryByLast1Week,
  getCompanyPriceHistoryByLast3Months,
  getCompanyPriceHistoryByLast6Months,
  getCompanyPriceHistoryByYearToDate,
  getCompanyPriceHistoryByLast1Year,
  getCompanyPriceHistoryByLast2Years,
  getCompanyPriceHistoryByLast5Years,
  getCompanyPriceHistoryByLast10Years,
  getCompanyAllTimePriceHistory,
  addPriceEntry,
  updateLatestPrice,
  
  getCompanyAllData,
};

export default stocksApi;