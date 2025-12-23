import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'lg',
  shadow: shadowLevel = 'md',
  variant = 'default',
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
      backgroundColor: colors.white,
    };

    const variantStyles = {
      default: {
        backgroundColor: colors.white,
        ...(shadowLevel !== 'none' ? shadows[shadowLevel] : {}),
      },
      outlined: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
      },
      elevated: {
        backgroundColor: colors.white,
        ...shadows.lg,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      padding: spacing[padding],
    };
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};















