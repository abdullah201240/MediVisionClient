import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Platform, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  actions?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ 
  visible, 
  title, 
  message, 
  type = 'info', 
  onClose, 
  actions = [] 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (visible) {
      // Reset all animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      iconScaleAnim.setValue(0);
      bounceAnim.setValue(0);
      rotateAnim.setValue(0);
      buttonScaleAnim.setValue(0);
      pulseAnim.setValue(0);

      // Main entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
      ]).start();

      // Icon animation with delay
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.spring(iconScaleAnim, {
            toValue: 1.2,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(iconScaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Start pulse animation after initial animations
      Animated.sequence([
        Animated.delay(800),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Button animation with staggered delay
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
      ]).start();

    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { 
          icon: 'checkmark-circle', 
          color: isDarkMode ? '#34d399' : '#10B981',
          gradient: isDarkMode ? ['#34d399', '#10b981'] : ['#10B981', '#059669'],
          backgroundColor: isDarkMode ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.15)'
        };
      case 'error':
        return { 
          icon: 'close-circle', 
          color: isDarkMode ? '#f87171' : '#EF4444',
          gradient: isDarkMode ? ['#f87171', '#ef4444'] : ['#EF4444', '#DC2626'],
          backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.15)' : 'rgba(239, 68, 68, 0.15)'
        };
      case 'warning':
        return { 
          icon: 'warning', 
          color: isDarkMode ? '#fbbf24' : '#F59E0B',
          gradient: isDarkMode ? ['#fbbf24', '#f59e0b'] : ['#F59E0B', '#D97706'],
          backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.15)'
        };
      case 'info':
      default:
        return { 
          icon: 'information-circle', 
          color: isDarkMode ? '#60a5fa' : '#3B82F6',
          gradient: isDarkMode ? ['#60a5fa', '#3b82f6'] : ['#3B82F6', '#2563EB'],
          backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.15)'
        };
    }
  };

  const { icon, color, gradient, backgroundColor } = getIconAndColor();

  const handleActionPress = (onPress?: () => void) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onPress) onPress();
      onClose();
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <BlurView intensity={15} style={styles.blurView} tint={isDarkMode ? "dark" : "light"}>
          <Animated.View 
            style={[
              styles.alertContainer,
              isDarkMode && styles.darkAlertContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: bounceAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [100, -10, 0]
                  })},
                ],
              }
            ]}
          >
            {/* Decorative elements */}
            <Animated.View 
              style={[
                styles.decorationContainer,
                {
                  transform: [
                    { 
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '10deg']
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: `${color}15` }]} />
              <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: `${color}10` }]} />
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.iconContainer, 
                isDarkMode && styles.darkIconContainer,
                { 
                  backgroundColor: backgroundColor,
                  borderColor: `${color}30`,
                  transform: [
                    { scale: iconScaleAnim },
                    { rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    }) }
                  ]
                }
              ]}
            >
              <Animated.View 
                style={[
                  styles.iconInnerGlow, 
                  { 
                    backgroundColor: `${color}25`,
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.7]
                    }),
                    transform: [{
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3]
                      })
                    }]
                  }
                ]} 
              />
              <Ionicons name={icon as any} size={48} color={color} />
            </Animated.View>
            
            <Text style={[styles.title, isDarkMode && styles.darkTitle]}>{title}</Text>
            <Text style={[styles.message, isDarkMode && styles.darkMessage]}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {actions.length > 0 ? (
                actions.map((action, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      transform: [
                        { 
                          scale: buttonScaleAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 1.1, 1]
                          })
                        }
                      ],
                      opacity: buttonScaleAnim,
                      width: '100%',
                    }}
                  >
                    <LinearGradient
                      colors={action.style === 'cancel' ? (isDarkMode ? ['#374151', '#1f2937'] : ['#F9FAFB', '#E5E7EB']) : 
                               action.style === 'destructive' ? (isDarkMode ? ['#7f1d1d', '#b91c1c'] : ['#b91c1c', '#dc2626']) : 
                               gradient}
                      style={[
                        styles.button,
                        action.style === 'destructive' && styles.destructiveButton,
                        action.style === 'cancel' && (isDarkMode ? styles.darkCancelButton : styles.cancelButton),
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <TouchableOpacity
                        style={styles.buttonOverlay}
                        onPress={() => handleActionPress(action.onPress)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            action.style === 'cancel' && (isDarkMode ? styles.darkCancelButtonText : styles.cancelButtonText)
                          ]}
                        >
                          {action.text}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </Animated.View>
                ))
              ) : (
                <Animated.View
                  style={{
                    transform: [
                      { 
                        scale: buttonScaleAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, 1.1, 1]
                        })
                      }
                    ],
                    opacity: buttonScaleAnim,
                    width: '100%',
                  }}
                >
                  <LinearGradient
                    colors={gradient}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TouchableOpacity
                      style={styles.buttonOverlay}
                      onPress={() => handleActionPress()}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>OK</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  alertContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 28,
    padding: 32,
    width: width * 0.88,
    maxWidth: 380,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
      },
      android: {
        elevation: 20,
      },
    },
  },
  darkAlertContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -80,
    opacity: 0.4,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -60,
    left: -60,
    opacity: 0.3,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  darkIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconInnerGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  darkTitle: {
    color: '#f1f5f9',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  darkMessage: {
    color: '#cbd5e1',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    },
  },
  buttonOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    },
  },
  darkCancelButton: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  darkButtonText: {
    color: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  darkCancelButtonText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
});

export default CustomAlert;