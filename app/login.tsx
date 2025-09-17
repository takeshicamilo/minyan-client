import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
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
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    getMaxContentWidth,
    getResponsiveFontSize,
    getResponsiveSpacing,
    SCREEN_DIMENSIONS
} from '@/utils/responsive';
import { LoginFormData, loginSchema } from '@/utils/validation';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled in the AuthContext
      console.error('Login error:', error);
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '100%',
      maxWidth: maxContentWidth,
      paddingHorizontal: horizontalPadding,
      paddingTop: getResponsiveSpacing(40),
      paddingBottom: getResponsiveSpacing(40),
      justifyContent: 'center',
      minHeight: SCREEN_DIMENSIONS.height * 0.8,
    },
    header: {
      alignItems: 'center',
      marginBottom: getResponsiveSpacing(isTablet ? 80 : 60),
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
      maxWidth: isTablet ? 400 : 300,
      alignSelf: 'center',
    },
    form: {
      marginBottom: getResponsiveSpacing(40),
      width: '100%',
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: getResponsiveSpacing(40),
      paddingVertical: getResponsiveSpacing(8),
    },
    forgotPasswordText: {
      fontSize: getResponsiveFontSize(15),
      color: colors.tint,
      fontWeight: '600',
    },
    loginButton: {
      marginBottom: getResponsiveSpacing(32),
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
    signupText: {
      fontSize: getResponsiveFontSize(16),
      color: colors.tabIconDefault,
      textAlign: 'center',
    },
    signupLink: {
      color: colors.tint,
      fontWeight: '700',
    },
  });

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
        >
          <View style={dynamicStyles.content}>
            {/* Header */}
            <View style={dynamicStyles.header}>
              <Text style={dynamicStyles.title}>Welcome Back</Text>
              <Text style={dynamicStyles.subtitle}>
                Sign in to your account to continue
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
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    isPassword
                    autoComplete="password"
                    leftIcon="lock"
                  />
                )}
              />

              <TouchableOpacity
                style={dynamicStyles.forgotPassword}
                onPress={() => {
                  Alert.alert(
                    'Forgot Password',
                    'Password recovery feature will be implemented soon.'
                  );
                }}
              >
                <Text style={dynamicStyles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <FormButton
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={!isValid}
                style={dynamicStyles.loginButton}
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
              <Text style={dynamicStyles.signupText}>
                Don't have an account?{' '}
                <Link href="/register" style={dynamicStyles.signupLink}>
                  Sign Up
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
