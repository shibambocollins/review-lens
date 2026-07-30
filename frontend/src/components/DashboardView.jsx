import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Star, MessageSquare, TrendingUp, MapPin,
  ThumbsUp, ThumbsDown, CheckCircle,
  Download, Share2, GitCompare, ArrowLeft, Filter,
  Zap, Activity,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { COLORS } from '../data/colors.js';

export const DashboardView = ({ business, onBack, onCompare, triggerToast }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

const handleExportPDF = async () => {
    setIsExporting(true);
    triggerToast('Generating PDF report...');
    const originalTab = activeTab;
    const tabs = ['overview', 'aspects', 'reviews'];
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    try {
      for (let i = 0; i < tabs.length; i++) {
        setActiveTab(tabs[i]);
        // let React finish re-rendering the new tab before we screenshot it
        await new Promise((resolve) => setTimeout(resolve, 350));

        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#FAF8F3',
        });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      }

      pdf.save(`${business.name.replace(/\s+/g, '_')}_ReviewLens_Report.pdf`);
      triggerToast('PDF report downloaded!');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to generate PDF report.', 'error');
    } finally {
      setActiveTab(originalTab);
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${business.name} - ReviewLens Analysis`,
      text: business.aiSummary,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled - no toast needed
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      triggerToast('Sharing link copied to clipboard!', 'info');
    }
  };

  if (!business) return null;

  return (
    <div className="max-w-7xl mx-auto pb-12 print:max-w-full print:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 print:hidden gap-4">
        <button onClick={onBack} className="flex items-center text-[#6B705C] hover:text-[#2B2B2B] transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Search
        </button>
        <div className="flex space-x-3">
          <button onClick={() => onCompare(business.id)} className="flex items-center px-4 py-2 bg-[#FFFFFF] border border-[#6B705C]/30 rounded-lg text-[#2B2B2B]/90 hover:bg-[#FAF8F3] transition-colors shadow-sm font-medium">
            <GitCompare size={18} className="mr-2 text-[#6B705C]" /> Compare
          </button>
          <button onClick={handleShare} className="flex items-center px-4 py-2 bg-[#FFFFFF] border border-[#6B705C]/30 rounded-lg text-[#2B2B2B]/90 hover:bg-[#FAF8F3] transition-colors shadow-sm font-medium">
            <Share2 size={18} className="mr-2 text-[#6B705C]" /> Share
          </button>
         <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center px-4 py-2 bg-[#2D6A4F] text-[#FFFFFF] rounded-lg hover:bg-[#1e4735] transition-colors shadow-sm font-medium disabled:opacity-50">
            <Download size={18} className="mr-2" /> {isExporting ? 'Generating PDF...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 text-center border-b border-[#6B705C]/20 pb-4">
        <h1 className="text-3xl font-bold text-[#2B2B2B]">AI Review Intelligence Report</h1>
        <p className="text-[#6B705C] mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Business Identity */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
        <img src={business.image} alt={business.name} className="w-full md:w-48 h-48 object-cover rounded-xl shadow-md border border-[#6B705C]/10" />
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Badge variant="primary">{business.category}</Badge>
            <span className="flex items-center text-[#6B705C] font-bold">
              <Star size={18} className="fill-current text-amber-500 mr-1" /> {business.rating}
            </span>
            <span className="text-[#6B705C]/80 text-sm">({business.reviewCount?.toLocaleString()} reviews)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2B2B2B] mb-2 tracking-tight">{business.name}</h1>
          <p className="flex items-center text-[#6B705C] mb-4 font-medium">
            <MapPin size={18} className="mr-1" /> {business.address}
          </p>
          <Card className="p-4 bg-[#2D6A4F]/5 border-[#2D6A4F]/20">
            <h3 className="flex items-center text-[#2D6A4F] font-bold mb-2">
              <Zap size={18} className="mr-2" /> AI Executive Summary
            </h3>
            <p className="text-[#2B2B2B]/90 text-sm leading-relaxed">
              {business.aiSummary}
            </p>
          </Card>
        </div>
      </div>

      {/* Tabs - Hidden when printing */}
      <div className="border-b border-[#6B705C]/20 mb-8 print:hidden">
        <nav className="flex space-x-8">
          {['overview', 'aspects', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-bold text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-[#2D6A4F] text-[#2D6A4F]'
                  : 'border-transparent text-[#6B705C] hover:text-[#2B2B2B] hover:border-[#6B705C]/30'
              }`}
            >
              {tab} Analysis
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">

        {/* VIEW: OVERVIEW */}
        {(activeTab === 'overview' || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-5">
                <div className="text-[#6B705C] text-sm font-semibold mb-1 flex items-center">
                  Overall Sentiment Score
                </div>
                <div className="text-3xl font-extrabold text-[#2B2B2B] flex items-end space-x-2">
                  <span>{business.sentiment.score}/10</span>
                  <span className={`text-sm mb-1 font-bold ${business.sentiment.score > 7 ? 'text-[#2D6A4F]' : 'text-[#6B705C]'}`}>
                    {business.sentiment.score > 7 ? 'Excellent' : 'Average'}
                  </span>
                </div>
              </Card>
              <Card className="p-5">
                <div className="text-[#6B705C] text-sm font-semibold mb-1">Total Reviews Processed</div>
                <div className="text-3xl font-extrabold text-[#2B2B2B]">{business.reviewCount?.toLocaleString()}</div>
              </Card>
              <Card className="p-5">
                <div className="text-[#2D6A4F] text-sm font-bold mb-1">Top Rated Aspect</div>
                <div className="text-2xl font-bold text-[#2B2B2B] truncate">
                  {business.aspects.reduce((prev, current) => (prev.score > current.score) ? prev : current).name}
                </div>
              </Card>
              <Card className="p-5">
                <div className="text-[#C65D3B] text-sm font-bold mb-1">Top Area to Improve</div>
                <div className="text-2xl font-bold text-[#2B2B2B] truncate">
                  {business.aspects.reduce((prev, current) => (prev.score < current.score) ? prev : current).name}
                </div>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sentiment Pie Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-[#2B2B2B] mb-4 border-b border-[#6B705C]/20 pb-2">Sentiment Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Positive', value: business.sentiment.positive },
                          { name: 'Neutral', value: business.sentiment.neutral },
                          { name: 'Negative', value: business.sentiment.negative },
                        ]}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                      >
                        <Cell fill={COLORS.positive} />
                        <Cell fill={COLORS.neutral} />
                        <Cell fill={COLORS.negative} />
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${COLORS.secondary}33` }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-center mt-4 border-t border-[#6B705C]/10 pt-4">
                  <div><div className="text-2xl font-extrabold text-[#2D6A4F]">{business.sentiment.positive}%</div><div className="text-xs font-semibold text-[#6B705C]">Positive</div></div>
                  <div><div className="text-2xl font-extrabold text-[#6B705C]">{business.sentiment.neutral}%</div><div className="text-xs font-semibold text-[#6B705C]">Neutral</div></div>
                  <div><div className="text-2xl font-extrabold text-[#C65D3B]">{business.sentiment.negative}%</div><div className="text-xs font-semibold text-[#6B705C]">Negative</div></div>
                </div>
              </Card>

              {/* Emotion Bar Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-[#2B2B2B] mb-4 border-b border-[#6B705C]/20 pb-2">Emotion Detection</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={business.emotions} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={`${COLORS.secondary}33`} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: COLORS.secondary, fontWeight: 500 }} width={90} />
                      <RechartsTooltip cursor={{ fill: `${COLORS.secondary}11` }} contentStyle={{ borderRadius: '8px', border: `1px solid ${COLORS.secondary}33` }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {business.emotions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Happy' || entry.name === 'Satisfied' || entry.name === 'Relaxed' || entry.name === 'Productive' ? COLORS.positive : entry.name === 'Frustrated' || entry.name === 'Angry' || entry.name === 'Disappointed' ? COLORS.negative : COLORS.neutral} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Charts Row 2: Trend Line */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#2B2B2B] mb-4 border-b border-[#6B705C]/20 pb-2">Sentiment Trend Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={business.trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: COLORS.secondary, fontWeight: 500 }} axisLine={{ stroke: `${COLORS.secondary}33` }} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fill: COLORS.secondary, fontWeight: 500 }} axisLine={{ stroke: `${COLORS.secondary}33` }} tickLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.secondary}33`} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${COLORS.secondary}33` }} />
                    <Area type="monotone" dataKey="sentiment" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* AI Insights & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:break-inside-avoid">
              <Card className="p-6 bg-[#FAF8F3]/50 border-[#6B705C]/10">
                <h3 className="text-lg font-bold text-[#2B2B2B] mb-4 flex items-center">
                  <Activity className="mr-2 text-[#6B705C]" /> Key Insights
                </h3>
                <ul className="space-y-3">
                  {business.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start bg-[#FFFFFF] p-3 rounded-lg shadow-sm border border-[#6B705C]/10">
                      <div className="min-w-6 text-[#6B705C] font-bold mr-2 mt-0.5">•</div>
                      <span className="text-[#2B2B2B]/90 text-sm font-medium">{insight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6 bg-[#FAF8F3]/50 border-[#6B705C]/10">
                <h3 className="text-lg font-bold text-[#2B2B2B] mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-[#2D6A4F]" /> Actionable Recommendations
                </h3>
                <ul className="space-y-3">
                  {business.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start bg-[#FFFFFF] p-3 rounded-lg shadow-sm border border-[#2D6A4F]/20 border-l-4 border-l-[#2D6A4F]">
                      <CheckCircle className="min-w-5 h-5 text-[#2D6A4F] mr-2 mt-0.5" />
                      <span className="text-[#2B2B2B]/90 text-sm font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        )}

        {/* VIEW: ASPECTS */}
        {(activeTab === 'aspects' || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
          <div className="space-y-8 print:break-before-page">
            <h2 className="text-2xl font-extrabold text-[#2B2B2B] mb-4 hidden print:block">Aspect-Based Sentiment</h2>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#2B2B2B] mb-6 border-b border-[#6B705C]/20 pb-2">Customer Sentiment by Aspect</h3>
              <div className="space-y-6">
                {business.aspects.map(aspect => (
                  <div key={aspect.name} className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[#2B2B2B]/90">{aspect.name}</span>
                      <span className={`font-extrabold ${aspect.score >= 7 ? 'text-[#2D6A4F]' : aspect.score >= 5 ? 'text-[#6B705C]' : 'text-[#C65D3B]'}`}>
                        Score: {aspect.score}/10
                      </span>
                    </div>
                    <div className="h-4 w-full bg-[#FAF8F3] rounded-full flex overflow-hidden border border-[#6B705C]/10">
                      <div style={{ width: `${aspect.positive}%` }} className="bg-[#2D6A4F] h-full relative group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#FFFFFF] font-bold bg-[#2B2B2B]/30">{aspect.positive}%</div>
                      </div>
                      <div style={{ width: `${100 - aspect.positive - aspect.negative}%` }} className="bg-[#6B705C]/80 h-full"></div>
                      <div style={{ width: `${aspect.negative}%` }} className="bg-[#C65D3B] h-full relative group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#FFFFFF] font-bold bg-[#2B2B2B]/30">{aspect.negative}%</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-[#6B705C] mt-1">
                      <span>Positive</span>
                      <span>Negative</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:break-inside-avoid">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-[#2D6A4F] mb-4 flex items-center border-b border-[#2D6A4F]/20 pb-2">
                  <ThumbsUp className="mr-2" /> Top Compliments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.keywords.positive.map(word => (
                    <span key={word} className="px-3 py-1.5 bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20 rounded-lg text-sm font-bold">
                      "{word}"
                    </span>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-[#C65D3B] mb-4 flex items-center border-b border-[#C65D3B]/20 pb-2">
                  <ThumbsDown className="mr-2" /> Top Complaints
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.keywords.negative.map(word => (
                    <span key={word} className="px-3 py-1.5 bg-[#C65D3B]/10 text-[#C65D3B] border border-[#C65D3B]/20 rounded-lg text-sm font-bold">
                      "{word}"
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* VIEW: REVIEWS */}
        {(activeTab === 'reviews' || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
          <div className="print:break-before-page">
            <h2 className="text-2xl font-extrabold text-[#2B2B2B] mb-4 hidden print:block">Analyzed Reviews Sample</h2>
            <Card className="p-0 overflow-hidden">
              <div className="p-4 bg-[#FAF8F3]/80 border-b border-[#6B705C]/20 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <h3 className="font-bold text-[#2B2B2B]/90 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-[#6B705C]" /> AI-Processed Reviews
                </h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-1.5 text-sm font-semibold text-[#6B705C] bg-[#FFFFFF] border border-[#6B705C]/30 rounded-lg hover:bg-[#FAF8F3]">
                    <Filter size={14} className="mr-1" /> Filter
                  </button>
                </div>
              </div>
              <div className="divide-y divide-[#6B705C]/10">
                {business.reviews.map(review => (
                  <div key={review.id} className="p-6 hover:bg-[#FAF8F3]/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-[#6B705C]/30'} />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-[#6B705C]/80">{review.date}</span>
                      </div>
                      <Badge variant={review.sentiment}>{review.sentiment}</Badge>
                    </div>
                    <p className="text-[#2B2B2B]/90 mb-4 text-sm leading-relaxed font-medium">"{review.text}"</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-bold text-[#6B705C] flex items-center mr-2">
                        Detected Aspects:
                      </span>
                      {review.aspects.map(aspect => (
                        <span key={aspect} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#6B705C]/10 text-[#6B705C] rounded">
                          {aspect}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 text-center bg-[#FAF8F3]/80 border-t border-[#6B705C]/20 print:hidden">
                <button className="text-[#2D6A4F] text-sm font-bold hover:underline">Load More Reviews...</button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
