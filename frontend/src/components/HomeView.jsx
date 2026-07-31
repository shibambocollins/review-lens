import { Search, Star, MapPin, Loader2 } from 'lucide-react';
import { Badge } from './Badge.jsx';
import { Card } from './Card.jsx';

export const HomeView = ({
  searchQuery,
  setSearchQuery,
  onSubmit,
  isLiveSearching,
  showDropdown,
  setShowDropdown,
  liveSearchResults,
  onSelectBusiness,
  searchResults,
  mockBusinesses,
  locationStatus,
  onRequestLocation,
  onClearLocation,
}) => {
  const businessesToShow = searchResults.length > 0 ? searchResults : mockBusinesses;

  return (
    <div className="max-w-4xl mx-auto mt-10 md:mt-20">
      <div className="text-center mb-12 animate-fade-in-up">
        <Badge variant="primary" className="mb-4 inline-block font-bold">AI-Powered Analytics</Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#2B2B2B] mb-6 tracking-tight leading-tight">
          Understand Customer Feedback in{' '}
          <span className="text-[#C65D3B] relative font-serif italic pr-2">
            Seconds
            <svg className="absolute -bottom-2 w-full h-3 text-[#2D6A4F]/30 fill-current" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="2" fill="transparent" />
            </svg>
          </span>
        </h1>
        <p className="text-lg md:text-xl font-medium text-[#6B705C] mb-10 max-w-2xl mx-auto">
          Transform thousands of unstructured reviews into actionable business intelligence.
          Search for any business to instantly generate a comprehensive AI analysis report.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <form onSubmit={onSubmit} className="relative shadow-2xl rounded-2xl border border-[#6B705C]/20 bg-[#FFFFFF]">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-[#6B705C]" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-32 py-5 border-0 bg-transparent rounded-2xl text-lg font-medium text-[#2B2B2B] placeholder-[#6B705C]/60 focus:ring-4 focus:ring-[#2D6A4F]/20 transition-shadow outline-none"
              placeholder="Search for a restaurant, hotel, or retail store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.length > 2) setShowDropdown(true); }}
            />
            <button
              type="submit"
              disabled={isLiveSearching || !searchQuery.trim()}
              className="absolute right-2 top-2 bottom-2 bg-[#2D6A4F] text-[#FFFFFF] px-6 rounded-xl font-bold hover:bg-[#1e4735] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md"
            >
              {isLiveSearching ? <Loader2 size={20} className="animate-spin" /> : 'Analyze'}
            </button>
          </form>

          {locationStatus && locationStatus !== 'unsupported' && (
            <div className="mt-3 flex justify-center">
              {locationStatus === 'granted' && (
                <button
                  type="button"
                  onClick={onClearLocation}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 px-3 py-1.5 rounded-full hover:bg-[#2D6A4F]/15 transition-colors"
                >
                  <MapPin size={12} /> Showing results near you
                </button>
              )}
              {locationStatus === 'pending' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B705C] bg-[#6B705C]/10 px-3 py-1.5 rounded-full">
                  <Loader2 size={12} className="animate-spin" /> Detecting your location...
                </span>
              )}
              {(locationStatus === 'idle' || locationStatus === 'denied') && (
                <button
                  type="button"
                  onClick={onRequestLocation}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B705C] bg-[#6B705C]/10 border border-[#6B705C]/20 px-3 py-1.5 rounded-full hover:bg-[#6B705C]/20 transition-colors"
                >
                  <MapPin size={12} /> {locationStatus === 'denied' ? 'Location blocked — click to retry' : 'Search near me'}
                </button>
              )}
            </div>
          )}

          {showDropdown && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#6B705C]/20 overflow-hidden z-50 text-left animate-fade-in-up">
              {isLiveSearching ? (
                <div className="p-6 text-[#6B705C] font-bold text-sm flex items-center justify-center"><Loader2 className="animate-spin mr-2 text-[#2D6A4F]" size={18} /> Searching directory...</div>
              ) : liveSearchResults.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto divide-y divide-[#6B705C]/10">
                  {liveSearchResults.map(biz => (
                    <li key={biz.id} onClick={() => onSelectBusiness(biz)} className="p-4 hover:bg-[#FAF8F3] cursor-pointer flex justify-between items-center group transition-colors">
                      <div className="flex-1 pr-4">
                        <div className="font-extrabold text-[#2B2B2B] text-base group-hover:text-[#2D6A4F] transition-colors">{biz.name}</div>
                        <div className="text-sm font-semibold text-[#6B705C]">
                          {biz.category} • {biz.address}
                          {typeof biz.distanceKm === 'number' && ` · ${biz.distanceKm.toFixed(1)} km away`}
                        </div>
                      </div>
                      <div className="flex items-center text-[#2B2B2B] text-sm font-bold shrink-0 bg-[#FAF8F3] border border-[#6B705C]/20 px-2 py-1 rounded-lg">
                        <Star size={14} className="fill-current text-amber-500 mr-1" /> {biz.rating}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-[#6B705C] font-semibold text-center">No matching businesses found. Try a different search.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-sm font-extrabold text-[#6B705C]/80 uppercase tracking-wider mb-6 flex items-center before:content-[''] before:h-px before:flex-1 before:bg-[#6B705C]/20 before:mr-4 after:content-[''] after:h-px after:flex-1 after:bg-[#6B705C]/20 after:ml-4">
          {searchResults.length > 0 ? `Search Results for "${searchQuery}"` : 'Discover Insights'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessesToShow.map(business => {
            const Icon = business.icon || Star;
            const imageUrl = business.image || `https://picsum.photos/seed/${business.id}/800/400`;

            return (
              <Card
                key={business.id}
                className="cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-[#2D6A4F]/30 transition-all duration-300 group flex flex-col"
              >
                <div className="h-32 overflow-hidden relative shrink-0">
                  <img
                    src={imageUrl}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 to-transparent flex items-end p-4">
                    <span className="text-[#FFFFFF] font-bold flex items-center">
                      <Star size={14} className="fill-current text-amber-500 mr-1" /> {business.rating}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow bg-[#FFFFFF]" onClick={() => onSelectBusiness(business)}>
                  <div className="flex items-center text-xs font-bold text-[#2D6A4F] mb-2 uppercase tracking-wide">
                    <Icon size={14} className="mr-1" /> {business.category}
                  </div>
                  <h4 className="font-extrabold text-lg text-[#2B2B2B] mb-1 leading-tight group-hover:text-[#C65D3B] transition-colors">{business.name}</h4>
                  <p className="text-[#6B705C] font-medium text-sm flex items-center mb-2 line-clamp-1">
                    <MapPin size={12} className="mr-1 shrink-0" /> {business.address}
                    {typeof business.distanceKm === 'number' && (
                      <span className="ml-2 text-[#2D6A4F] font-bold shrink-0">· {business.distanceKm.toFixed(1)} km</span>
                    )}
                  </p>
                  {business.shortDescription && (
                    <p className="text-[#6B705C]/90 text-sm mb-4 line-clamp-2 font-medium">
                      {business.shortDescription}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-[#6B705C]/10 pt-4">
                    <span className="text-xs font-semibold text-[#6B705C]">{business.reviewCount?.toLocaleString()} Reviews</span>
                    <span className="text-sm font-bold text-[#2D6A4F] group-hover:text-[#1e4735] flex items-center">
                      View Analysis &rarr;
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {searchResults.length === 0 && !isLiveSearching && searchQuery && (
          <div className="text-center py-12 font-bold text-[#6B705C] bg-[#FFFFFF] rounded-xl border border-[#6B705C]/20 border-dashed">
            No demo businesses found matching "{searchQuery}". Try searching for something else.
          </div>
        )}
      </div>
    </div>
  );
};
