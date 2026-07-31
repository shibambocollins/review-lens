import { useState, useEffect } from 'react';
import { Search, Star, Loader2 } from 'lucide-react';
import { Toast } from './components/Toast.jsx';
import { HomeView } from './components/HomeView.jsx';
import { DashboardView } from './components/DashboardView.jsx';
import { CompareView } from './components/CompareView.jsx';
import { mockBusinesses } from './data/mockBusinesses.js';
import { liveSearch, analyzeBusiness } from './services/api.js';

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'dashboard', 'compare'
  const [selectedBizId, setSelectedBizId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedBusinesses, setAnalyzedBusinesses] = useState(mockBusinesses);

  const [liveSearchResults, setLiveSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLiveSearching, setIsLiveSearching] = useState(false);

  // Geolocation: null coords = search without location bias.
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | pending | granted | denied | unsupported

  const activeBusiness = analyzedBusinesses.find(b => b.id === selectedBizId);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('unsupported');
      return;
    }
    setLocationStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => {
        setLocation(null);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  };

  const clearLocation = () => {
    setLocation(null);
    setLocationStatus('idle');
  };

  // Ask for location once on load so it's ready by the time the user searches.
  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced live search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        fetchLiveSearch(searchQuery);
      } else {
        setLiveSearchResults([]);
        setShowDropdown(false);
      }
    }, 600);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, location]);

  const fetchLiveSearch = async (query) => {
    setIsLiveSearching(true);
    setShowDropdown(true);
    try {
      const results = await liveSearch(query, location);
      setLiveSearchResults(results);
    } catch (err) {
      console.error(err);
      setLiveSearchResults([]);
      showToast('Live search failed - check the backend is running.', 'error');
    } finally {
      setIsLiveSearching(false);
    }
  };

  const performSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResults(liveSearchResults.length > 0 ? liveSearchResults : []);
    setView('home');
    setShowDropdown(false);
  };

  const handleSelectBusiness = async (business) => {
    const existing = analyzedBusinesses.find(b => b.id === business.id);
    if (existing) {
      setSelectedBizId(existing.id);
      setView('dashboard');
      setShowDropdown(false);
      window.scrollTo(0, 0);
      return;
    }

    setShowDropdown(false);
    setIsAnalyzing(true);
    try {
      const fullBusiness = await analyzeBusiness(business);
      setAnalyzedBusinesses(prev => [fullBusiness, ...prev]);
      setSelectedBizId(fullBusiness.id);
      setView('dashboard');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      showToast('Error generating AI analysis - check the backend is running.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#2B2B2B] selection:bg-[#2D6A4F]/20 selection:text-[#2D6A4F]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Global Navigation - Hidden on Print */}
      <header className="bg-[#FFFFFF] border-b border-[#6B705C]/20 sticky top-0 z-30 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => { setView('home'); setSelectedBizId(null); setSearchResults([]); setSearchQuery(''); setShowDropdown(false); }}
          >
            <span className="font-extrabold text-3xl font-serif tracking-tight text-[#2D6A4F]">
              Review<span className="text-[#C65D3B] font-sans italic relative">
                Lens
                <svg className="absolute -bottom-1 left-0 w-full h-1.5 text-[#6B705C]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="transparent" />
                </svg>
              </span>
            </span>
          </div>

          {view !== 'home' && (
            <form onSubmit={performSearch} className="hidden md:flex relative w-96">
              <input
                type="text"
                placeholder="Search to analyze any business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (liveSearchResults.length > 0) setShowDropdown(true); }}
                className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#6B705C]/20 rounded-full text-sm font-medium focus:bg-[#FFFFFF] focus:border-[#2D6A4F]/50 focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all outline-none text-[#2B2B2B]"
              />
              <Search className="absolute left-3 top-2.5 text-[#6B705C]" size={16} />

              {showDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] rounded-xl shadow-xl border border-[#6B705C]/20 overflow-hidden z-50 text-left">
                  {isLiveSearching ? (
                    <div className="p-4 text-[#6B705C] text-sm font-bold flex items-center"><Loader2 className="animate-spin mr-2" size={16} /> Finding businesses...</div>
                  ) : liveSearchResults.length > 0 ? (
                    <ul className="max-h-80 overflow-y-auto divide-y divide-[#6B705C]/10">
                      {liveSearchResults.map(biz => (
                        <li key={biz.id} onClick={() => handleSelectBusiness(biz)} className="p-3 hover:bg-[#FAF8F3]/80 cursor-pointer flex justify-between items-center transition-colors">
                          <div className="flex-1 pr-2">
                            <div className="font-extrabold text-[#2B2B2B] text-sm truncate">{biz.name}</div>
                            <div className="text-xs font-semibold text-[#6B705C] truncate">
                              {biz.category} • {biz.address}
                              {typeof biz.distanceKm === 'number' && ` · ${biz.distanceKm.toFixed(1)} km`}
                            </div>
                          </div>
                          <div className="flex items-center text-[#2B2B2B] text-xs font-bold shrink-0 bg-[#FAF8F3] border border-[#6B705C]/10 px-1.5 py-0.5 rounded"><Star size={12} className="fill-current text-amber-500 mr-1" /> {biz.rating}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-[#6B705C] font-semibold text-sm">No businesses found.</div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </header>

      <main className="p-4 md:p-8 relative">
        {isAnalyzing && (
          <div className="fixed inset-0 bg-[#FAF8F3]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-[#2D6A4F] animate-spin mb-6" />
            <h2 className="text-2xl font-extrabold text-[#2B2B2B] mb-2">AI is Analyzing Reviews...</h2>
            <p className="text-[#6B705C] font-medium max-w-md text-center">Reading thousands of customer feedback points, detecting sentiment, extracting aspects, and generating actionable insights.</p>
          </div>
        )}

        {view === 'home' && (
          <HomeView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={performSearch}
            isLiveSearching={isLiveSearching}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            liveSearchResults={liveSearchResults}
            onSelectBusiness={handleSelectBusiness}
            searchResults={searchResults}
            mockBusinesses={mockBusinesses}
            locationStatus={locationStatus}
            onRequestLocation={requestLocation}
            onClearLocation={clearLocation}
          />
        )}

        {view === 'dashboard' && activeBusiness && (
          <DashboardView
            business={activeBusiness}
            onBack={() => setView('home')}
            onCompare={() => setView('compare')}
            triggerToast={showToast}
          />
        )}

        {view === 'compare' && activeBusiness && (
          <CompareView
            baseBusiness={activeBusiness}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  );
}
