import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type AboutScreenProps = {
  onBackPress: () => void;
};

const AboutScreen: React.FC<AboutScreenProps> = ({ onBackPress }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.introText, isDarkMode && styles.darkIntroText]}>
            {t('aboutIntro')}
          </Text>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
            {t('ourMission')}
          </Text>
          <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>
            {t('missionDesc')}
          </Text>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
            {t('keyFeatures')}
          </Text>
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkFeatureText]}>
              {t('feature1')}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkFeatureText]}>
              {t('feature2')}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkFeatureText]}>
              {t('feature3')}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkFeatureText]}>
              {t('feature4')}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkFeatureText]}>
              {t('feature5')}
            </Text>
          </View>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
            {t('ourTeam')}
          </Text>
          <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>
            {t('teamDesc')}
          </Text>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
            {t('contactUs')}
          </Text>
          <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>
            {t('contactDesc')}
          </Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, isDarkMode && styles.darkContactLabel]}>{t('email')}</Text>
              <Text style={[styles.contactValue, isDarkMode && styles.darkContactValue]}>{t('contactEmail')}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, isDarkMode && styles.darkContactLabel]}>{t('phone')}</Text>
              <Text style={[styles.contactValue, isDarkMode && styles.darkContactValue]}>{t('contactPhone')}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, isDarkMode && styles.darkContactLabel]}>{t('address')}</Text>
              <Text style={[styles.contactValue, isDarkMode && styles.darkContactValue]}>{t('contactAddress')}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.versionSection, isDarkMode && styles.darkVersionSection]}>
          <Text style={[styles.versionText, isDarkMode && styles.darkVersionText]}>
            {t('version')}: {t('appVersion')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16, // Add padding at the top
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkSection: {
    backgroundColor: '#2d3748',
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a5568',
  },
  darkIntroText: {
    color: '#cbd5e1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d3748',
  },
  darkSectionTitle: {
    color: '#e2e8f0',
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5568',
    marginBottom: 8,
  },
  darkSectionText: {
    color: '#cbd5e1',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5568',
    flex: 1,
  },
  darkFeatureText: {
    color: '#cbd5e1',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 2,
  },
  darkContactLabel: {
    color: '#94a3b8',
  },
  contactValue: {
    fontSize: 15,
    color: '#2d3748',
  },
  darkContactValue: {
    color: '#e2e8f0',
  },
  versionSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  darkVersionSection: {
    backgroundColor: '#2d3748',
  },
  versionText: {
    fontSize: 14,
    color: '#718096',
  },
  darkVersionText: {
    color: '#94a3b8',
  },
});

export default AboutScreen;