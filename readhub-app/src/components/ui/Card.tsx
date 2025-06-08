import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  padding = 'md',
  hover = true,
  onClick,
}) => {
  const MotionComponent = interactive || onClick ? motion.div : 'div';
  
  const motionProps = interactive || onClick ? {
    whileHover: hover ? { y: -4, scale: 1.02 } : {},
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: 'easeOut' },
  } : {};

  return (
    <MotionComponent
      className={clsx(
        'bg-white rounded-xl border border-neutral-150 shadow-card transition-all duration-300',
        hover && 'hover:shadow-card-hover',
        interactive && 'cursor-pointer hover:border-neutral-200',
        onClick && 'cursor-pointer',
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('mt-4 pt-4 border-t border-neutral-100', className)}>
    {children}
  </div>
);