import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-brand-secondary active:opacity-80',
    secondary: 'bg-gray-200 active:bg-gray-300',
    outline: 'border-2 border-brand-secondary bg-transparent',
  };

  const textClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-brand-text font-semibold',
    outline: 'text-brand-secondary font-semibold',
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${disabled || loading ? 'opacity-50' : ''} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#ba5624' : '#ffffff'} />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
