import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormButton } from '@/components/forms/FormButton';
import { FormInput } from '@/components/forms/FormInput';
import { Logo } from '@/components/Logo';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    getMaxContentWidth,
    getResponsiveFontSize,
    getResponsiveSpacing,
    SCREEN_DIMENSIONS
} from '@/utils/responsive';
import { getPasswordStrength, RegisterFormData, registerSchema } from '@/utils/validation';

export default function RegisterScreen() {
  const { register: registerUser, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  // Update password strength when password changes
  React.useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    }
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
    } catch (error) {
      // Error is handled in the AuthContext
      console.error('Registration error:', error);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      default:
        return '#ef4444';
    }
  };

  const maxContentWidth = getMaxContentWidth();
  const horizontalPadding = getResponsiveSpacing(24);
  const isTablet = SCREEN_DIMENSIONS.isTablet;

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : '#fafafa',
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
    },
    content: {
      width: '100%',
      maxWidth: maxContentWidth,
      paddingHorizontal: horizontalPadding,
      paddingTop: getResponsiveSpacing(20),
      paddingBottom: getResponsiveSpacing(40),
      minHeight: SCREEN_DIMENSIONS.height * 0.9,
    },
    header: {
      alignItems: 'center',
      marginBottom: getResponsiveSpacing(isTablet ? 50 : 40),
    },
    title: {
      fontSize: getResponsiveFontSize(isTablet ? 42 : 36),
      fontWeight: '800',
      color: colors.text,
      marginBottom: getResponsiveSpacing(12),
      letterSpacing: -0.5,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: getResponsiveFontSize(17),
      color: colors.tabIconDefault,
      textAlign: 'center',
      lineHeight: getResponsiveFontSize(24),
      maxWidth: isTablet ? 400 : 320,
      alignSelf: 'center',
    },
    form: {
      flex: 1,
      width: '100%',
    },
    passwordStrengthContainer: {
      marginTop: getResponsiveSpacing(-12),
      marginBottom: getResponsiveSpacing(20),
    },
    passwordStrengthBar: {
      height: getResponsiveSpacing(6),
      backgroundColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
      borderRadius: getResponsiveSpacing(3),
      overflow: 'hidden',
    },
    passwordStrengthFill: {
      height: '100%',
      borderRadius: getResponsiveSpacing(3),
    },
    passwordStrengthText: {
      fontSize: getResponsiveFontSize(13),
      marginTop: getResponsiveSpacing(8),
      fontWeight: '600',
    },
    registerButton: {
      marginTop: getResponsiveSpacing(16),
      marginBottom: getResponsiveSpacing(32),
    },
    termsText: {
      fontSize: getResponsiveFontSize(14),
      color: colors.tabIconDefault,
      textAlign: 'center',
      lineHeight: getResponsiveFontSize(22),
      marginBottom: getResponsiveSpacing(32),
      paddingHorizontal: getResponsiveSpacing(8),
    },
    termsLink: {
      color: colors.tint,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: getResponsiveSpacing(32),
      width: '100%',
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
    },
    dividerText: {
      marginHorizontal: getResponsiveSpacing(20),
      fontSize: getResponsiveFontSize(15),
      color: colors.tabIconDefault,
      fontWeight: '500',
    },
    footer: {
      alignItems: 'center',
      width: '100%',
    },
    loginText: {
      fontSize: getResponsiveFontSize(16),
      color: colors.tabIconDefault,
      textAlign: 'center',
    },
    loginLink: {
      color: colors.tint,
      fontWeight: '700',
    },
  });

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'strong':
        return '100%';
      case 'medium':
        return '66%';
      default:
        return '33%';
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={dynamicStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={dynamicStyles.content}>
            {/* Header */}
            <View style={dynamicStyles.header}>
              <Logo size={isTablet ? 140 : 120} style={{ marginBottom: getResponsiveSpacing(20) }} />
              <Text style={dynamicStyles.title}>Create Account</Text>
              <Text style={dynamicStyles.subtitle}>
                Join us and start your journey today
              </Text>
            </View>

            {/* Form */}
            <View style={dynamicStyles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    leftIcon="envelope"
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Phone Number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    leftIcon="phone"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    isPassword
                    autoComplete="new-password"
                    leftIcon="lock"
                  />
                )}
              />

              {/* Password Strength Indicator */}
              {password && (
                <View style={dynamicStyles.passwordStrengthContainer}>
                  <View style={dynamicStyles.passwordStrengthBar}>
                    <View
                      style={[
                        dynamicStyles.passwordStrengthFill,
                        {
                          width: getPasswordStrengthWidth(),
                          backgroundColor: getPasswordStrengthColor(),
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      dynamicStyles.passwordStrengthText,
                      { color: getPasswordStrengthColor() },
                    ]}
                  >
                    Password strength: {passwordStrength.toUpperCase()}
                  </Text>
                </View>
              )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    isPassword
                    autoComplete="new-password"
                    leftIcon="lock"
                  />
                )}
              />

              {/* Terms and Conditions */}
              <Text style={dynamicStyles.termsText}>
                By creating an account, you agree to our{' '}
                <TouchableOpacity
                  onPress={() => {
                    // Handle terms navigation
                  }}
                >
                  <Text style={dynamicStyles.termsLink}>Terms of Service</Text>
                </TouchableOpacity>{' '}
                and{' '}
                <TouchableOpacity
                  onPress={() => {
                    // Handle privacy policy navigation
                  }}
                >
                  <Text style={dynamicStyles.termsLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </Text>

              <FormButton
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={!isValid}
                style={dynamicStyles.registerButton}
              />
            </View>

            {/* Divider */}
            <View style={dynamicStyles.divider}>
              <View style={dynamicStyles.dividerLine} />
              <Text style={dynamicStyles.dividerText}>or</Text>
              <View style={dynamicStyles.dividerLine} />
            </View>

            {/* Footer */}
            <View style={dynamicStyles.footer}>
              <Text style={dynamicStyles.loginText}>
                Already have an account?{' '}
                <Link href="/login" style={dynamicStyles.loginLink}>
                  Sign In
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
