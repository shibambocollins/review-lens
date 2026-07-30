import { useEffect } from 'react';
import { CheckCircle, Share2 } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-[#2D6A4F]' : 'bg-[#6B705C]';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-[#FFFFFF] px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-bounce`}>
      {type === 'success' ? <CheckCircle size={20} /> : <Share2 size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
};
