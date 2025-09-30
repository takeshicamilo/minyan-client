import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center' | 'repeat';
}

export function Logo({ size = 120, style, resizeMode = 'contain' }: LogoProps) {
  return (
    <Image
      source={require('@/assets/images/miyan-logo.png')}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      contentFit={resizeMode}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
