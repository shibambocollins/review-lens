export const Badge = ({ children, variant = 'neutral' }) => {
  const variants = {
    positive: 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/20',
    negative: 'bg-[#C65D3B]/10 text-[#C65D3B] border-[#C65D3B]/20',
    neutral: 'bg-[#6B705C]/10 text-[#6B705C] border-[#6B705C]/20',
    primary: 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};
