import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type NavigationMode = 'home' | 'scan' | 'history' | 'profile';

type HorizontalNavigationProps = {
  activeTab: NavigationMode;
  onTabChange?: (tab: NavigationMode) => void;
};

const { width } = Dimensions.get('window');

const HorizontalNavigation: React.FC<HorizontalNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const scaleAnims = useRef({
    home: new Animated.Value(1),
    scan: new Animated.Value(1),
    history: new Animated.Value(1),
    profile: new Animated.Value(1),
  }).current;

  const opacityAnims = useRef({
    home: new Animated.Value(0.7),
    scan: new Animated.Value(0.7),
    history: new Animated.Value(0.7),
    profile: new Animated.Value(0.7),
  }).current;

  const modes: { key: NavigationMode; icon: any; label: string }[] = [
    { key: 'home', icon: { type: 'Ionicons', name: 'home' }, label: t('home') },
    { key: 'scan', icon: { type: 'MaterialIcons', name: 'qr-code-scanner' }, label: t('scan') },
    { key: 'history', icon: { type: 'FontAwesome5', name: 'history' }, label: t('history') },
    { key: 'profile', icon: { type: 'Ionicons', name: 'person' }, label: t('profile') },
  ];

  useEffect(() => {
    // Animate active tab with smoother transitions
    modes.forEach((mode) => {
      Animated.parallel([
        Animated.timing(scaleAnims[mode.key], {
          toValue: mode.key === activeTab ? 1.2 : 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnims[mode.key], {
          toValue: mode.key === activeTab ? 1 : 0.7,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ]).start();
    });
  }, [activeTab]);

  const handleTabPress = (mode: NavigationMode) => {
    // Add haptic feedback effect
    onTabChange?.(mode);
  };

  const renderIcon = (iconConfig: any, isActive: boolean, opacity: Animated.Value) => {
    const color = isActive ? (isDarkMode ? '#4ade80' : '#00835a') : (isDarkMode ? '#94a3b8' : '#ffffff');
    const size = iconConfig.name === 'history' ? 22 : 26;

    return (
      <Animated.View style={{ opacity }}>
        {(() => {
          switch (iconConfig.type) {
            case 'Ionicons':
              return <Ionicons name={iconConfig.name} size={size} color={color} />;
            case 'MaterialIcons':
              return <MaterialIcons name={iconConfig.name} size={size} color={color} />;
            case 'FontAwesome5':
              return <FontAwesome5 name={iconConfig.name} size={size} color={color} />;
            default:
              return null;
          }
        })()}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        {modes.map((mode, index) => {
          const isActive = activeTab === mode.key;
          return (
            <Animated.View
              key={mode.key}
              style={[
                styles.modeItemContainer,
                { transform: [{ scale: scaleAnims[mode.key] }] },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.modeItem,
                  isDarkMode && styles.darkModeItem,
                  isActive && (isDarkMode ? styles.darkModeItemActive : styles.modeItemActive),
                ]}
                onPress={() => handleTabPress(mode.key)}
                activeOpacity={0.7} // Smoother touch feedback
              >
                <View style={[
                  styles.iconContainer,
                  isDarkMode && styles.darkIconContainer,
                  isActive && (isDarkMode ? styles.darkIconContainerActive : styles.iconContainerActive),
                ]}>
                  {renderIcon(mode.icon, isActive, opacityAnims[mode.key])}
                </View>
                <Text style={[
                  styles.label,
                  isDarkMode && styles.darkLabel,
                  isActive ? (isDarkMode ? styles.darkLabelActive : styles.labelActive) : (isDarkMode ? styles.darkLabelInactive : styles.labelInactive)
                ]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#00835a',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  darkContainer: {
    backgroundColor: '#0f4c3a',
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  modeItemContainer: {
    alignItems: 'center',
  },
  modeItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkModeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modeItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(0, 131, 90, 0.4)',
    shadowColor: '#00835a',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  darkModeItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(74, 222, 128, 0.4)',
    shadowColor: '#4ade80',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkIconContainer: {
    // Dark mode specific styles if needed
  },
  iconContainerActive: {
    // Active state handled by icon color
  },
  darkIconContainerActive: {
    // Active state handled by icon color
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  darkLabel: {
    // Dark mode specific styles if needed
  },
  labelActive: {
    color: '#00835a',
    fontWeight: '600',
  },
  darkLabelActive: {
    color: '#4ade80',
    fontWeight: '600',
  },
  labelInactive: {
    color: '#ffffff',
  },
  darkLabelInactive: {
    color: '#94a3b8',
  },
});

export default HorizontalNavigation;