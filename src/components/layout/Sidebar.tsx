import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button';
import { LOGO_IMAGES } from '@/constants/imageAssets';

// Add new imports
import { Calculator, FileText } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border py-4">
      <div className="px-6 mb-6">
        <Link to="/" className="flex items-center text-lg font-semibold text-foreground">
          <img src={LOGO_IMAGES.primary} alt="KONTACT VO Logo" className="h-8 w-auto mr-2" />
          KONTACT VO
        </Link>
      </div>

      <ScrollArea className="flex-1 space-y-1">
        <nav className="flex-1">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                  <path fillRule="evenodd" d="M3 17.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM19 10a.75.75 0 00-1.5 0v2.5h-14V10a.75.75 0 00-1.5 0v6a.75.75 0 00.75.75h17.5a.75.75 0 00.75-.75v-6zM3.75 3a.75.75 0 00-.75.75v6.5h17.5V3.75a.75.75 0 00-.75-.75H3.75z" clipRule="evenodd" />
                </svg>
                {t('nav.dashboard', { fallback: 'Dashboard' })}
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/services' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333a1.333 1.333 0 112.667 0v6.334a1.333 1.333 0 01-2.667 0v-6.334zM10 10a1 1 0 112 0v7a1 1 0 01-2 0v-7zM14 9.667a.667.667 0 111.333 0v7.666a.667.667 0 01-1.333 0v-7.666zM17 9.5a.5.5 0 111 0v8a.5.5 0 01-1 0v-8z" />
                </svg>
                {t('nav.services', { fallback: 'Services' })}
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname.startsWith('/blog') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                {t('blog.title', { fallback: 'Blog' })}
              </Link>
            </li>
            <li>
              <Link
                to="/import-calculator"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/import-calculator' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {t('calculator.title', { fallback: 'Import Calculator' })}
              </Link>
            </li>
            <li>
              <Link
                to="/vehicles"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/vehicles' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M2.25 2.25a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V5.25a3 3 0 00-3-3H2.25zM5.516 16.592a.75.75 0 01-.679-.915 63.482 63.482 0 0111.326 0 .75.75 0 01-.679.915H5.516z" />
                </svg>
                {t('nav.vehicles', { fallback: 'Vehicles' })}
              </Link>
            </li>
            {/* Auctions removed - feature disabled */}
            <li>
              <Link
                to="/vehicle-management"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/vehicle-management' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('vehicles.management', { fallback: 'Vehicle Management' })}
              </Link>
            </li>
            <li>
              <Link
                to="/publish-announcement"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/publish-announcement' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('control.addAnnouncement', { fallback: 'Add Announcement' })}
              </Link>
            </li>
            <li>
              <Link
                to="/bulletin"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/bulletin' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M2 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 11a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1v-6zM12 10a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
                </svg>
                {t('nav.bulletinBoard', { fallback: 'Bulletin Board' })}
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/reports' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M6 2a1 1 0 00-1 1v1H5a1 1 0 00-.707.293l-2 2A1 1 0 003 12h2.586a1 1 0 01.707.293l2 2a1 1 0 010 1.414l-2 2A1 1 0 005 18H6a4 4 0 004-4v-1h1v1a4 4 0 004 4h1a1 1 0 00.707-.293l2-2a1 1 0 000-1.414l-2-2A1 1 0 0015 12h-2.586a1 1 0 01-.707-.293l-2-2A1 1 0 0010 9.414l2-2A1 1 0 0015 6h-1a4 4 0 00-4-4H10zm0 3a1 1 0 110 2 1 1 0 010-2zm-2 7a1 1 0 112 0v3a1 1 0 11-2 0v-3zm4-4a1 1 0 112 0v5a1 1 0 11-2 0v-5zm2-3a1 1 0 00-1-1H9a1 1 0 00-1 1v1h6v-1z" />
                </svg>
                {t('nav.vehicleReports', { fallback: 'Vehicle Reports' })}
              </Link>
            </li>
            <li>
              <Link
                to="/transport"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/transport' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M2 10a8 8 0 0116 0v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5zm9 4a1 1 0 11-2 0 1 1 0 012 0zm-.899-4.474a.75.75 0 00-1.002.899c.147.533.576.944 1.113 1.048a3.75 3.75 0 013.481 0c.537-.104.966-.515 1.113-1.048a.75.75 0 00-1.002-.899 2.25 2.25 0 00-4.5 0z" />
                </svg>
                {t('nav.transport', { fallback: 'Express Transport' })}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/control-panel"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/admin/control-panel' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.707.293l-2 2A1 1 0 003 12h2.586a1 1 0 01.707.293l2 2a1 1 0 010 1.414l-2 2A1 1 0 005 18H6a4 4 0 004-4v-1h1v1a4 4 0 004 4h1a1 1 0 00.707-.293l2-2a1 1 0 000-1.414l-2-2A1 1 0 0015 12h-2.586a1 1 0 01-.707-.293l-2-2A1 1 0 0010 9.414l2-2A1 1 0 0015 6h-1a4 4 0 00-4-4H10zm0 3a1 1 0 110 2 1 1 0 010-2zm-2 7a1 1 0 112 0v3a1 1 0 11-2 0v-3zm4-4a1 1 0 112 0v5a1 1 0 11-2 0v-5zm2-3a1 1 0 00-1-1H9a1 1 0 00-1 1v1h6v-1z" clipRule="evenodd" />
                </svg>
                {t('nav.controlPanel', { fallback: 'Control Panel' })}
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/messages' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm9 1a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM4 13a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm5 1a1 1 0 110 2h-2a1 1 0 110-2h2z" />
                </svg>
                {t('nav.messages', { fallback: 'Messages' })}
              </Link>
            </li>
            <li>
              <Link
                to="/exchanges"
                className={`flex items-center text-sm px-3 py-2 rounded-md ${
                  location.pathname === '/exchanges' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M6.5 2a4.5 4.5 0 00-3.213 7.787L9 17.25V13.5a1 1 0 011-1h4a1 1 0 011 1v3.75l5.713-7.463A4.5 4.5 0 0013.5 2h-7z" />
                </svg>
                {t('nav.exchanges', { fallback: 'Exchanges' })}
              </Link>
            </li>
            {/* My Auctions removed - feature disabled */}
          </ul>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url as string} />
            <AvatarFallback className="bg-primary text-primary-foreground">{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{user?.email}</span>
        </div>
        <Button variant="ghost" className="w-full mt-2 justify-start text-muted-foreground hover:text-foreground" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
