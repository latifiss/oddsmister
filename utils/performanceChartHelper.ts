import { Financial } from '@/lib/api/stocks';

export interface PerformanceDataItem {
  period: string;
  Revenue: number;
  'Net income': number;
  'Net margin %': number;
}

export const transformFinancialDataForChart = (financialData: Financial | null) => {
  if (!financialData) {
    return {
      annualData: [],
      quarterlyData: [],
      semiannualData: []
    };
  }

  try {
    // --- Annual Data ---
    const annualRevenues = financialData.annual_revenue_history || [];
    const annualMargins = financialData.annual_net_margin_history || [];
    
    // Create annual data with proper matching
    const annualData = annualRevenues
      .sort((a, b) => a.for_year - b.for_year) // Sort ascending
      .map(revenueItem => {
        // Find matching net margin
        const matchingMargin = annualMargins.find(
          margin => margin.for_year === revenueItem.for_year
        );
        
        const revenue = revenueItem.value || 0;
        const netMargin = matchingMargin?.value || 0;
        const netIncome = revenue * (netMargin / 100);
        
        return {
          period: revenueItem.for_year.toString(),
          Revenue: revenue,
          'Net income': Math.round(netIncome),
          'Net margin %': parseFloat(netMargin.toFixed(2))
        };
      })
      .slice(-5); // Last 5 years

    // --- Quarterly Data ---
    const quarterlyRevenues = financialData.quarterly_revenue_history || [];
    const quarterlyMargins = financialData.quarterly_net_margin_history || [];
    
    const quarterlyData = quarterlyRevenues
      .sort((a, b) => {
        // Sort by year and quarter
        if (a.for_year !== b.for_year) return a.for_year - b.for_year;
        const qA = parseInt(a.for_quarter.replace('Q', ''));
        const qB = parseInt(b.for_quarter.replace('Q', ''));
        return qA - qB;
      })
      .map(revenueItem => {
        // Find matching net margin - first try exact match
        let matchingMargin = quarterlyMargins.find(
          margin => margin.for_year === revenueItem.for_year && 
                   margin.for_quarter === revenueItem.for_quarter
        );
        
        // If no exact match, try to find a margin from the same year
        if (!matchingMargin) {
          const yearMargins = quarterlyMargins.filter(
            margin => margin.for_year === revenueItem.for_year
          );
          if (yearMargins.length > 0) {
            matchingMargin = yearMargins[0]; // Use first margin from that year
          }
        }
        
        // If still no match, try to use annual margin for that year
        if (!matchingMargin) {
          const annualMargin = annualMargins.find(
            margin => margin.for_year === revenueItem.for_year
          );
          if (annualMargin) {
            matchingMargin = { value: annualMargin.value } as any;
          }
        }
        
        // If still no match, use the financial_summary profit_margin
        if (!matchingMargin && financialData.financial_summary?.profit_margin) {
          matchingMargin = { value: financialData.financial_summary.profit_margin } as any;
        }
        
        // Default to 0 if nothing found
        const netMargin = matchingMargin?.value || 0;
        const revenue = revenueItem.value || 0;
        const netIncome = revenue * (netMargin / 100);
        const yearShort = revenueItem.for_year.toString().slice(-2);
        
        return {
          period: `${revenueItem.for_quarter} '${yearShort}`,
          Revenue: revenue,
          'Net income': Math.round(netIncome),
          'Net margin %': parseFloat(netMargin.toFixed(2))
        };
      })
      .slice(-8); // Last 8 quarters

    // --- Calculate Semiannual Data from Quarterly ---
    const semiannualData = [];
    const groupedByHalfYear = {};
    
    quarterlyData.forEach(item => {
      const [quarter, year] = item.period.split(" '");
      const quarterNum = parseInt(quarter.replace('Q', ''));
      const half = quarterNum <= 2 ? 'H1' : 'H2';
      const key = `${year}-${half}`;
      
      if (!groupedByHalfYear[key]) {
        groupedByHalfYear[key] = {
          period: `${half} '${year}`,
          Revenue: 0,
          'Net income': 0,
          'Net margin %': 0,
          count: 0
        };
      }
      
      groupedByHalfYear[key].Revenue += item.Revenue;
      groupedByHalfYear[key]['Net income'] += item['Net income'];
      groupedByHalfYear[key]['Net margin %'] += item['Net margin %'];
      groupedByHalfYear[key].count++;
    });
    
    Object.values(groupedByHalfYear).forEach(item => {
      semiannualData.push({
        period: item.period,
        Revenue: item.Revenue,
        'Net income': item['Net income'],
        'Net margin %': parseFloat((item['Net margin %'] / item.count).toFixed(2))
      });
    });

    // Sort semiannual data chronologically
    const sortedSemiannualData = semiannualData.sort((a, b) => {
      const [halfA, yearA] = a.period.split(" '");
      const [halfB, yearB] = b.period.split(" '");
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return halfA === 'H1' ? -1 : 1;
    });

    return {
      annualData: annualData.length > 0 ? annualData : getDefaultAnnualData(),
      quarterlyData: quarterlyData.length > 0 ? quarterlyData : getDefaultQuarterlyData(),
      semiannualData: sortedSemiannualData.length > 0 ? sortedSemiannualData : getDefaultSemiannualData()
    };
    
  } catch (error) {
    console.error('Error transforming financial data:', error);
    return {
      annualData: getDefaultAnnualData(),
      quarterlyData: getDefaultQuarterlyData(),
      semiannualData: getDefaultSemiannualData()
    };
  }
};

// Default data functions
export const getDefaultAnnualData = (): PerformanceDataItem[] => [
  { period: '2021', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: '2022', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: '2023', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: '2024', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
];

export const getDefaultQuarterlyData = (): PerformanceDataItem[] => [
  { period: 'Q1 \'24', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: 'Q2 \'24', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: 'Q3 \'24', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: 'Q4 \'24', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: 'Q1 \'25', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
];

export const getDefaultSemiannualData = (): PerformanceDataItem[] => [
  { period: 'H1 \'24', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: 'H2 \'24', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
  { period: 'H1 \'25', Revenue: 0, 'Net income': 0, 'Net margin %': 0 },
];

export const calculateNetMargin = (revenue: number, netIncome: number): number => {
  if (!revenue || revenue === 0 || !netIncome) return 0;
  return (netIncome / revenue) * 100;
};