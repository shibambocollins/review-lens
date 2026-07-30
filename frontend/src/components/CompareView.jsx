import { useState } from 'react';
import { Search, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { compareBusiness } from '../services/api.js';

export const CompareView = ({ baseBusiness, onBack }) => {
  const [competitor, setCompetitor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const analytics = await compareBusiness(searchQuery);
      const fullBusiness = {
        ...analytics,
        image: analytics.image || `https://picsum.photos/seed/${analytics.id || 'comp'}/800/400`,
      };
      setCompetitor(fullBusiness);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not analyze that business. Try a different name.');
    } finally {
      setIsSearching(false);
    }
  };

  const b1 = baseBusiness;
  const b2 = competitor;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="flex items-center text-[#6B705C] hover:text-[#2B2B2B] transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-extrabold ml-6 text-[#2B2B2B]">Business Comparison</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-[#FFFFFF] rounded-xl shadow-sm border border-[#6B705C]/20 overflow-hidden">
        {/* Labels Column */}
        <div className="bg-[#FAF8F3]/80 p-6 border-r border-[#6B705C]/20 hidden md:block">
          <div className="h-32"></div>
          <div className="space-y-8 mt-8">
            <div className="font-bold text-[#2B2B2B]/90 py-2 border-b border-[#6B705C]/10">Overall Rating</div>
            <div className="font-bold text-[#2B2B2B]/90 py-2 border-b border-[#6B705C]/10">AI Sentiment Score</div>
            <div className="font-bold text-[#2B2B2B]/90 py-2 border-b border-[#6B705C]/10">Total Reviews</div>
            <div className="font-bold text-[#2B2B2B]/90 py-2 border-b border-[#6B705C]/10">Top Strength</div>
            <div className="font-bold text-[#2B2B2B]/90 py-2 border-b border-[#6B705C]/10">Top Weakness</div>
            <div className="font-bold text-[#2B2B2B]/90 py-2">Sentiment Breakdown</div>
          </div>
        </div>

        {/* Business 1 */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-[#6B705C]/20">
          <div className="h-32 flex flex-col items-center text-center justify-center mb-8">
            <img src={b1.image} alt={b1.name} className="w-16 h-16 rounded-full object-cover mb-3 shadow border border-[#6B705C]/10" />
            <h3 className="font-extrabold text-lg text-[#2B2B2B] leading-tight">{b1.name}</h3>
            <span className="text-xs font-semibold text-[#6B705C] mt-1">{b1.category}</span>
          </div>

          <div className="space-y-8">
            <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
              <span className="md:hidden text-sm font-bold text-[#6B705C]">Rating</span>
              <div className="flex items-center justify-end md:justify-center font-extrabold text-xl"><Star className="text-amber-500 fill-current mr-1" size={20} /> {b1.rating}</div>
            </div>
            <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
              <span className="md:hidden text-sm font-bold text-[#6B705C]">Sentiment Score</span>
              <div className="text-center font-extrabold text-xl text-[#2D6A4F]">{b1.sentiment.score}/10</div>
            </div>
            <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
              <span className="md:hidden text-sm font-bold text-[#6B705C]">Reviews</span>
              <div className="text-center text-lg font-bold text-[#2B2B2B]">{b1.reviewCount?.toLocaleString()}</div>
            </div>
            <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
              <span className="md:hidden text-sm font-bold text-[#6B705C]">Top Strength</span>
              <div className="text-center text-[#2D6A4F] font-bold">{b1.aspects?.[0]?.name || 'Overall Quality'}</div>
            </div>
            <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
              <span className="md:hidden text-sm font-bold text-[#6B705C]">Top Weakness</span>
              <div className="text-center text-[#C65D3B] font-bold">{b1.aspects?.[b1.aspects.length - 1]?.name || 'Pricing'}</div>
            </div>
            <div className="py-2">
              <span className="md:hidden text-sm font-bold text-[#6B705C] block mb-2">Sentiment Breakdown</span>
              <div className="flex h-3 rounded-full overflow-hidden w-full border border-[#6B705C]/10">
                <div style={{ width: `${b1.sentiment.positive}%` }} className="bg-[#2D6A4F]"></div>
                <div style={{ width: `${b1.sentiment.neutral}%` }} className="bg-[#6B705C]"></div>
                <div style={{ width: `${b1.sentiment.negative}%` }} className="bg-[#C65D3B]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-[#6B705C] mt-1">
                <span>Pos: {b1.sentiment.positive}%</span>
                <span>Neg: {b1.sentiment.negative}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business 2 (Competitor) */}
        <div className="p-6">
          {!b2 ? (
            <div className="h-full flex flex-col justify-center items-center min-h-[300px]">
              <h3 className="font-extrabold text-lg text-[#2B2B2B] mb-2 text-center">Compare Against...</h3>
              <p className="text-sm font-medium text-[#6B705C] mb-6 text-center">Search for a competitor to compare</p>
              <form onSubmit={handleSearch} className="w-full max-w-xs relative">
                <input
                  type="text"
                  placeholder="e.g. KFC, Nando's..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-[#6B705C]/30 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none text-sm font-medium text-[#2B2B2B]"
                />
                <button type="submit" disabled={isSearching || !searchQuery.trim()} className="absolute right-2 top-1.5 p-1 text-[#6B705C] hover:text-[#2D6A4F] disabled:opacity-50">
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </button>
              </form>
              {error && <p className="text-[#C65D3B] text-xs font-semibold mt-3 text-center max-w-xs">{error}</p>}
            </div>
          ) : (
            <>
              <div className="h-32 flex flex-col items-center text-center justify-center mb-8 relative group">
                <button onClick={() => setCompetitor(null)} className="absolute top-0 right-0 text-xs font-bold px-2 py-1 bg-[#FAF8F3] border border-[#6B705C]/20 text-[#6B705C] hover:bg-[#6B705C]/10 rounded opacity-0 md:group-hover:opacity-100 transition-opacity">Change</button>
                <img src={b2.image} alt={b2.name} className="w-16 h-16 rounded-full object-cover mb-3 shadow border border-[#6B705C]/10" />
                <h3 className="font-extrabold text-lg text-[#2B2B2B] leading-tight">{b2.name}</h3>
                <span className="text-xs font-semibold text-[#6B705C] mt-1">{b2.category}</span>
              </div>

              <div className="space-y-8">
                <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
                  <span className="md:hidden text-sm font-bold text-[#6B705C]">Rating</span>
                  <div className="flex items-center justify-end md:justify-center font-extrabold text-xl"><Star className="text-amber-500 fill-current mr-1" size={20} /> {b2.rating}</div>
                </div>
                <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
                  <span className="md:hidden text-sm font-bold text-[#6B705C]">Sentiment Score</span>
                  <div className="text-center font-extrabold text-xl text-[#6B705C]">{b2.sentiment?.score || (b2.rating * 2).toFixed(1)}/10</div>
                </div>
                <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
                  <span className="md:hidden text-sm font-bold text-[#6B705C]">Reviews</span>
                  <div className="text-center text-lg font-bold text-[#2B2B2B]">{b2.reviewCount?.toLocaleString()}</div>
                </div>
                <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
                  <span className="md:hidden text-sm font-bold text-[#6B705C]">Top Strength</span>
                  <div className="text-center text-[#2D6A4F] font-bold">{b2.aspects?.[0]?.name || 'Service'}</div>
                </div>
                <div className="py-2 border-b border-[#6B705C]/5 flex md:block justify-between items-center">
                  <span className="md:hidden text-sm font-bold text-[#6B705C]">Top Weakness</span>
                  <div className="text-center text-[#C65D3B] font-bold">{b2.aspects?.[b2.aspects.length - 1]?.name || 'Wait Time'}</div>
                </div>
                <div className="py-2">
                  <span className="md:hidden text-sm font-bold text-[#6B705C] block mb-2">Sentiment Breakdown</span>
                  <div className="flex h-3 rounded-full overflow-hidden w-full border border-[#6B705C]/10">
                    <div style={{ width: `${b2.sentiment?.positive || 0}%` }} className="bg-[#2D6A4F]"></div>
                    <div style={{ width: `${b2.sentiment?.neutral || 0}%` }} className="bg-[#6B705C]"></div>
                    <div style={{ width: `${b2.sentiment?.negative || 0}%` }} className="bg-[#C65D3B]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-[#6B705C] mt-1">
                    <span>Pos: {b2.sentiment?.positive || 0}%</span>
                    <span>Neg: {b2.sentiment?.negative || 0}%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
