import axios from 'axios';

const BASE_URL = 'http://afx.21centurynews.com/api'; 

export const getAllCompanies = async () => {
  const res = await axios.get(`${BASE_URL}/company`);
  return res.data;
};

export const getCompany = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/company/${id}`);
  return res.data;
};

export const getCompaniesFromCountry = async (country: string) => {
  const res = await axios.get(`${BASE_URL}/company/country/${country}`);
  return res.data;
};

export const getCompaniesFromExchange = async (exchangeName: string) => {
  const res = await axios.get(`${BASE_URL}/company/exchange/${exchangeName}`);
  return res.data;
};

export const getCompaniesFromIndustry = async (industry: string) => {
  const res = await axios.get(`${BASE_URL}/company/industry/${industry}`);
  return res.data;
};

export const getCompaniesFromIndustryInCountry = async (industry: string, country: string) => {
  const res = await axios.get(`${BASE_URL}/company/industry/${industry}/country/${country}`);
  return res.data;
};

export const getGroupCompaniesByIndustry = async () => {
  const res = await axios.get(`${BASE_URL}/company/group-by-industry`);
  return res.data;
};

export const getCompaniesFromIndustryInExchange = async (industry: string, exchangeName: string) => {
  const res = await axios.get(`${BASE_URL}/company/industry/${industry}/exchange/${exchangeName}`);
  return res.data;
};

export const getGroupCompaniesByIndustryInExchange = async (exchangeName: string) => {
  const res = await axios.get(`${BASE_URL}/company/group-by-industry/exchange/${exchangeName}`);
  return res.data;
};

export const getIndustryPerformanceInExchange = async (exchangeName: string) => {
  const res = await axios.get(`${BASE_URL}/company/industry-performance/exchange/${exchangeName}`);
  return res.data;
};

export const getAllCryptos = async () => {
  const res = await axios.get(`${BASE_URL}/crypto`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getCryptoById = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/crypto/crypto/id/${id}`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getAllIndices = async () => {
  const res = await axios.get(`${BASE_URL}/index`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getIndexByCode = async (code: string) => {
  const res = await axios.get(`${BASE_URL}/index/indices/${code}`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getAllForex = async () => {
  const res = await axios.get(`${BASE_URL}/forex/forex`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getForexByCode = async (code: string) => {
  const res = await axios.get(`${BASE_URL}/forex/forex/${code}`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getAllForexInterbankRates = async () => {
  const res = await axios.get(`${BASE_URL}/forex-interbank-rates`);
  return res.data;
};

export const getForexInterbankRateByCode = async (code: string) => {
  try {
    const upperCode = code.toUpperCase();
    console.log(`Fetching: ${BASE_URL}/forex-interbank-rates/interbank-pairs/code/${upperCode}`);
    const res = await axios.get(`${BASE_URL}/forex-interbank-rates/interbank-pairs/code/${upperCode}`);
    
    console.log(`Response for ${upperCode}:`, res.data);
    
    // Extract the inner 'data' object immediately
    return res.data?.data || null; 
  } catch (error) {
    console.error(`Error in getForexInterbankRateByCode for ${code}:`, error);
    return null;
  }
};

export const getAllCommodities = async () => {
  const res = await axios.get(`${BASE_URL}/commodity`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getCommodityByCode = async (code: string) => {
  const res = await axios.get(`${BASE_URL}/commodity/commodities/${code}`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getAllGoldbod = async () => {
  const res = await axios.get(`${BASE_URL}/goldbod`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};

export const getGoldbodByCode = async (code: string) => {
  const res = await axios.get(`${BASE_URL}/goldbod/${code}`);
  // API shape: { success, code, fromCache, data: {...} }
  return res.data?.data ?? res.data ?? null;
};