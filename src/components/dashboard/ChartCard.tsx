import React from 'react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  status?: 'excellent' | 'good' | 'warning' | 'critical';
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className = '',
  status = 'good'
}) => {
  // Get status-based styling
  const getStatusStyles = () => {
    switch (status) {
      case 'excellent':
        return { borderColor: 'rgba(34, 197, 94, 0.2)' };
      case 'good':
        return { borderColor: 'rgba(59, 130, 246, 0.2)' };
      case 'warning':
        return { borderColor: 'rgba(245, 158, 11, 0.2)' };
      case 'critical':
        return { borderColor: 'rgba(239, 68, 68, 0.2)' };
      default:
        return { borderColor: 'var(--surface-3)' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`interactive-card chart-card glassmorphism backdrop-blur-xs border hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ${className}`}
      style={getStatusStyles()}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">{title}</h3>
        <div className="flex-1 min-h-[200px]">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default ChartCard;
