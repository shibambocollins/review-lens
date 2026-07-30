export const Card = ({ children, className = '' }) => (
  <div className={`bg-[#FFFFFF] rounded-xl shadow-sm border border-[#6B705C]/20 overflow-hidden ${className}`}>
    {children}
  </div>
);
