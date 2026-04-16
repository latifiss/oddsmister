import { Financial } from '@/lib/api/stocks';

export interface PerformanceDataItem {
  period: string;
  Revenue: number;
  'Net income': number;
  'Net margin %': number;
}

const calculateNetMargin = (revenue: number, netIncome: number): number => {
  if (!revenue || revenue === 0) return 0;
  return (netIncome / revenue) * 100;
};

export const transformFinancialDataForChart = (financialData: Financial | null) => {
  if (!financialData) {
    return {
      annualData: [],
      quarterlyData: [],
      semiannualData: []
    };
  }

  try {
    const annualRevenues = financialData.annual_revenue_history || [];
    const annualMargins = financialData.annual_net_margin_history || [];
    
    const annualData = annualRevenues
      .sort((a, b) => a.for_year - b.for_year)
      .map(revenueItem => {
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
      .filter(item => item.Revenue > 0)
      .slice(-5);

    const quarterlyRevenues = financialData.quarterly_revenue_history || [];
    const financialStatements = financialData.financial_statements || [];
    const quarterlyNetMargins = financialData.quarterly_net_margin_history || [];
    
    const quarterlyData = quarterlyRevenues
      .sort((a, b) => {
        if (a.for_year !== b.for_year) return a.for_year - b.for_year;
        const qA = parseInt(a.for_quarter.replace('Q', ''));
        const qB = parseInt(b.for_quarter.replace('Q', ''));
        return qA - qB;
      })
      .map(revenueItem => {
        const revenue = revenueItem.value || 0;
        let netIncome = 0;
        let netMargin = 0;
        
        const matchingQuarterMargin = quarterlyNetMargins.find(
          margin => margin.for_year === revenueItem.for_year && 
                   margin.for_quarter === revenueItem.for_quarter
        );
        
        if (matchingQuarterMargin) {
          netMargin = matchingQuarterMargin.value || 0;
          netIncome = revenue * (netMargin / 100);
        } else {
          const matchingStatement = financialStatements.find(statement => {
            if (!statement.period || !statement.period_type) return false;
            
            const isQuarterly = statement.period_type === 'quarterly';
            const year = revenueItem.for_year;
            const quarter = revenueItem.for_quarter;
            
            if (isQuarterly) {
              return statement.period.includes(`Q${quarter.slice(1)}`) && 
                     statement.period.includes(year.toString());
            }
            
            return false;
          });
          
          if (matchingStatement && matchingStatement.net_income) {
            netIncome = matchingStatement.net_income;
            netMargin = calculateNetMargin(revenue, netIncome);
          } else if (matchingStatement && matchingStatement.revenue) {
            const statementRevenue = matchingStatement.revenue;
            const statementNetIncome = matchingStatement.net_income || 0;
            
            if (statementRevenue > 0) {
              const revenueRatio = revenue / statementRevenue;
              netIncome = statementNetIncome * revenueRatio;
              netMargin = calculateNetMargin(revenue, netIncome);
            }
          } else {
            const annualMargin = annualMargins.find(
              margin => margin.for_year === revenueItem.for_year
            );
            
            if (annualMargin) {
              netMargin = annualMargin.value;
              netIncome = revenue * (netMargin / 100);
            } else if (financialData.financial_summary?.profit_margin) {
              netMargin = financialData.financial_summary.profit_margin;
              netIncome = revenue * (netMargin / 100);
            } else if (financialData.financial_summary?.latest_net_income && financialData.financial_summary?.latest_revenue) {
              const latestNetIncome = financialData.financial_summary.latest_net_income;
              const latestRevenue = financialData.financial_summary.latest_revenue;
              
              if (latestRevenue > 0) {
                const avgNetMargin = (latestNetIncome / latestRevenue) * 100;
                netMargin = avgNetMargin;
                netIncome = revenue * (netMargin / 100);
              }
            }
          }
        }
        
        const yearShort = revenueItem.for_year.toString().slice(-2);
        
        return {
          period: `${revenueItem.for_quarter} '${yearShort}`,
          Revenue: revenue,
          'Net income': Math.round(netIncome),
          'Net margin %': parseFloat(netMargin.toFixed(2))
        };
      })
      .filter(item => item.Revenue > 0)
      .slice(-8);

    const semiannualData = [];
    const groupedByHalfYear: { [key: string]: any } = {};
    
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
      if (item.count > 0) {
        semiannualData.push({
          period: item.period,
          Revenue: item.Revenue,
          'Net income': item['Net income'],
          'Net margin %': parseFloat((item['Net margin %'] / item.count).toFixed(2))
        });
      }
    });

    const sortedSemiannualData = semiannualData.sort((a, b) => {
      const [halfA, yearA] = a.period.split(" '");
      const [halfB, yearB] = b.period.split(" '");
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return halfA === 'H1' ? -1 : 1;
    });

    return {
      annualData,
      quarterlyData,
      semiannualData: sortedSemiannualData
    };
    
  } catch (error) {
    return {
      annualData: [],
      quarterlyData: [],
      semiannualData: []
    };
  }
};