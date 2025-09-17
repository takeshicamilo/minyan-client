import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { triggerHapticFeedback } from '@/utils/haptics';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveSpacing,
    SCREEN_DIMENSIONS
} from '@/utils/responsive';
import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

interface FormButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function FormButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}: FormButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    if (!isDisabled) {
      triggerHapticFeedback.light();
      Animated.spring(scaleAnimation, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: getResponsiveBorderRadius(16),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      overflow: 'hidden',
    };

    // Size styles with responsive adjustments
    switch (size) {
      case 'small':
        baseStyles.paddingVertical = getResponsiveSpacing(12);
        baseStyles.paddingHorizontal = getResponsiveSpacing(20);
        baseStyles.minHeight = SCREEN_DIMENSIONS.isSmallScreen ? 40 : SCREEN_DIMENSIONS.isTablet ? 48 : 44;
        break;
      case 'large':
        baseStyles.paddingVertical = getResponsiveSpacing(18);
        baseStyles.paddingHorizontal = getResponsiveSpacing(32);
        baseStyles.minHeight = SCREEN_DIMENSIONS.isSmallScreen ? 60 : SCREEN_DIMENSIONS.isTablet ? 72 : 64;
        break;
      default: // medium
        baseStyles.paddingVertical = getResponsiveSpacing(16);
        baseStyles.paddingHorizontal = getResponsiveSpacing(24);
        baseStyles.minHeight = SCREEN_DIMENSIONS.isSmallScreen ? 52 : SCREEN_DIMENSIONS.isTablet ? 64 : 56;
    }

    // Variant styles with better colors
    switch (variant) {
      case 'secondary':
        baseStyles.backgroundColor = colorScheme === 'dark' ? '#374151' : '#f3f4f6';
        break;
      case 'outline':
        baseStyles.backgroundColor = 'transparent';
        baseStyles.borderWidth = 2;
        baseStyles.borderColor = isDisabled ? colors.tabIconDefault : colors.tint;
        break;
      default: // primary
        if (isDisabled) {
          baseStyles.backgroundColor = colors.tabIconDefault;
        } else {
          baseStyles.backgroundColor = colors.tint;
        }
    }

    // Add shadows and elevation
    if (!isDisabled && variant !== 'outline') {
      baseStyles.shadowColor = colors.tint;
      baseStyles.shadowOffset = { width: 0, height: 4 };
      baseStyles.shadowOpacity = 0.2;
      baseStyles.shadowRadius = 8;
      baseStyles.elevation = 4;
    }

    return baseStyles;
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontWeight: '700',
      letterSpacing: 0.5,
    };

    // Size styles with responsive font sizes
    switch (size) {
      case 'small':
        baseStyles.fontSize = getResponsiveFontSize(14);
        break;
      case 'large':
        baseStyles.fontSize = getResponsiveFontSize(18);
        break;
      default: // medium
        baseStyles.fontSize = getResponsiveFontSize(16);
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyles.color = colors.text;
        break;
      case 'outline':
        baseStyles.color = isDisabled ? colors.tabIconDefault : colors.tint;
        break;
      default: // primary
        if (isDisabled) {
          baseStyles.color = colorScheme === 'dark' ? '#6b7280' : '#9ca3af';
        } else {
          baseStyles.color = colorScheme === 'dark' ? '#000' : '#fff';
        }
    }

    return baseStyles;
  };

  const getLoadingColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.text;
      case 'outline':
        return colors.tint;
      default: // primary
        return colorScheme === 'dark' ? '#000' : '#fff';
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
      <TouchableOpacity
        style={[getButtonStyles(), style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={getLoadingColor()}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[getTextStyles(), textStyle]}>
          {loading ? 'Loading...' : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
