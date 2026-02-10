
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AdminLayout from "@/components/layouts/AdminLayout";
import { PageSkeleton } from "@/components/ui/skeletons/PageSkeleton";

// Enhanced fallback component with skeleton for better UX
const LoadingFallback = () => <PageSkeleton />;

// Lazy loading de todas las páginas con manejo de errores mejorado
const NotFound = lazy(() => import("../pages/NotFound").catch(() => ({ default: () => <div>Error loading page</div> })));

// Páginas públicas
const Home = lazy(() => import("../pages/Home").catch(() => ({ default: () => <div>Error loading Home page</div> })));
const Login = lazy(() => import("../pages/Login").catch(() => ({ default: () => <div>Error loading Login page</div> })));
const Register = lazy(() => import("../pages/Register").catch(() => ({ default: () => <div>Error loading Register page</div> })));
const RegisterConfirmation = lazy(() => import("../pages/RegisterConfirmation").catch(() => ({ default: () => <div>Error loading RegisterConfirmation page</div> })));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword").catch(() => ({ default: () => <div>Error loading ForgotPassword page</div> })));
const ResetPassword = lazy(() => import("../pages/ResetPassword").catch(() => ({ default: () => <div>Error loading ResetPassword page</div> })));

// Lazy loading de todas las páginas
const Services = lazy(() => import("../pages/Services").catch(() => ({ default: () => <div>Error loading Services page</div> })));
const ContactPage = lazy(() => import("../pages/ContactPage").catch(() => ({ default: () => <div>Error loading ContactPage page</div> })));
const VehicleGallery = lazy(() => import("../pages/VehicleGallery").catch(() => ({ default: () => <div>Error loading VehicleGallery page</div> })));
const VehiclePreviewPage = lazy(() => import("../pages/VehiclePreviewPage").catch(() => ({ default: () => <div>Error loading VehiclePreviewPage page</div> })));
const VehicleInformationPage = lazy(() => import("../pages/VehicleInformationPage").catch(() => ({ default: () => <div>Error loading VehicleInformationPage page</div> })));
const VehicleDetailPage = lazy(() => import("../pages/VehicleDetailPage").catch(() => ({ default: () => <div>Error loading VehicleDetailPage page</div> })));
const VehicleDetailsPage = lazy(() => import("../pages/VehicleDetailsPage").catch(() => ({ default: () => <div>Error loading VehicleDetailsPage page</div> })));
const VehicleEquipmentPage = lazy(() => import("../pages/VehicleEquipmentPage").catch(() => ({ default: () => <div>Error loading VehicleEquipmentPage page</div> })));
const VehicleFilesPage = lazy(() => import("../pages/VehicleFilesPage").catch(() => ({ default: () => <div>Error loading VehicleFilesPage page</div> })));
const VehicleDamagesPage = lazy(() => import("../pages/VehicleDamagesPage").catch(() => ({ default: () => <div>Error loading VehicleDamagesPage page</div> })));
const VehicleAdditionalInfoPage = lazy(() => import("../pages/VehicleAdditionalInfoPage").catch(() => ({ default: () => <div>Error loading VehicleAdditionalInfoPage page</div> })));
const LiveAuctionsPage = lazy(() => import("../pages/auctions/LiveAuctionsPage").catch(() => ({ default: () => <div>Error loading LiveAuctionsPage page</div> })));
const AuctionDetailPage = lazy(() => import("../pages/auctions/AuctionDetailPage").catch(() => ({ default: () => <div>Error loading AuctionDetailPage page</div> })));
const PublishAuctionPage = lazy(() => import("../pages/auctions/PublishAuctionPage").catch(() => ({ default: () => <div>Error loading PublishAuctionPage page</div> })));
const Exchanges = lazy(() => import("../pages/Exchanges").catch(() => ({ default: () => <div>Error loading Exchanges page</div> })));
const BulletinBoard = lazy(() => import("../pages/BulletinBoard").catch(() => ({ default: () => <div>Error loading BulletinBoard page</div> })));
const BulletinDetailPage = lazy(() => import("../pages/BulletinDetailPage").catch(() => ({ default: () => <div>Error loading BulletinDetailPage page</div> })));
const Transport = lazy(() => import("../pages/Transport").catch(() => ({ default: () => <div>Error loading Transport page</div> })));
const TransportExpressPage = lazy(() => import("../pages/TransportExpressPage").catch(() => ({ default: () => <div>Error loading TransportExpressPage page</div> })));
const CommissionCalculatorPage = lazy(() => import("../pages/CommissionCalculatorPage").catch(() => ({ default: () => <div>Error loading CommissionCalculatorPage page</div> })));
const ImportCalculator = lazy(() => import("../pages/ImportCalculator").catch(() => ({ default: () => <div>Error loading ImportCalculator page</div> })));
const VehicleReports = lazy(() => import("../pages/VehicleReports").catch(() => ({ default: () => <div>Error loading VehicleReports page</div> })));
const RequestReport = lazy(() => import("../pages/RequestReport").catch(() => ({ default: () => <div>Error loading RequestReport page</div> })));
const VehicleReportsInfoPage = lazy(() => import("../pages/VehicleReportsInfoPage").catch(() => ({ default: () => <div>Error loading VehicleReportsInfoPage page</div> })));
const VehicleGalleryInfoPage = lazy(() => import("../pages/VehicleGalleryInfoPage").catch(() => ({ default: () => <div>Error loading VehicleGalleryInfoPage page</div> })));
const MessagingInfoPage = lazy(() => import("../pages/MessagingInfoPage").catch(() => ({ default: () => <div>Error loading MessagingInfoPage page</div> })));

const BulletinInfoPage = lazy(() => import("../pages/BulletinInfoPage").catch(() => ({ default: () => <div>Error loading BulletinInfoPage page</div> })));
const AuctionsInfoPage = lazy(() => import("../pages/AuctionsInfoPage").catch(() => ({ default: () => <div>Error loading AuctionsInfoPage page</div> })));
const ExchangesInfoPage = lazy(() => import("../pages/ExchangesInfoPage").catch(() => ({ default: () => <div>Error loading ExchangesInfoPage page</div> })));
const OtherServicesPage = lazy(() => import("../pages/OtherServicesPage").catch(() => ({ default: () => <div>Error loading OtherServicesPage page</div> })));
const BlogList = lazy(() => import("../pages/blog/BlogList").catch(() => ({ default: () => <div>Error loading BlogList page</div> })));
const BlogView = lazy(() => import("../pages/blog/BlogView").catch(() => ({ default: () => <div>Error loading BlogView page</div> })));
const BlogPostView = lazy(() => import("../pages/blog/BlogPostView").catch(() => ({ default: () => <div>Error loading BlogPostView page</div> })));
const BlogMainPage = lazy(() => import("../pages/BlogMainPage").catch(() => ({ default: () => <div>Error loading BlogMainPage page</div> })));
const UsersDirectory = lazy(() => import("../pages/UsersDirectory").catch(() => ({ default: () => <div>Error loading UsersDirectory page</div> })));
const CommunityPage = lazy(() => import("../pages/CommunityPage").catch(() => ({ default: () => <div>Error loading CommunityPage page</div> })));
const TermsAndConditionsPage = lazy(() => import("../pages/TermsAndConditionsPage").catch(() => ({ default: () => <div>Error loading TermsAndConditionsPage page</div> })));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage").catch(() => ({ default: () => <div>Error loading PrivacyPolicyPage page</div> })));
const CookiesPage = lazy(() => import("../pages/CookiesPage").catch(() => ({ default: () => <div>Error loading CookiesPage page</div> })));
const AuctionPoliciesPage = lazy(() => import("../pages/AuctionPoliciesPage").catch(() => ({ default: () => <div>Error loading AuctionPoliciesPage page</div> })));

// Páginas protegidas
const Dashboard = lazy(() => import("../pages/DashboardMainPage").catch(() => ({ default: () => <div>Error loading Dashboard page</div> })));
const VehicleEditPage = lazy(() => import("../pages/VehicleEditPage").catch(() => ({ default: () => <div>Error loading VehicleEditPage page</div> })));
const VehicleManagement = lazy(() => import("../pages/VehicleManagement").catch(() => ({ default: () => <div>Error loading VehicleManagement page</div> })));
const MyVehicles = lazy(() => import("../pages/MyVehicles").catch(() => ({ default: () => <div>Error loading MyVehicles page</div> })));
// Removed MyAuctions page (auctions feature disabled)
const ExchangeForm = lazy(() => import("../pages/ExchangeForm").catch(() => ({ default: () => <div>Error loading ExchangeForm page</div> })));
const ExchangeProposal = lazy(() => import("../pages/ExchangeProposal").catch(() => ({ default: () => <div>Error loading ExchangeProposal page</div> })));
const PublishAnnouncementPage = lazy(() => import("../pages/PublishAnnouncementPage").catch(() => ({ default: () => <div>Error loading PublishAnnouncementPage page</div> })));
const TransportQuoteManagement = lazy(() => import("../pages/TransportQuoteManagement").catch(() => ({ default: () => <div>Error loading TransportQuoteManagement page</div> })));
const Messages = lazy(() => import("../pages/Messages").catch(() => ({ default: () => <div>Error loading Messages page</div> })));
// Removed Disputes page (mediation system disabled)

// CORREGIDO: Importar MyProfile para /profile
const MyProfile = lazy(() => import("../pages/MyProfile").catch(() => ({ default: () => <div>Error loading MyProfile page</div> })));
// CORREGIDO: Usar ProfilePage para /user/:id (en lugar de UserProfile)
const ProfilePage = lazy(() => import("../pages/ProfilePage").catch(() => ({ default: () => <div>Error loading ProfilePage page</div> })));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage").catch(() => ({ default: () => <div>Error loading NotificationsPage page</div> })));

// Lazy loading of admin pages
const AdminControlPanel = lazy(() => import("../pages/admin/ControlPanel").catch(() => ({ default: () => <div>Error loading ControlPanel page</div> })));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard").catch(() => ({ default: () => <div>Error loading AdminDashboard page</div> })));
const AdminUsers = lazy(() => import("../pages/admin/Users").catch(() => ({ default: () => <div>Error loading AdminUsers page</div> })));
const AdminUserView = lazy(() => import("../pages/admin/UserView").catch(() => ({ default: () => <div>Error loading AdminUserView page</div> })));
const AdminUserEdit = lazy(() => import("../pages/admin/UserEdit").catch(() => ({ default: () => <div>Error loading AdminUserEdit page</div> })));
const AdminVehicles = lazy(() => import("../pages/admin/Vehicles").catch(() => ({ default: () => <div>Error loading AdminVehicles page</div> })));
// Removed AdminAuctions page (auctions feature disabled)
const AdminConversations = lazy(() => import("../pages/admin/Conversations").catch(() => ({ default: () => <div>Error loading AdminConversations page</div> })));
const AdminConversationDetail = lazy(() => import("../pages/admin/ConversationDetail").catch(() => ({ default: () => <div>Error loading AdminConversationDetail page</div> })));
const AdminCommunicationsDashboard = lazy(() => import("../pages/admin/AdminCommunicationsDashboard").catch(() => ({ default: () => <div>Error loading AdminCommunicationsDashboard page</div> })));
const AdminDirectoryChat = lazy(() => import("../pages/admin/DirectoryChat").catch(() => ({ default: () => <div>Error loading AdminDirectoryChat page</div> })));
const AdminExchanges = lazy(() => import("../pages/admin/Exchanges").catch(() => ({ default: () => <div>Error loading AdminExchanges page</div> })));
const AdminRegistrationRequests = lazy(() => import("../pages/admin/RegistrationRequests").catch(() => ({ default: () => <div>Error loading AdminRegistrationRequests page</div> })));
const AdminActivityLogs = lazy(() => import("../pages/admin/ActivityLogs").catch(() => ({ default: () => <div>Error loading AdminActivityLogs page</div> })));
const AdminRolesAndPermissions = lazy(() => import("../pages/admin/RolesAndPermissions").catch(() => ({ default: () => <div>Error loading AdminRolesAndPermissions page</div> })));
const AdminAnalytics = lazy(() => import("../pages/admin/Analytics").catch(() => ({ default: () => <div>Error loading AdminAnalytics page</div> })));
const AdminNotifications = lazy(() => import("../pages/admin/Notifications").catch(() => ({ default: () => <div>Error loading AdminNotifications page</div> })));
const AdminTransportQuotes = lazy(() => import("../pages/admin/TransportQuotes").catch(() => ({ default: () => <div>Error loading AdminTransportQuotes page</div> })));
const AdminPerformanceMonitoring = lazy(() => import("../pages/admin/PerformanceMonitoring").catch(() => ({ default: () => <div>Error loading PerformanceMonitoring page</div> })));
const AdminVehicleReports = lazy(() => import("../pages/admin/VehicleReportsAdmin").catch(() => ({ default: () => <div>Error loading VehicleReportsAdmin page</div> })));
const BlogManagement = lazy(() => import("../pages/blog/BlogManagement").catch(() => ({ default: () => <div>Error loading BlogManagement page</div> })));
const BlogPostCreate = lazy(() => import("../pages/blog/BlogPostCreate").catch(() => ({ default: () => <div>Error loading BlogPostCreate page</div> })));
const BlogPostEdit = lazy(() => import("../pages/blog/BlogPostEdit").catch(() => ({ default: () => <div>Error loading BlogPostEdit page</div> })));
const TranslationManagement = lazy(() => import("../pages/TranslationManagement").catch(() => ({ default: () => <div>Error loading TranslationManagement page</div> })));
const ImageDiagnosticPage = lazy(() => import("../pages/ImageDiagnosticPage").catch(() => ({ default: () => <div>Error loading ImageDiagnosticPage page</div> })));
const VideoUploader = lazy(() => import("../components/admin/VideoUploader").then(module => ({ default: module.VideoUploader })).catch(() => ({ default: () => <div>Error loading VideoUploader</div> })));
const AdminReportPayments = lazy(() => import("../pages/admin/ReportPayments").catch(() => ({ default: () => <div>Error loading ReportPayments page</div> })));
const AdminReportProcessing = lazy(() => import("../pages/admin/ReportProcessing").catch(() => ({ default: () => <div>Error loading ReportProcessing page</div> })));
const AdminAPIManagement = lazy(() => import("../pages/admin/APIManagement").catch(() => ({ default: () => <div>Error loading APIManagement page</div> })));
const APIManagement = lazy(() => import("../pages/APIManagement").catch(() => ({ default: () => <div>Error loading APIManagement page</div> })));
const AdminAuditReport = lazy(() => import("../pages/admin/AuditReport").catch(() => ({ default: () => <div>Error loading AuditReport page</div> })));
const AdminStaticImageManager = lazy(() => import("../pages/admin/StaticImageManager").catch(() => ({ default: () => <div>Error loading StaticImageManager page</div> })));
const ImageControlCenter = lazy(() => import("../pages/admin/ImageControlCenter").catch(() => ({ default: () => <div>Error loading ImageControlCenter page</div> })));
// Removed AdminDisputes page (mediation system disabled)

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <main id="main-content">
        <Routes>
        {/* Ruta temporal sin layout para subir video */}
        <Route path="upload-video" element={<VideoUploader />} />
        
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
          <Route path="other-services" element={<OtherServicesPage />} />
          <Route path="blog" element={<BlogMainPage />} />
          <Route path="blog-view" element={<BlogView />} />
          <Route path="blog/:id" element={<BlogPostView />} />
          {/* CORREGIDO: Usar ProfilePage para la ruta de usuario */}
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="users" element={<UsersDirectory />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="terms" element={<TermsAndConditionsPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="auction-policies" element={<AuctionPoliciesPage />} />
          
          {/* Rutas de diagnóstico y generación de imágenes */}
          <Route path="image-diagnostic" element={<ImageDiagnosticPage />} />
          
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
