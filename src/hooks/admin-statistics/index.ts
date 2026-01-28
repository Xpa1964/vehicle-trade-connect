import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AdminStatistic, AdminStats, RecentActivity } from './types';
import { fetchUserStatistics } from './userStatsService';
import { fetchVehicleStatistics } from './vehicleStatsService';
import { fetchConversationStatistics } from './conversationStatsService';
import { fetchTransactionStatistics } from './transactionStatsService';
// Auction stats removed - feature disabled
import { getExchangesCount, getExchangesChangeRate } from './exchangeStatsService';
import { fetchRecentActivity } from './activityLogsService';
import { getMessageActivityHeatmap, getMessageEngagementStats } from './messageStatsService';
import { getUserRetentionStats } from './retentionStatsService';
import { getGeographicStats } from './geographicStatsService';
// Auction analytics removed - feature disabled
import { getVehiclePerformanceStats } from './vehiclePerformanceService';
import { calculateGrowthTrends, detectCriticalAlerts } from './trendAnalysisService';
import { getAverageResponseTime } from './responseTimeStatsService';
import { getAverageTransactionValue, getMonthlyCommissions, getCommissionGrowthRate } from './financialStatsService';
import { getQualityScore, getQualityGrowthRate } from './qualityStatsService';
import { getActiveUsersLast30Days, getActiveUsersGrowthRate } from './activeUsersStatsService';
import { getRegionsCount, getNewRegionsCount } from './regionsStatsService';
// Import comprehensive KPI services
import { 
  getTotalRegistrations, 
  getVerifiedAccounts, 
  getAverageVerificationTime,
  getRegistrationConversionRate 
} from './acquisitionStatsService';
import { 
  getDailyActiveUsers,
  getWeeklyActiveUsers,
  getMonthlyActiveUsers,
  getUserRetentionRate,
  getAverageSessionDuration,
  getTotalRatingsGiven
} from './engagementStatsService';
import { 
  getTotalVehiclesListed,
  getTotalAdsListed,
  getSuccessfulTransactionsRate,
  getAverageTimeToTransaction,
  getTotalTransactionValue,
  getAverageBidsPerAuction,
  getTotalExchangeProposals
} from './marketplaceStatsService';
import { 
  getTotalTransportRequests,
  getTotalVehicleReportsRequested,
  getImportCalculatorUses,
  getTotalPartnerContacts,
  getServiceConversionRate
} from './servicesStatsService';
import { 
  getTotalChatConversations,
  getAverageMessagesPerUser,
  getTranslationFeatureUses,
  getAverageSupportResponseTime
} from './communicationStatsService';
import { 
  getAveragePageLoadTime,
  getErrorRate,
  getFormAbandonmentRate
} from './performanceStatsService';
import { getSecurityAlerts } from './suspiciousActivityService';

export * from './types';

interface ExtendedAdminStats extends AdminStats {
  messageHeatmap: Array<{ hour: number; count: number }>;
  engagement: {
    totalConversations: number;
    activeConversations: number;
    averageMessagesPerConversation: number;
    totalMessages: number;
  };
  retention: {
    totalUsers: number;
    activeUsers: number;
    retentionRate: number;
    newUsersThisMonth: number;
    churnRate: number;
  };
  geographic: Array<{ country: string; count: number }>;
  auctionDistribution: Array<{ status: string; count: number; name: string }>;
  auctionSuccess: {
    totalEndedAuctions: number;
    successfulAuctions: number;
    successRate: number;
    averageReserveMetPercentage: number;
  };
  vehiclePerformance: {
    averageDaysOnMarket: number;
    soldVehicles: number;
    totalVehicles: number;
    conversionRate: number;
    performanceByType: Array<{ type: string; total: number; sold: number; conversionRate: number; averagePrice: number }>;
  };
  trends: {
    userGrowth: number;
    vehicleListings: number;
    auctionActivity: number;
  };
  alerts: Array<{ type: string; title: string; message: string; severity: string }>;
  // Nuevas estadísticas reales
  realStats: {
    averageResponseTime: number;
    averageTransactionValue: number;
    monthlyCommissions: number;
    commissionGrowthRate: number;
    qualityScore: number;
    qualityGrowthRate: number;
    activeUsersLast30Days: number;
    activeUsersGrowthRate: number;
    regionsCount: number;
    newRegionsCount: number;
  };
  // Nuevos KPIs comprehensivos
  comprehensiveKPIs: {
    acquisition: {
      totalRegistrations: number;
      verifiedAccounts: number;
      avgVerificationTime: number;
      registrationConversionRate: number;
    };
    engagement: {
      dailyActiveUsers: number;
      weeklyActiveUsers: number;
      monthlyActiveUsers: number;
      userRetentionRate: number;
      avgSessionDuration: number;
      totalRatingsGiven: number;
    };
    marketplace: {
      totalVehiclesListed: number;
      totalAdsListed: number;
      successfulTransactionsRate: number;
      avgTimeToTransaction: number;
      totalTransactionValue: number;
      avgBidsPerAuction: number;
      totalExchangeProposals: number;
    };
    services: {
      totalTransportRequests: number;
      totalVehicleReports: number;
      importCalculatorUses: number;
      totalPartnerContacts: number;
      serviceConversionRate: number;
    };
    communication: {
      totalChatConversations: number;
      avgMessagesPerUser: number;
      translationFeatureUses: number;
      avgSupportResponseTime: number;
    };
    performance: {
      avgPageLoadTime: number;
      errorRate: number;
      formAbandonmentRate: number;
    };
    security: {
      securityAlerts: Array<{
        type: string;
        severity: string;
        count: number;
        message: string;
      }>;
    };
  };
}

export const useAdminStatistics = () => {
  const [stats, setStats] = useState<AdminStatistic[]>([]);
  const [structuredStats, setStructuredStats] = useState<AdminStats>({
    users: { total: 0, growthRate: 0 },
    vehicles: { total: 0, recentlyAdded: 0 },
    conversations: { active: 0, newLastWeek: 0 },
    transactions: { potential: 0, completed: 0 }
  });
  const [extendedStats, setExtendedStats] = useState<ExtendedAdminStats>({
    users: { total: 0, growthRate: 0 },
    vehicles: { total: 0, recentlyAdded: 0 },
    conversations: { active: 0, newLastWeek: 0 },
    transactions: { potential: 0, completed: 0 },
    messageHeatmap: [],
    engagement: { totalConversations: 0, activeConversations: 0, averageMessagesPerConversation: 0, totalMessages: 0 },
    retention: { totalUsers: 0, activeUsers: 0, retentionRate: 0, newUsersThisMonth: 0, churnRate: 0 },
    geographic: [],
    auctionDistribution: [],
    auctionSuccess: { totalEndedAuctions: 0, successfulAuctions: 0, successRate: 0, averageReserveMetPercentage: 0 },
    vehiclePerformance: { averageDaysOnMarket: 0, soldVehicles: 0, totalVehicles: 0, conversionRate: 0, performanceByType: [] },
    trends: { userGrowth: 0, vehicleListings: 0, auctionActivity: 0 },
    alerts: [],
    realStats: {
      averageResponseTime: 0,
      averageTransactionValue: 0,
      monthlyCommissions: 0,
      commissionGrowthRate: 0,
      qualityScore: 0,
      qualityGrowthRate: 0,
      activeUsersLast30Days: 0,
      activeUsersGrowthRate: 0,
      regionsCount: 0,
      newRegionsCount: 0
    },
    comprehensiveKPIs: {
      acquisition: {
        totalRegistrations: 0,
        verifiedAccounts: 0,
        avgVerificationTime: 0,
        registrationConversionRate: 0
      },
      engagement: {
        dailyActiveUsers: 0,
        weeklyActiveUsers: 0,
        monthlyActiveUsers: 0,
        userRetentionRate: 0,
        avgSessionDuration: 0,
        totalRatingsGiven: 0
      },
      marketplace: {
        totalVehiclesListed: 0,
        totalAdsListed: 0,
        successfulTransactionsRate: 0,
        avgTimeToTransaction: 0,
        totalTransactionValue: 0,
        avgBidsPerAuction: 0,
        totalExchangeProposals: 0
      },
      services: {
        totalTransportRequests: 0,
        totalVehicleReports: 0,
        importCalculatorUses: 0,
        totalPartnerContacts: 0,
        serviceConversionRate: 0
      },
      communication: {
        totalChatConversations: 0,
        avgMessagesPerUser: 0,
        translationFeatureUses: 0,
        avgSupportResponseTime: 0
      },
      performance: {
        avgPageLoadTime: 0,
        errorRate: 0,
        formAbandonmentRate: 0
      },
      security: {
        securityAlerts: []
      }
    }
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('[useAdminStatistics] Fetching comprehensive admin statistics...');
        
        // Fetch all statistics in parallel including new comprehensive KPIs
        const [
          userStats,
          vehicleStats,
          conversationStats,
          transactionStats,
          // activeAuctions, - removed
          // newAuctions, - removed
          exchangesCount,
          exchangesChange,
          activityData,
          messageHeatmap,
          engagementStats,
          retentionStats,
          geographicStats,
          // auctionDistribution, - removed
          // auctionSuccessStats, - removed
          vehiclePerformanceStats,
          trendsData,
          alertsData,
          avgResponseTime,
          avgTransactionValue,
          monthlyCommissions,
          commissionGrowthRate,
          qualityScore,
          qualityGrowthRate,
          activeUsersLast30Days,
          activeUsersGrowthRate,
          regionsCount,
          newRegionsCount,
          // Comprehensive KPIs
          totalRegistrations,
          verifiedAccounts,
          avgVerificationTime,
          registrationConversionRate,
          dailyActiveUsers,
          weeklyActiveUsers,
          monthlyActiveUsers,
          userRetentionRate,
          avgSessionDuration,
          totalRatingsGiven,
          totalVehiclesListed,
          totalAdsListed,
          successfulTransactionsRate,
          avgTimeToTransaction,
          totalTransactionValueMarketplace,
          avgBidsPerAuction,
          totalExchangeProposals,
          totalTransportRequests,
          totalVehicleReports,
          importCalculatorUses,
          totalPartnerContacts,
          serviceConversionRate,
          totalChatConversations,
          avgMessagesPerUser,
          translationFeatureUses,
          avgSupportResponseTime,
          avgPageLoadTime,
          errorRate,
          formAbandonmentRate,
          securityAlerts
        ] = await Promise.allSettled([
          fetchUserStatistics().catch(() => ({ total: 0, active: 0, admins: 0, registered_today: 0 })),
          fetchVehicleStatistics(),
          fetchConversationStatistics(),
          fetchTransactionStatistics(),
          // getActiveAuctionsCount(), - removed
          // getNewAuctionsCount(), - removed
          getExchangesCount(),
          getExchangesChangeRate(),
          fetchRecentActivity(),
          getMessageActivityHeatmap(),
          getMessageEngagementStats(),
          getUserRetentionStats(),
          getGeographicStats(),
          // getAuctionStatusDistribution(), - removed
          // getAuctionSuccessRate(), - removed
          getVehiclePerformanceStats(),
          calculateGrowthTrends(),
          detectCriticalAlerts(),
          getAverageResponseTime(),
          getAverageTransactionValue(),
          getMonthlyCommissions(),
          getCommissionGrowthRate(),
          getQualityScore(),
          getQualityGrowthRate(),
          getActiveUsersLast30Days(),
          getActiveUsersGrowthRate(),
          getRegionsCount(),
          getNewRegionsCount(),
          // Comprehensive KPIs
          getTotalRegistrations(),
          getVerifiedAccounts(),
          getAverageVerificationTime(),
          getRegistrationConversionRate(),
          getDailyActiveUsers(),
          getWeeklyActiveUsers(),
          getMonthlyActiveUsers(),
          getUserRetentionRate(),
          getAverageSessionDuration(),
          getTotalRatingsGiven(),
          getTotalVehiclesListed(),
          getTotalAdsListed(),
          getSuccessfulTransactionsRate(),
          getAverageTimeToTransaction(),
          getTotalTransactionValue(),
          getAverageBidsPerAuction(),
          getTotalExchangeProposals(),
          getTotalTransportRequests(),
          getTotalVehicleReportsRequested(),
          getImportCalculatorUses(),
          getTotalPartnerContacts(),
          getServiceConversionRate(),
          getTotalChatConversations(),
          getAverageMessagesPerUser(),
          getTranslationFeatureUses(),
          getAverageSupportResponseTime(),
          getAveragePageLoadTime(),
          getErrorRate(),
          getFormAbandonmentRate(),
          getSecurityAlerts()
        ]);
        
        // Extract results from settled promises
        const userStatsData = userStats.status === 'fulfilled' ? userStats.value : { total: 0, active: 0, admins: 0, registered_today: 0 };
        const vehicleStatsData = vehicleStats.status === 'fulfilled' ? vehicleStats.value : { total: 0, recentlyAdded: 0 };
        const conversationStatsData = conversationStats.status === 'fulfilled' ? conversationStats.value : { active: 0, newLastWeek: 0 };
        const transactionStatsData = transactionStats.status === 'fulfilled' ? transactionStats.value : { potential: 0, completed: 0 };
        const activeAuctionsData = 0; // Removed - auctions feature disabled
        const newAuctionsData = 0; // Removed - auctions feature disabled
        const exchangesCountData = exchangesCount.status === 'fulfilled' ? exchangesCount.value : 0;
        const exchangesChangeData = exchangesChange.status === 'fulfilled' ? exchangesChange.value : 0;
        const activityDataResult = activityData.status === 'fulfilled' ? activityData.value : [];
        const messageHeatmapData = messageHeatmap.status === 'fulfilled' ? messageHeatmap.value : [];
        const engagementStatsData = engagementStats.status === 'fulfilled' ? engagementStats.value : { totalConversations: 0, activeConversations: 0, averageMessagesPerConversation: 0, totalMessages: 0 };
        const retentionStatsData = retentionStats.status === 'fulfilled' ? retentionStats.value : { totalUsers: 0, activeUsers: 0, retentionRate: 0, newUsersThisMonth: 0, churnRate: 0 };
        const geographicStatsData = geographicStats.status === 'fulfilled' ? geographicStats.value : [];
        const auctionDistributionData = []; // Removed - auctions feature disabled
        const auctionSuccessStatsData = { totalEndedAuctions: 0, successfulAuctions: 0, successRate: 0, averageReserveMetPercentage: 0 }; // Removed - auctions feature disabled
        const vehiclePerformanceStatsData = vehiclePerformanceStats.status === 'fulfilled' ? vehiclePerformanceStats.value : { averageDaysOnMarket: 0, soldVehicles: 0, totalVehicles: 0, conversionRate: 0, performanceByType: [] };
        const trendsDataResult = trendsData.status === 'fulfilled' ? trendsData.value : { userGrowth: 0, vehicleListings: 0, auctionActivity: 0 };
        const alertsDataResult = alertsData.status === 'fulfilled' ? alertsData.value : [];
        
        // New real stats
        const avgResponseTimeData = avgResponseTime.status === 'fulfilled' ? avgResponseTime.value : 0;
        const avgTransactionValueData = avgTransactionValue.status === 'fulfilled' ? avgTransactionValue.value : 0;
        const monthlyCommissionsData = monthlyCommissions.status === 'fulfilled' ? monthlyCommissions.value : 0;
        const commissionGrowthRateData = commissionGrowthRate.status === 'fulfilled' ? commissionGrowthRate.value : 0;
        const qualityScoreData = qualityScore.status === 'fulfilled' ? qualityScore.value : 0;
        const qualityGrowthRateData = qualityGrowthRate.status === 'fulfilled' ? qualityGrowthRate.value : 0;
        const activeUsersLast30DaysData = activeUsersLast30Days.status === 'fulfilled' ? activeUsersLast30Days.value : 0;
        const activeUsersGrowthRateData = activeUsersGrowthRate.status === 'fulfilled' ? activeUsersGrowthRate.value : 0;
        const regionsCountData = regionsCount.status === 'fulfilled' ? regionsCount.value : 0;
        const newRegionsCountData = newRegionsCount.status === 'fulfilled' ? newRegionsCount.value : 0;
        
        // Extract comprehensive KPIs results
        const totalRegistrationsData = totalRegistrations.status === 'fulfilled' ? totalRegistrations.value : 0;
        const verifiedAccountsData = verifiedAccounts.status === 'fulfilled' ? verifiedAccounts.value : 0;
        const avgVerificationTimeData = avgVerificationTime.status === 'fulfilled' ? avgVerificationTime.value : 0;
        const registrationConversionRateData = registrationConversionRate.status === 'fulfilled' ? registrationConversionRate.value : 0;
        const dailyActiveUsersData = dailyActiveUsers.status === 'fulfilled' ? dailyActiveUsers.value : 0;
        const weeklyActiveUsersData = weeklyActiveUsers.status === 'fulfilled' ? weeklyActiveUsers.value : 0;
        const monthlyActiveUsersData = monthlyActiveUsers.status === 'fulfilled' ? monthlyActiveUsers.value : 0;
        const userRetentionRateData = userRetentionRate.status === 'fulfilled' ? userRetentionRate.value : 0;
        const avgSessionDurationData = avgSessionDuration.status === 'fulfilled' ? avgSessionDuration.value : 0;
        const totalRatingsGivenData = totalRatingsGiven.status === 'fulfilled' ? totalRatingsGiven.value : 0;
        const totalVehiclesListedData = totalVehiclesListed.status === 'fulfilled' ? totalVehiclesListed.value : 0;
        const totalAdsListedData = totalAdsListed.status === 'fulfilled' ? totalAdsListed.value : 0;
        const successfulTransactionsRateData = successfulTransactionsRate.status === 'fulfilled' ? successfulTransactionsRate.value : 0;
        const avgTimeToTransactionData = avgTimeToTransaction.status === 'fulfilled' ? avgTimeToTransaction.value : 0;
        const totalTransactionValueKPIData = totalTransactionValueMarketplace.status === 'fulfilled' ? totalTransactionValueMarketplace.value : 0;
        const avgBidsPerAuctionData = avgBidsPerAuction.status === 'fulfilled' ? avgBidsPerAuction.value : 0;
        const totalExchangeProposalsData = totalExchangeProposals.status === 'fulfilled' ? totalExchangeProposals.value : 0;
        const totalTransportRequestsData = totalTransportRequests.status === 'fulfilled' ? totalTransportRequests.value : 0;
        const totalVehicleReportsData = totalVehicleReports.status === 'fulfilled' ? totalVehicleReports.value : 0;
        const importCalculatorUsesData = importCalculatorUses.status === 'fulfilled' ? importCalculatorUses.value : 0;
        const totalPartnerContactsData = totalPartnerContacts.status === 'fulfilled' ? totalPartnerContacts.value : 0;
        const serviceConversionRateData = serviceConversionRate.status === 'fulfilled' ? serviceConversionRate.value : 0;
        const totalChatConversationsData = totalChatConversations.status === 'fulfilled' ? totalChatConversations.value : 0;
        const avgMessagesPerUserData = avgMessagesPerUser.status === 'fulfilled' ? avgMessagesPerUser.value : 0;
        const translationFeatureUsesData = translationFeatureUses.status === 'fulfilled' ? translationFeatureUses.value : 0;
        const avgSupportResponseTimeData = avgSupportResponseTime.status === 'fulfilled' ? avgSupportResponseTime.value : 0;
        const avgPageLoadTimeData = avgPageLoadTime.status === 'fulfilled' ? avgPageLoadTime.value : 0;
        const errorRateData = errorRate.status === 'fulfilled' ? errorRate.value : 0;
        const formAbandonmentRateData = formAbandonmentRate.status === 'fulfilled' ? formAbandonmentRate.value : 0;
        const securityAlertsData = securityAlerts.status === 'fulfilled' ? securityAlerts.value : [];
        
        // Format statistics for the cards display
        const statsData: AdminStatistic[] = [
          {
            label: 'Usuarios Registrados',
            value: userStatsData.total || 0,
            change: userStatsData.registered_today || 0,
            changeType: 'increase',
            changeLabel: 'nuevos usuarios hoy'
          },
          {
            label: 'Vehículos Activos',
            value: vehicleStatsData.total,
            change: vehicleStatsData.recentlyAdded,
            changeType: 'increase',
            changeLabel: 'en las últimas 2 semanas'
          },
          {
            label: 'Subastas Activas',
            value: activeAuctionsData,
            change: newAuctionsData,
            changeType: 'increase',
            changeLabel: 'desde el mes pasado'
          },
          {
            label: 'Intercambios',
            value: exchangesCountData,
            change: exchangesChangeData,
            changeType: 'increase',
            changeLabel: 'desde el mes pasado'
          }
        ];
        
        setStats(statsData);
        
        // Calculate user growth rate
        const userGrowthRate = trendsDataResult.userGrowth || 0;
        
        // Set the structured stats
        const basicStats = {
          users: { total: userStatsData.total || 0, growthRate: userGrowthRate },
          vehicles: { total: vehicleStatsData.total || 0, recentlyAdded: vehicleStatsData.recentlyAdded || 0 },
          conversations: { active: conversationStatsData.active || 0, newLastWeek: conversationStatsData.newLastWeek || 0 },
          transactions: { potential: transactionStatsData.potential || 0, completed: transactionStatsData.completed || 0 }
        };
        
        setStructuredStats(basicStats);
        
        // Set extended stats with all data including new comprehensive KPIs
        setExtendedStats({
          ...basicStats,
          messageHeatmap: messageHeatmapData,
          engagement: engagementStatsData,
          retention: retentionStatsData,
          geographic: geographicStatsData,
          auctionDistribution: auctionDistributionData,
          auctionSuccess: auctionSuccessStatsData,
          vehiclePerformance: vehiclePerformanceStatsData,
          trends: trendsDataResult,
          alerts: alertsDataResult,
          realStats: {
            averageResponseTime: avgResponseTimeData,
            averageTransactionValue: avgTransactionValueData,
            monthlyCommissions: monthlyCommissionsData,
            commissionGrowthRate: commissionGrowthRateData,
            qualityScore: qualityScoreData,
            qualityGrowthRate: qualityGrowthRateData,
            activeUsersLast30Days: activeUsersLast30DaysData,
            activeUsersGrowthRate: activeUsersGrowthRateData,
            regionsCount: regionsCountData,
            newRegionsCount: newRegionsCountData
          },
          comprehensiveKPIs: {
            acquisition: {
              totalRegistrations: totalRegistrationsData,
              verifiedAccounts: verifiedAccountsData,
              avgVerificationTime: avgVerificationTimeData,
              registrationConversionRate: registrationConversionRateData
            },
            engagement: {
              dailyActiveUsers: dailyActiveUsersData,
              weeklyActiveUsers: weeklyActiveUsersData,
              monthlyActiveUsers: monthlyActiveUsersData,
              userRetentionRate: userRetentionRateData,
              avgSessionDuration: avgSessionDurationData,
              totalRatingsGiven: totalRatingsGivenData
            },
            marketplace: {
              totalVehiclesListed: totalVehiclesListedData,
              totalAdsListed: totalAdsListedData,
              successfulTransactionsRate: successfulTransactionsRateData,
              avgTimeToTransaction: avgTimeToTransactionData,
              totalTransactionValue: totalTransactionValueKPIData,
              avgBidsPerAuction: avgBidsPerAuctionData,
              totalExchangeProposals: totalExchangeProposalsData
            },
            services: {
              totalTransportRequests: totalTransportRequestsData,
              totalVehicleReports: totalVehicleReportsData,
              importCalculatorUses: importCalculatorUsesData,
              totalPartnerContacts: totalPartnerContactsData,
              serviceConversionRate: serviceConversionRateData
            },
            communication: {
              totalChatConversations: totalChatConversationsData,
              avgMessagesPerUser: avgMessagesPerUserData,
              translationFeatureUses: translationFeatureUsesData,
              avgSupportResponseTime: avgSupportResponseTimeData
            },
            performance: {
              avgPageLoadTime: avgPageLoadTimeData,
              errorRate: errorRateData,
              formAbandonmentRate: formAbandonmentRateData
            },
            security: {
              securityAlerts: securityAlertsData
            }
          }
        });
        
        setRecentActivity(activityDataResult);
        
      } catch (err: any) {
        console.error("[useAdminStatistics] Error fetching admin statistics:", err);
        toast({
          title: "Error al cargar estadísticas",
          description: "Estamos experimentando problemas para cargar las estadísticas. Por favor, intenta de nuevo más tarde.",
          variant: "destructive"
        });
        setError(err.message || "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStatistics();
  }, [toast]);
  
  return { stats, structuredStats, extendedStats, recentActivity, isLoading, error };
};
