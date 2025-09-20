import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  color: string;
  status?: 'excellent' | 'good' | 'warning' | 'critical';
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color,
  status = 'good'
}) => {
  const isPositive = change >= 0;
  
  // Get status-based styling
  const getStatusClasses = () => {
    switch (status) {
      case 'excellent':
        return 'bg-gradient-success kpi-border-excellent';
      case 'good':
        return 'bg-gradient-info kpi-border-good';
      case 'warning':
        return 'bg-gradient-warning kpi-border-warning';
      case 'critical':
        return 'bg-gradient-danger kpi-border-critical';
      default:
        return 'bg-surface-1 kpi-border-default';
    }
  };

  const getChangeBadgeClasses = () => {
    if (isPositive) {
      return 'kpi-badge-positive';
    }
    return 'kpi-badge-negative';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`interactive-card kpi-card glassmorphism backdrop-blur-xs border ${getStatusClasses()} hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
    >
      <div className="flex flex-col h-full justify-between gap-4 p-6">
        {/* Header with icon and change percentage */}
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} shadow-lg hover:shadow-xl transition-shadow duration-200`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div 
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getChangeBadgeClasses()}`}
          >
            {isPositive ? '+' : ''}{change}%
          </div>
        </div>
        
        {/* Metric content */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          <p className="text-xs text-text-muted">vs last month</p>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
