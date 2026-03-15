import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface SectionProps extends ViewProps {
  children: React.ReactNode;
  title?: string;
}

export const Section: React.FC<SectionProps> = ({ children, title, className, ...props }) => {
  return (
    <View className={`mb-6 ${className || ''}`} {...props}>
      {title && (
        <View className="mb-4">
          <Text className="text-2xl font-bold text-brand-text">{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
};
