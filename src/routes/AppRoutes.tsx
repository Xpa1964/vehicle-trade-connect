
import { Suspense, lazy, ComponentType } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageSkeleton } from "@/components/ui/skeletons/PageSkeleton";

// Enhanced fallback component with skeleton for better UX
const LoadingFallback = () => <PageSkeleton />;

// Lazy import with retry logic to handle intermittent network failures
function lazyWithRetry(importFn: () => Promise<{ default: ComponentType<any> }>, retries = 3, delay = 1000) {
  return lazy(() => {
    const attempt = (remainingRetries: number): Promise<{ default: ComponentType<any> }> =>
      importFn().catch((error) => {
        if (remainingRetries <= 0) {
          console.error('Failed to load module after retries:', error);
          // Return a component that allows manual retry
          return {
            default: () => {
              const handleRetry = () => window.location.reload();
              return (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                  <p className="text-muted-foreground">Error al cargar la página. Comprueba tu conexión.</p>
                  <button onClick={handleRetry} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
                    Reintentar
                  </button>
                </div>
              );
            }
          } as { default: ComponentType<any> };
        }
        return new Promise<{ default: ComponentType<any> }>((resolve) =>
          setTimeout(() => resolve(attempt(remainingRetries - 1)), delay)
        );
      });
    return attempt(retries);
  });
}

// Lazy loading de todas las páginas con reintentos automáticos
const NotFound = lazyWithRetry(() => import("../pages/NotFound"));

// Páginas públicas
const Home = lazyWithRetry(() => import("../pages/Home"));
const Login = lazyWithRetry(() => import("../pages/Login"));
const Register = lazyWithRetry(() => import("../pages/Register"));
const RegisterConfirmation = lazyWithRetry(() => import("../pages/RegisterConfirmation"));
const ForgotPassword = lazyWithRetry(() => import("../pages/ForgotPassword"));
const ResetPassword = lazyWithRetry(() => import("../pages/ResetPassword"));

// Lazy loading de todas las páginas
const Services = lazyWithRetry(() => import("../pages/Services"));
const ContactPage = lazyWithRetry(() => import("../pages/ContactPage"));
const VehicleGallery = lazyWithRetry(() => import("../pages/VehicleGallery"));
const VehiclePreviewPage = lazyWithRetry(() => import("../pages/VehiclePreviewPage"));
const VehicleInformationPage = lazyWithRetry(() => import("../pages/VehicleInformationPage"));
const VehicleDetailPage = lazyWithRetry(() => import("../pages/VehicleDetailPage"));
const VehicleDetailsPage = lazyWithRetry(() => import("../pages/VehicleDetailsPage"));
const VehicleEquipmentPage = lazyWithRetry(() => import("../pages/VehicleEquipmentPage"));
const VehicleFilesPage = lazyWithRetry(() => import("../pages/VehicleFilesPage"));
const VehicleDamagesPage = lazyWithRetry(() => import("../pages/VehicleDamagesPage"));
const VehicleAdditionalInfoPage = lazyWithRetry(() => import("../pages/VehicleAdditionalInfoPage"));
const LiveAuctionsPage = lazyWithRetry(() => import("../pages/auctions/LiveAuctionsPage"));
const AuctionDetailPage = lazyWithRetry(() => import("../pages/auctions/AuctionDetailPage"));
const PublishAuctionPage = lazyWithRetry(() => import("../pages/auctions/PublishAuctionPage"));
const Exchanges = lazyWithRetry(() => import("../pages/Exchanges"));
const BulletinBoard = lazyWithRetry(() => import("../pages/BulletinBoard"));
const BulletinDetailPage = lazyWithRetry(() => import("../pages/BulletinDetailPage"));
const Transport = lazyWithRetry(() => import("../pages/Transport"));
const TransportExpressPage = lazyWithRetry(() => import("../pages/TransportExpressPage"));
const CommissionCalculatorPage = lazyWithRetry(() => import("../pages/CommissionCalculatorPage"));
const ImportCalculator = lazyWithRetry(() => import("../pages/ImportCalculator"));
const VehicleReports = lazyWithRetry(() => import("../pages/VehicleReports"));
const RequestReport = lazyWithRetry(() => import("../pages/RequestReport"));
const VehicleReportsInfoPage = lazyWithRetry(() => import("../pages/VehicleReportsInfoPage"));
const VehicleGalleryInfoPage = lazyWithRetry(() => import("../pages/VehicleGalleryInfoPage"));
const MessagingInfoPage = lazyWithRetry(() => import("../pages/MessagingInfoPage"));

const BulletinInfoPage = lazyWithRetry(() => import("../pages/BulletinInfoPage"));
const AuctionsInfoPage = lazyWithRetry(() => import("../pages/AuctionsInfoPage"));
const ExchangesInfoPage = lazyWithRetry(() => import("../pages/ExchangesInfoPage"));
const BlogList = lazyWithRetry(() => import("../pages/blog/BlogList"));
const BlogPostView = lazyWithRetry(() => import("../pages/blog/BlogPostView"));
const BlogMainPage = lazyWithRetry(() => import("../pages/BlogMainPage"));
const UsersDirectory = lazyWithRetry(() => import("../pages/UsersDirectory"));
const CommunityPage = lazyWithRetry(() => import("../pages/CommunityPage"));
const TermsAndConditionsPage = lazyWithRetry(() => import("../pages/TermsAndConditionsPage"));
const PrivacyPolicyPage = lazyWithRetry(() => import("../pages/PrivacyPolicyPage"));
const CookiesPage = lazyWithRetry(() => import("../pages/CookiesPage"));
const AuctionPoliciesPage = lazyWithRetry(() => import("../pages/AuctionPoliciesPage"));

// Páginas protegidas
const Dashboard = lazyWithRetry(() => import("../pages/DashboardMainPage"));
const VehicleEditPage = lazyWithRetry(() => import("../pages/VehicleEditPage"));
const VehicleManagement = lazyWithRetry(() => import("../pages/VehicleManagement"));
const MyVehicles = lazyWithRetry(() => import("../pages/MyVehicles"));
// Removed MyAuctions page (auctions feature disabled)
const ExchangeForm = lazyWithRetry(() => import("../pages/ExchangeForm"));
const ExchangeProposal = lazyWithRetry(() => import("../pages/ExchangeProposal"));
const PublishAnnouncementPage = lazyWithRetry(() => import("../pages/PublishAnnouncementPage"));
const TransportQuoteManagement = lazyWithRetry(() => import("../pages/TransportQuoteManagement"));
const Messages = lazyWithRetry(() => import("../pages/Messages"));
// Removed Disputes page (mediation system disabled)

// CORREGIDO: Importar MyProfile para /profile
const MyProfile = lazyWithRetry(() => import("../pages/MyProfile"));
// CORREGIDO: Usar ProfilePage para /user/:id (en lugar de UserProfile)
const ProfilePage = lazyWithRetry(() => import("../pages/ProfilePage"));
const NotificationsPage = lazyWithRetry(() => import("../pages/NotificationsPage"));

// Lazy loading of admin pages
const AdminControlPanel = lazyWithRetry(() => import("../pages/admin/ControlPanel"));
const AdminDashboard = lazyWithRetry(() => import("../pages/admin/Dashboard"));
const AdminUsers = lazyWithRetry(() => import("../pages/admin/Users"));
const AdminUserView = lazyWithRetry(() => import("../pages/admin/UserView"));
const AdminUserEdit = lazyWithRetry(() => import("../pages/admin/UserEdit"));
const AdminVehicles = lazyWithRetry(() => import("../pages/admin/Vehicles"));
// Removed AdminAuctions page (auctions feature disabled)
const AdminConversations = lazyWithRetry(() => import("../pages/admin/Conversations"));
const AdminConversationDetail = lazyWithRetry(() => import("../pages/admin/ConversationDetail"));
const AdminCommunicationsDashboard = lazyWithRetry(() => import("../pages/admin/AdminCommunicationsDashboard"));
const AdminDirectoryChat = lazyWithRetry(() => import("../pages/admin/DirectoryChat"));
const AdminExchanges = lazyWithRetry(() => import("../pages/admin/Exchanges"));
const AdminRegistrationRequests = lazyWithRetry(() => import("../pages/admin/RegistrationRequests"));
const AdminActivityLogs = lazyWithRetry(() => import("../pages/admin/ActivityLogs"));
const AdminRolesAndPermissions = lazyWithRetry(() => import("../pages/admin/RolesAndPermissions"));
const AdminAnalytics = lazyWithRetry(() => import("../pages/admin/Analytics"));
const AdminNotifications = lazyWithRetry(() => import("../pages/admin/Notifications"));
const AdminTransportQuotes = lazyWithRetry(() => import("../pages/admin/TransportQuotes"));
const AdminPerformanceMonitoring = lazyWithRetry(() => import("../pages/admin/PerformanceMonitoring"));
const AdminVehicleReports = lazyWithRetry(() => import("../pages/admin/VehicleReportsAdmin"));
const BlogManagement = lazyWithRetry(() => import("../pages/blog/BlogManagement"));
const BlogPostCreate = lazyWithRetry(() => import("../pages/blog/BlogPostCreate"));
const BlogPostEdit = lazyWithRetry(() => import("../pages/blog/BlogPostEdit"));
const TranslationManagement = lazyWithRetry(() => import("../pages/TranslationManagement"));
const AdminReportPayments = lazyWithRetry(() => import("../pages/admin/ReportPayments"));
const AdminReportProcessing = lazyWithRetry(() => import("../pages/admin/ReportProcessing"));
const AdminAPIManagement = lazyWithRetry(() => import("../pages/admin/APIManagement"));
const APIManagement = lazyWithRetry(() => import("../pages/APIManagement"));
const AdminAuditReport = lazyWithRetry(() => import("../pages/admin/AuditReport"));
const AdminStaticImageManager = lazyWithRetry(() => import("../pages/admin/StaticImageManager"));
const ImageControlCenter = lazyWithRetry(() => import("../pages/admin/ImageControlCenter"));
const AdminCampaigns = lazyWithRetry(() => import("../pages/admin/Campaigns"));
// Removed AdminDisputes page (mediation system disabled)

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <main id="main-content">
        <Routes>
        {/* Rutas con Layout principal */}
        <Route path="/" element={<Layout />}>
          {/* Rutas públicas */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register-confirmation" element={<RegisterConfirmation />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="vehicles" element={<VehicleGallery />} />
          <Route path="vehicle-preview/:id" element={<VehiclePreviewPage />} />
          <Route path="vehicle/:id/information" element={<VehicleInformationPage />} />
          <Route path="vehicle-detail/:id" element={<VehicleDetailPage />} />
          <Route path="vehicle/:id/details" element={<VehicleDetailsPage />} />
          <Route path="vehicle/:id/equipment" element={<VehicleEquipmentPage />} />
          <Route path="vehicle/:id/files" element={<VehicleFilesPage />} />
          <Route path="vehicle/:id/damages" element={<VehicleDamagesPage />} />
          <Route path="vehicle/:id/additional-info" element={<VehicleAdditionalInfoPage />} />
          <Route path="auctions" element={<LiveAuctionsPage />} />
          <Route path="auctions/:id" element={<AuctionDetailPage />} />
          <Route path="exchanges" element={<Exchanges />} />
          <Route path="bulletin" element={<BulletinBoard />} />
          <Route path="bulletin/:id" element={<BulletinDetailPage />} />
          <Route path="transport" element={<Transport />} />
          <Route path="transport-express" element={<TransportExpressPage />} />
          <Route path="commission-calculator" element={<CommissionCalculatorPage />} />
          <Route path="import-calculator" element={<ImportCalculator />} />
          <Route path="vehicle-reports" element={<VehicleReports />} />
          <Route path="request-report" element={<RequestReport />} />
          <Route path="vehicle-reports-info" element={<VehicleReportsInfoPage />} />
          <Route path="vehicle-gallery-info" element={<VehicleGalleryInfoPage />} />
          <Route path="messaging-info" element={<MessagingInfoPage />} />
          
          <Route path="bulletin-info" element={<BulletinInfoPage />} />
          <Route path="auctions-info" element={<AuctionsInfoPage />} />
          <Route path="exchanges-info" element={<ExchangesInfoPage />} />
          <Route path="blog" element={<BlogMainPage />} />
          <Route path="blog/:id" element={<BlogPostView />} />
          {/* CORREGIDO: Usar ProfilePage para la ruta de usuario */}
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="users" element={<UsersDirectory />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="terms" element={<TermsAndConditionsPage />} />
          <Route path="terms-and-conditions" element={<Navigate to="/terms" replace />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="auction-policies" element={<AuctionPoliciesPage />} />
          
          {/* Rutas protegidas */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          {/* Disputes routes removed - mediation system disabled */}
          <Route path="upload-vehicle" element={
            <ProtectedRoute>
              <VehicleEditPage />
            </ProtectedRoute>
          } />
          <Route path="upload-vehicle/:id" element={
            <ProtectedRoute>
              <VehicleEditPage />
            </ProtectedRoute>
          } />
          <Route path="vehicle/:id/edit" element={
            <ProtectedRoute>
              <VehicleEditPage />
            </ProtectedRoute>
          } />
          <Route path="vehicle-management" element={
            <ProtectedRoute>
              <VehicleManagement />
            </ProtectedRoute>
          } />
          <Route path="my-vehicles" element={
            <ProtectedRoute>
              <MyVehicles />
            </ProtectedRoute>
          } />
          <Route path="publish-auction" element={
            <ProtectedRoute>
              <PublishAuctionPage />
            </ProtectedRoute>
          } />
          <Route path="exchange-form" element={
            <ProtectedRoute>
              <ExchangeForm />
            </ProtectedRoute>
          } />
          <Route path="exchange-proposal" element={
            <ProtectedRoute>
              <ExchangeProposal />
            </ProtectedRoute>
          } />
          <Route path="publish-announcement" element={
            <ProtectedRoute>
              <PublishAnnouncementPage />
            </ProtectedRoute>
          } />
          <Route path="transport-quotes" element={
            <ProtectedRoute>
              <TransportQuoteManagement />
            </ProtectedRoute>
          } />
          <Route path="messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          {/* CORREGIDO: Ruta /profile redirige con MyProfile */}
          <Route path="profile" element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          } />
          <Route path="notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="api-management" element={
            <ProtectedRoute>
              <APIManagement />
            </ProtectedRoute>
          } />
        </Route>

        {/* Rutas de administración con AdminLayout */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="control-panel" element={<AdminControlPanel />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id/view" element={<AdminUserView />} />
          <Route path="users/:id/edit" element={<AdminUserEdit />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          {/* Admin auctions route removed - feature disabled */}
          <Route path="conversations" element={<AdminConversations />} />
          <Route path="conversations/:conversationId" element={<AdminConversationDetail />} />
          <Route path="communications-dashboard" element={<AdminCommunicationsDashboard />} />
          <Route path="directory-chat" element={<AdminDirectoryChat />} />
          <Route path="exchanges" element={<AdminExchanges />} />
          <Route path="registration-requests" element={<AdminRegistrationRequests />} />
          <Route path="activity-logs" element={<AdminActivityLogs />} />
          <Route path="roles" element={<AdminRolesAndPermissions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="transport-quotes" element={<AdminTransportQuotes />} />
          <Route path="vehicle-reports" element={<AdminVehicleReports />} />
          <Route path="blog-management" element={<BlogManagement />} />
          <Route path="blog-management/create" element={<BlogPostCreate />} />
          <Route path="blog-management/edit/:id" element={<BlogPostEdit />} />
          <Route path="performance-monitoring" element={<AdminPerformanceMonitoring />} />
          <Route path="translation-management" element={<TranslationManagement />} />
          <Route path="report-payments" element={<AdminReportPayments />} />
          <Route path="report-processing" element={<AdminReportProcessing />} />
          <Route path="api-management" element={<AdminAPIManagement />} />
          <Route path="audit-report" element={<AdminAuditReport />} />
          <Route path="static-images" element={<AdminStaticImageManager />} />
          <Route path="image-control" element={<ImageControlCenter />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          
          {/* Admin disputes route removed - mediation system disabled */}
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
    </Suspense>
  );
};

export default AppRoutes;
