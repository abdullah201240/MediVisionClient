import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      {/* Top Divider Line */}
      <View style={styles.topDivider} />
      
      {/* Single Line Footer Content */}
      <LinearGradient
        colors={['rgba(13, 59, 46, 0.05)', 'rgba(13, 59, 46, 0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.footerContent}
      >
        <View style={styles.contentRow}>
          {/* Left: Powered By */}
          <View style={styles.leftSection}>
            <Text style={styles.poweredBy}>Powered By</Text>
            <View style={styles.brandBadge}>
              <Text style={styles.brandName}>A2l</Text>
            </View>
          </View>

          {/* Center: Decorative Dot */}
          <View style={styles.centerDot} />

          {/* Right: Version */}
          <View style={styles.rightSection}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    width: '100%',
  },
  
  topDivider: {
    height: 1,
    backgroundColor: '#0D3B2E',
    opacity: 0.2,
    marginBottom: 8,
  },

  footerContent: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(13, 59, 46, 0.1)',
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  // Left Section
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  poweredBy: {
    fontSize: 11,
    color: '#777',
    marginRight: 8,
    fontWeight: '500',
  },
  brandBadge: {
    backgroundColor: 'rgba(254, 254, 254, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(237, 240, 240, 0.2)',
  },
  brandName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.8,
  },

  // Center Dot
  centerDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0D3B2E',
    opacity: 0.4,
    marginHorizontal: 16,
  },

  // Right Section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  versionText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
})