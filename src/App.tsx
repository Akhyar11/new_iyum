import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CatalogPage } from './pages/CatalogPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { getStoredAdminSession, clearAdminSession } from './lib/adminAuth';
import { Package } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'detail' | 'recommendation' | 'admin'>('catalog');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check auth state and URL hash on mount
  useEffect(() => {
    const session = getStoredAdminSession();
    if (session) {
      setIsAdminAuthenticated(true);
    } else {
      setIsAdminAuthenticated(false);
    }

    // Sync from hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin' || hash === 'admin-dashboard' || hash.startsWith('admin')) {
      setActiveTab('admin');
    } else if (hash === 'rekomendasi') {
      setActiveTab('recommendation');
    }
  }, []);

  const handleViewDetail = (pkg: Package) => {
    setSelectedPackage(pkg);
    setActiveTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRecommendation = () => {
    setActiveTab('recommendation');
    window.location.hash = 'rekomendasi';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setActiveTab('catalog');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAdminAuthenticated(false);
    setActiveTab('catalog');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Hide navbar on admin login page for focused layout if desired, or keep it consistent */}
      <Navbar 
        activeTab={activeTab === 'detail' ? 'catalog' : activeTab} 
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'admin') {
            window.location.hash = 'admin';
          } else if (tab === 'recommendation') {
            window.location.hash = 'rekomendasi';
          } else {
            window.location.hash = '';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      <main className="flex-1">
        {activeTab === 'catalog' && (
          <CatalogPage 
            onStartRecommendation={handleStartRecommendation}
            onSelectPackage={handleViewDetail}
          />
        )}

        {activeTab === 'detail' && selectedPackage && (
          <PackageDetailPage
            pkg={selectedPackage}
            onBack={handleBackToCatalog}
            onStartRecommendation={handleStartRecommendation}
          />
        )}

        {activeTab === 'recommendation' && (
          <RecommendationPage
            onBackToCatalog={handleBackToCatalog}
            onViewPackageDetail={handleViewDetail}
          />
        )}

        {activeTab === 'admin' && (
          <ProtectedRoute
            isAuthenticated={isAdminAuthenticated}
            fallback={
              <AdminLoginPage
                unauthorizedNotice="Akses ditolak: Anda harus login sebagai admin untuk mengakses area pengelolaan."
                onLoginSuccess={() => {
                  setIsAdminAuthenticated(true);
                  setActiveTab('admin');
                  window.location.hash = 'admin';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToCatalog={handleBackToCatalog}
              />
            }
          >
            <AdminDashboardPage
              onLogout={handleLogout}
              onNavigateToCatalog={handleBackToCatalog}
            />
          </ProtectedRoute>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
