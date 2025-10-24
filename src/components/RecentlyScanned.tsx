import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface MedicineItem {
  id: string;
  name: string;
  icon: string;
  gradient: [string, string];
  gradientDark: [string, string];
  iconColor: string;
  iconColorDark: string;
}

type RecentlyScannedProps = {
  onMedicineSelect?: (medicineId: string) => void;
};

const RecentlyScanned: React.FC<RecentlyScannedProps> = ({ onMedicineSelect }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  // Animation refs for each item
  const recentItemAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Medicine data
  const medicines: MedicineItem[] = [
    {
      id: '1',
      name: t('paracetamol'),
      icon: 'cube',
      gradient: ['rgba(66, 153, 225, 0.1)', 'rgba(66, 153, 225, 0.05)'],
      gradientDark: ['rgba(66, 153, 225, 0.2)', 'rgba(66, 153, 225, 0.1)'],
      iconColor: '#4299e1',
      iconColorDark: '#60a5fa'
    },
    {
      id: '2',
      name: t('napaExtra'),
      icon: 'cube',
      gradient: ['rgba(252, 129, 129, 0.1)', 'rgba(252, 129, 129, 0.05)'],
      gradientDark: ['rgba(252, 129, 129, 0.2)', 'rgba(252, 129, 129, 0.1)'],
      iconColor: '#fc8181',
      iconColorDark: '#f87171'
    },
    {
      id: '3',
      name: t('vitaminC'),
      icon: 'cube',
      gradient: ['rgba(72, 187, 120, 0.1)', 'rgba(72, 187, 120, 0.05)'],
      gradientDark: ['rgba(72, 187, 120, 0.2)', 'rgba(72, 187, 120, 0.1)'],
      iconColor: '#48bb78',
      iconColorDark: '#34d399'
    },
    {
      id: '4',
      name: t('calcium'),
      icon: 'cube',
      gradient: ['rgba(236, 72, 153, 0.1)', 'rgba(236, 72, 153, 0.05)'],
      gradientDark: ['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.1)'],
      iconColor: '#ec4899',
      iconColorDark: '#f472b6'
    },
    {
      id: '5',
      name: t('omega3'),
      icon: 'cube',
      gradient: ['rgba(167, 139, 250, 0.1)', 'rgba(167, 139, 250, 0.05)'],
      gradientDark: ['rgba(167, 139, 250, 0.2)', 'rgba(167, 139, 250, 0.1)'],
      iconColor: '#a78bfa',
      iconColorDark: '#c4b5fd'
    },
    {
      id: '6',
      name: t('multivitamin'),
      icon: 'cube',
      gradient: ['rgba(251, 191, 36, 0.1)', 'rgba(251, 191, 36, 0.05)'],
      gradientDark: ['rgba(251, 191, 36, 0.2)', 'rgba(251, 191, 36, 0.1)'],
      iconColor: '#fbbf24',
      iconColorDark: '#fcd34d'
    }
  ];

  useEffect(() => {
    // Staggered recent item animations
    Animated.stagger(100, [
      Animated.spring(recentItemAnims[0], {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(recentItemAnims[1], {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(recentItemAnims[2], {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(recentItemAnims[3], {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(recentItemAnims[4], {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(recentItemAnims[5], {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = (index: number) => {
    Animated.spring(recentItemAnims[index], {
      toValue: 0.95,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(recentItemAnims[index], {
      toValue: 1,
      tension: 100,
      friction: 5,
        useNativeDriver: true,
    }).start();
  };

  const handleMedicinePress = (medicineId: string) => {
    if (onMedicineSelect) {
      onMedicineSelect(medicineId);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>{t('recentlyScanned')}</Text>
      
      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={styles.row}>
          {medicines.slice(0, 2).map((medicine, index) => (
            <Animated.View
              key={medicine.id}
              style={[
                styles.itemContainer,
                {
                  opacity: recentItemAnims[index],
                  transform: [
                    {
                      translateY: recentItemAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    },
                    {
                      scale: recentItemAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <TouchableOpacity 
                style={[styles.card, isDarkMode && styles.darkCard]}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                onPress={() => handleMedicinePress(medicine.id)}
              >
                <LinearGradient
                  colors={isDarkMode ? medicine.gradientDark : medicine.gradient}
                  style={styles.imageContainer}
                >
                  <View style={[styles.imagePlaceholder, isDarkMode && styles.darkImagePlaceholder]}>
                    <Ionicons name={medicine.icon as any} size={32} color={isDarkMode ? medicine.iconColorDark : medicine.iconColor} />
                  </View>
                </LinearGradient>
                <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{medicine.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {medicines.slice(2, 4).map((medicine, index) => (
            <Animated.View
              key={medicine.id}
              style={[
                styles.itemContainer,
                {
                  opacity: recentItemAnims[index + 2],
                  transform: [
                    {
                      translateY: recentItemAnims[index + 2].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    },
                    {
                      scale: recentItemAnims[index + 2].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <TouchableOpacity 
                style={[styles.card, isDarkMode && styles.darkCard]}
                onPressIn={() => handlePressIn(index + 2)}
                onPressOut={() => handlePressOut(index + 2)}
                onPress={() => handleMedicinePress(medicine.id)}
              >
                <LinearGradient
                  colors={isDarkMode ? medicine.gradientDark : medicine.gradient}
                  style={styles.imageContainer}
                >
                  <View style={[styles.imagePlaceholder, isDarkMode && styles.darkImagePlaceholder]}>
                    <Ionicons name={medicine.icon as any} size={32} color={isDarkMode ? medicine.iconColorDark : medicine.iconColor} />
                  </View>
                </LinearGradient>
                <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{medicine.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {medicines.slice(4, 6).map((medicine, index) => (
            <Animated.View
              key={medicine.id}
              style={[
                styles.itemContainer,
                {
                  opacity: recentItemAnims[index + 4],
                  transform: [
                    {
                      translateY: recentItemAnims[index + 4].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    },
                    {
                      scale: recentItemAnims[index + 4].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <TouchableOpacity 
                style={[styles.card, isDarkMode && styles.darkCard]}
                onPressIn={() => handlePressIn(index + 4)}
                onPressOut={() => handlePressOut(index + 4)}
                onPress={() => handleMedicinePress(medicine.id)}
              >
                <LinearGradient
                  colors={isDarkMode ? medicine.gradientDark : medicine.gradient}
                  style={styles.imageContainer}
                >
                  <View style={[styles.imagePlaceholder, isDarkMode && styles.darkImagePlaceholder]}>
                    <Ionicons name={medicine.icon as any} size={32} color={isDarkMode ? medicine.iconColorDark : medicine.iconColor} />
                  </View>
                </LinearGradient>
                <Text style={[styles.label, isDarkMode && styles.darkLabel]}>{medicine.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 16,
  },
  darkTitle: {
    color: '#e2e8f0',
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemContainer: {
    width: '48%',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(247, 250, 252, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(26, 127, 94, 0.1)',
    minHeight: 180,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  darkCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderColor: 'rgba(74, 222, 128, 0.1)',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  darkImagePlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  darkLabel: {
    color: '#e2e8f0',
  },
});

export default RecentlyScanned;