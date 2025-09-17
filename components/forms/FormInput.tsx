import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { triggerHapticFeedback } from '@/utils/haptics';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveIconSize,
  getResponsiveSpacing,
  SCREEN_DIMENSIONS
} from '@/utils/responsive';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
}

export function FormInput({
  label,
  error,
  isPassword = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: FormInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const inputRef = useRef<TextInput>(null);
  const labelAnimation = useRef(new Animated.Value(0)).current;

  // Initialize label position based on initial value
  useEffect(() => {
    const initialValue = props.value || '';
    const hasInitialValue = initialValue.length > 0;
    setHasValue(hasInitialValue);
    if (hasInitialValue) {
      animateLabel(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    triggerHapticFeedback.light();
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    animateLabel(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!hasValue) {
      animateLabel(false);
    }
    props.onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    const hasText = text.length > 0;
    setHasValue(hasText);
    
    // Always animate label based on whether there's text or focus
    if (hasText || isFocused) {
      animateLabel(true);
    } else {
      animateLabel(false);
    }
    
    props.onChangeText?.(text);
  };

  const animateLabel = (focused: boolean) => {
    Animated.timing(labelAnimation, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const getBorderColor = () => {
    if (error) return '#ef4444';
    if (isFocused) return colors.tint;
    return colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  };

  const getBackgroundColor = () => {
    if (colorScheme === 'dark') {
      return isFocused ? '#1f2937' : '#111827';
    }
    return isFocused ? '#ffffff' : '#f9fafb';
  };

  const responsiveSpacing = getResponsiveSpacing(16);
  const responsiveFontSize = getResponsiveFontSize(16);
  const responsiveBorderRadius = getResponsiveBorderRadius(16);
  const responsiveIconSize = getResponsiveIconSize(20);
  const minHeight = SCREEN_DIMENSIONS.isSmallScreen ? 52 : SCREEN_DIMENSIONS.isTablet ? 64 : 56;

  const dynamicStyles = StyleSheet.create({
    container: {
      marginBottom: getResponsiveSpacing(20),
    },
    inputContainer: {
      position: 'relative',
      borderWidth: 2,
      borderColor: getBorderColor(),
      borderRadius: responsiveBorderRadius,
      backgroundColor: getBackgroundColor(),
      minHeight: minHeight,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveSpacing,
      ...Platform.select({
        ios: {
          shadowColor: isFocused ? colors.tint : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isFocused ? 0.1 : 0,
          shadowRadius: 8,
        },
        android: {
          elevation: isFocused ? 4 : 0,
        },
      }),
    },
    label: {
      position: 'absolute',
      left: leftIcon ? responsiveSpacing + responsiveIconSize + 8 : responsiveSpacing,
      top: responsiveSpacing,
      fontSize: getResponsiveFontSize(14),
      fontWeight: '500',
      color: isFocused ? colors.tint : colors.tabIconDefault,
      backgroundColor: getBackgroundColor(),
      paddingHorizontal: 4,
      zIndex: 1,
    },
    leftIcon: {
      marginRight: getResponsiveSpacing(12),
      opacity: isFocused ? 1 : 0.6,
    },
    input: {
      flex: 1,
      fontSize: responsiveFontSize,
      color: colors.text,
      paddingVertical: responsiveSpacing,
      paddingTop: hasValue || isFocused ? responsiveSpacing + 8 : responsiveSpacing,
      minHeight: 24,
      textAlignVertical: 'center',
    },
    rightIconContainer: {
      marginLeft: getResponsiveSpacing(12),
      padding: getResponsiveSpacing(8),
      borderRadius: getResponsiveBorderRadius(8),
      backgroundColor: isFocused ? colors.tint + '10' : 'transparent',
    },
    errorText: {
      fontSize: getResponsiveFontSize(13),
      color: '#ef4444',
      marginTop: getResponsiveSpacing(6),
      marginLeft: getResponsiveSpacing(4),
      fontWeight: '500',
    },
    successText: {
      fontSize: getResponsiveFontSize(13),
      color: '#10b981',
      marginTop: getResponsiveSpacing(6),
      marginLeft: getResponsiveSpacing(4),
      fontWeight: '500',
    },
  });

  const labelTranslateY = SCREEN_DIMENSIONS.isSmallScreen ? -28 : SCREEN_DIMENSIONS.isTablet ? -36 : -32;
  const labelScale = SCREEN_DIMENSIONS.isSmallScreen ? 0.85 : 0.8;

  const labelStyle = {
    transform: [
      {
        translateY: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, labelTranslateY],
        }),
      },
      {
        scale: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, labelScale],
        }),
      },
    ],
  };

  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={focusInput}
        style={dynamicStyles.inputContainer}
      >
        {leftIcon && (
          <IconSymbol
            name={leftIcon as any}
            size={responsiveIconSize}
            color={isFocused ? colors.tint : colors.tabIconDefault}
            style={dynamicStyles.leftIcon}
          />
        )}
        
        <View style={{ flex: 1 }}>
          <Animated.Text style={[dynamicStyles.label, labelStyle]}>
            {label}
          </Animated.Text>
          <TextInput
            ref={inputRef}
            {...props}
            style={dynamicStyles.input}
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            placeholder=""
            selectionColor={colors.tint}
            cursorColor={colors.tint}
          />
        </View>

        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={dynamicStyles.rightIconContainer}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={isPasswordVisible ? 'eye.slash' as any : 'eye' as any}
              size={getResponsiveIconSize(18)}
              color={isFocused ? colors.tint : colors.tabIconDefault}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={dynamicStyles.rightIconContainer}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={rightIcon as any}
              size={getResponsiveIconSize(18)}
              color={isFocused ? colors.tint : colors.tabIconDefault}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      {error && <Text style={dynamicStyles.errorText}>⚠️ {error}</Text>}
    </View>
  );
}
