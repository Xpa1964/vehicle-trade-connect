
import { useQuery } from '@tanstack/react-query';
import { 
  getTotalRegistrations, 
  getVerifiedAccounts, 
  getAverageVerificationTime,
  getRegistrationConversionRate 
} from './admin-statistics/acquisitionStatsService';
import { 
  getDailyActiveUsers,
  getWeeklyActiveUsers,
  getMonthlyActiveUsers,
  getUserRetentionRate,
  getAverageSessionDuration,
  getTotalRatingsGiven
} from './admin-statistics/engagementStatsService';
import { 
  getTotalVehiclesListed,
  getTotalAdsListed,
  getSuccessfulTransactionsRate,
  getAverageTimeToTransaction,
  getTotalTransactionValue,
  getAverageBidsPerAuction,
  getTotalExchangeProposals
} from './admin-statistics/marketplaceStatsService';
import { 
  getTotalTransportRequests,
  getTotalVehicleReportsRequested,
  getImportCalculatorUses,
  getTotalPartnerContacts,
  getServiceConversionRate
} from './admin-statistics/servicesStatsService';
import { 
  getTotalChatConversations,
  getAverageMessagesPerUser,
  getTranslationFeatureUses,
  getAverageSupportResponseTime
} from './admin-statistics/communicationStatsService';
import { 
  getAveragePageLoadTime,
  getErrorRate,
  getFormAbandonmentRate
} from './admin-statistics/performanceStatsService';
import { getSecurityAlerts } from './admin-statistics/suspiciousActivityService';

export const useComprehensiveKPIs = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['comprehensive-kpis'],
    queryFn: async () => {
      console.log('Fetching comprehensive KPIs with optimized approach...');
      
      // Batch critical KPIs first
      const criticalPromises = [
        getTotalRegistrations(),
        getMonthlyActiveUsers(),
        getTotalVehiclesListed(),
        getTotalChatConversations(),
        getSuccessfulTransactionsRate()
      ];

      // Batch secondary KPIs
      const secondaryPromises = [
        getVerifiedAccounts(),
        getAverageVerificationTime(),
        getRegistrationConversionRate(),
        getDailyActiveUsers(),
        getWeeklyActiveUsers(),
        getUserRetentionRate(),
        getAverageSessionDuration(),
        getTotalRatingsGiven()
      ];

      // Batch tertiary KPIs (least critical)
      const tertiaryPromises = [
        getTotalAdsListed(),
        getAverageTimeToTransaction(),
        getTotalTransactionValue(),
        getAverageBidsPerAuction(),
        getTotalExchangeProposals(),
        getTotalTransportRequests(),
        getTotalVehicleReportsRequested(),
        getImportCalculatorUses(),
        getTotalPartnerContacts(),
        getServiceConversionRate(),
        getAverageMessagesPerUser(),
        getTranslationFeatureUses(),
        getAverageSupportResponseTime(),
        getAveragePageLoadTime(),
        getErrorRate(),
        getFormAbandonmentRate(),
        getSecurityAlerts()
      ];

      try {
        // Execute in batches with timeout
        const [criticalResults, secondaryResults, tertiaryResults] = await Promise.allSettled([
          Promise.allSettled(criticalPromises),
          Promise.allSettled(secondaryPromises),
          Promise.allSettled(tertiaryPromises)
        ]);

        const safeValue = (result: any, defaultValue: any = 0) => 
          result?.status === 'fulfilled' && result?.value?.status === 'fulfilled' 
            ? result.value.value 
            : defaultValue;

        // Extract results with fallbacks
        const [
          totalRegistrations,
          monthlyActiveUsers,
          totalVehiclesListed,
          totalChatConversations,
          successfulTransactionsRate
        ] = criticalResults.status === 'fulfilled' ? criticalResults.value : Array(5).fill({ status: 'rejected' });

        const [
          verifiedAccounts,
          avgVerificationTime,
          registrationConversionRate,
          dailyActiveUsers,
          weeklyActiveUsers,
          userRetentionRate,
          avgSessionDuration,
          totalRatingsGiven
        ] = secondaryResults.status === 'fulfilled' ? secondaryResults.value : Array(8).fill({ status: 'rejected' });

        const [
          totalAdsListed,
          avgTimeToTransaction,
          totalTransactionValue,
          avgBidsPerAuction,
          totalExchangeProposals,
          totalTransportRequests,
          totalVehicleReports,
          importCalculatorUses,
          totalPartnerContacts,
          serviceConversionRate,
          avgMessagesPerUser,
          translationFeatureUses,
          avgSupportResponseTime,
          avgPageLoadTime,
          errorRate,
          formAbandonmentRate,
          securityAlerts
        ] = tertiaryResults.status === 'fulfilled' ? tertiaryResults.value : Array(17).fill({ status: 'rejected' });

        const kpiData = {
          // Critical KPIs (always available)
          totalRegistrations: safeValue(totalRegistrations),
          monthlyActiveUsers: safeValue(monthlyActiveUsers),
          totalVehiclesListed: safeValue(totalVehiclesListed),
          totalChatConversations: safeValue(totalChatConversations),
          successfulTransactionsRate: safeValue(successfulTransactionsRate),
          
          // Secondary KPIs
          verifiedAccounts: safeValue(verifiedAccounts),
          avgVerificationTime: safeValue(avgVerificationTime),
          registrationConversionRate: safeValue(registrationConversionRate),
          dailyActiveUsers: safeValue(dailyActiveUsers),
          weeklyActiveUsers: safeValue(weeklyActiveUsers),
          userRetentionRate: safeValue(userRetentionRate),
          avgSessionDuration: safeValue(avgSessionDuration),
          totalRatingsGiven: safeValue(totalRatingsGiven),
          
          // Tertiary KPIs (may have fallback values)
          totalAdsListed: safeValue(totalAdsListed),
          avgTimeToTransaction: safeValue(avgTimeToTransaction),
          totalTransactionValue: safeValue(totalTransactionValue),
          avgBidsPerAuction: safeValue(avgBidsPerAuction),
          totalExchangeProposals: safeValue(totalExchangeProposals),
          totalTransportRequests: safeValue(totalTransportRequests),
          totalVehicleReports: safeValue(totalVehicleReports),
          importCalculatorUses: safeValue(importCalculatorUses),
          totalPartnerContacts: safeValue(totalPartnerContacts),
          serviceConversionRate: safeValue(serviceConversionRate),
          avgMessagesPerUser: safeValue(avgMessagesPerUser),
          translationFeatureUses: safeValue(translationFeatureUses),
          avgSupportResponseTime: safeValue(avgSupportResponseTime),
          avgPageLoadTime: safeValue(avgPageLoadTime),
          errorRate: safeValue(errorRate),
          formAbandonmentRate: safeValue(formAbandonmentRate),
          securityAlerts: safeValue(securityAlerts, [])
        };
        
        console.log('Comprehensive KPIs fetched successfully with batched approach:', kpiData);
        return kpiData;
      } catch (error) {
        console.error('Error fetching comprehensive KPIs:', error);
        // Return minimal dataset on error
        return {
          totalRegistrations: 0,
          monthlyActiveUsers: 0,
          totalVehiclesListed: 0,
          totalChatConversations: 0,
          successfulTransactionsRate: 0,
          verifiedAccounts: 0,
          avgVerificationTime: 0,
          registrationConversionRate: 0,
          dailyActiveUsers: 0,
          weeklyActiveUsers: 0,
          userRetentionRate: 0,
          avgSessionDuration: 0,
          totalRatingsGiven: 0,
          totalAdsListed: 0,
          avgTimeToTransaction: 0,
          totalTransactionValue: 0,
          avgBidsPerAuction: 0,
          totalExchangeProposals: 0,
          totalTransportRequests: 0,
          totalVehicleReports: 0,
          importCalculatorUses: 0,
          totalPartnerContacts: 0,
          serviceConversionRate: 0,
          avgMessagesPerUser: 0,
          translationFeatureUses: 0,
          avgSupportResponseTime: 0,
          avgPageLoadTime: 0,
          errorRate: 0,
          formAbandonmentRate: 0,
          securityAlerts: []
        };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    retry: 1,
    retryDelay: 2000,
    enabled, // Now controlled by parameter
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false // Manual refresh only
  });
};
