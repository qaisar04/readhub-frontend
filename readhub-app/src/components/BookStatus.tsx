import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Archive, 
  Clock, 
  Trash2 
} from 'lucide-react';
import { BookStatus as Status } from '../types/api';
import clsx from 'clsx';

interface BookStatusProps {
  status: Status;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  [Status.DRAFT]: {
    icon: FileText,
    label: 'Draft',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
  },
  [Status.ACTIVE]: {
    icon: CheckCircle,
    label: 'Active',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
  },
  [Status.INACTIVE]: {
    icon: XCircle,
    label: 'Inactive',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
  },
  [Status.ARCHIVED]: {
    icon: Archive,
    label: 'Archived',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
  },
  [Status.PENDING_APPROVAL]: {
    icon: Clock,
    label: 'Pending',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
  },
  [Status.DELETED]: {
    icon: Trash2,
    label: 'Deleted',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
  },
};

const sizeConfig = {
  sm: {
    iconSize: 'w-3 h-3',
    padding: 'px-2 py-1',
    textSize: 'text-xs',
  },
  md: {
    iconSize: 'w-4 h-4',
    padding: 'px-3 py-1.5',
    textSize: 'text-sm',
  },
  lg: {
    iconSize: 'w-5 h-5',
    padding: 'px-4 py-2',
    textSize: 'text-base',
  },
};

export const BookStatus: React.FC<BookStatusProps> = ({
  status,
  className,
  showLabel = true,
  size = 'md',
}) => {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={clsx(
          'inline-flex items-center justify-center rounded-full',
          config.bgColor,
          config.borderColor,
          'border',
          sizeStyles.padding,
          className
        )}
        title={config.label}
      >
        <Icon className={clsx(sizeStyles.iconSize, config.color)} />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.bgColor,
        config.borderColor,
        config.color,
        sizeStyles.padding,
        sizeStyles.textSize,
        className
      )}
    >
      <Icon className={sizeStyles.iconSize} />
      {showLabel && <span>{config.label}</span>}
    </motion.div>
  );
};

// Dropdown component for changing status
interface BookStatusSelectorProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
  disabled?: boolean;
  allowedStatuses?: Status[];
}

export const BookStatusSelector: React.FC<BookStatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
  allowedStatuses = Object.values(Status),
}) => {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value as Status)}
      disabled={disabled}
      className={clsx(
        'input-field text-sm',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {allowedStatuses.map((status) => {
        const config = statusConfig[status];
        return (
          <option key={status} value={status}>
            {config.label}
          </option>
        );
      })}
    </select>
  );
};

// Hook for status-based filtering
export const useStatusFilter = () => {
  const getVisibleStatuses = (): Status[] => [
    Status.ACTIVE,
    Status.INACTIVE,
    Status.PENDING_APPROVAL,
  ];

  const getManageableStatuses = (): Status[] => [
    Status.DRAFT,
    Status.ACTIVE,
    Status.INACTIVE,
    Status.ARCHIVED,
    Status.PENDING_APPROVAL,
  ];

  const getAllStatuses = (): Status[] => Object.values(Status);

  const isPublic = (status: Status): boolean =>
    status === Status.ACTIVE;

  const isDeletable = (status: Status): boolean =>
    status !== Status.DELETED;

  const isEditable = (status: Status): boolean =>
    status !== Status.DELETED;

  return {
    getVisibleStatuses,
    getManageableStatuses,
    getAllStatuses,
    isPublic,
    isDeletable,
    isEditable,
  };
};