import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type PrivacyPolicyScreenProps = {
  onBackPress?: () => void;
};

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBackPress }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const privacyPolicyContent = [
    {
      title: t('informationCollection'),
      content: t('informationCollectionDesc') || 'We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us.'
    },
    {
      title: t('informationUsage'),
      content: t('informationUsageDesc') || 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.'
    },
    {
      title: t('informationSharing'),
      content: t('informationSharingDesc') || 'We do not share your personal information with third parties except as necessary to provide our services or as required by law.'
    },
    {
      title: t('dataSecurity'),
      content: t('dataSecurityDesc') || 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'
    },
    {
      title: t('dataRetention'),
      content: t('dataRetentionDesc') || 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations.'
    },
    {
      title: t('yourRights'),
      content: t('yourRightsDesc') || 'You have the right to access, update, or delete your personal information at any time.'
    },
    {
      title: t('childrenPrivacy'),
      content: t('childrenPrivacyDesc') || 'Our services are not intended for children under the age of 13, and we do not knowingly collect personal information from children.'
    },
    {
      title: t('policyChanges'),
      content: t('policyChangesDesc') || 'We may update this privacy policy from time to time, and we will notify you of any changes by posting the new policy on our website.'
    }
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>{t('privacyPolicy')}</Text>
        
        <Text style={[styles.effectiveDate, isDarkMode && styles.darkEffectiveDate]}>
          {t('effectiveDate') || 'Effective Date: January 1, 2024'}
        </Text>
        
        <Text style={[styles.intro, isDarkMode && styles.darkIntro]}>
          {t('privacyPolicyIntro') || 'This Privacy Policy describes how MediVision collects, uses, and shares your personal information when you use our mobile application.'}
        </Text>
        
        {privacyPolicyContent.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{section.title}</Text>
            <Text style={[styles.sectionContent, isDarkMode && styles.darkSectionContent]}>{section.content}</Text>
          </View>
        ))}
        
        <Text style={[styles.contactInfo, isDarkMode && styles.darkContactInfo]}>
          {t('privacyContact') || 'If you have any questions about this Privacy Policy, please contact us at privacy@medivision.com.'}
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  darkTitle: {
    color: '#e2e8f0',
  },
  effectiveDate: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 20,
  },
  darkEffectiveDate: {
    color: '#94a3b8',
  },
  intro: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 20,
  },
  darkIntro: {
    color: '#cbd5e1',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  darkSectionTitle: {
    color: '#e2e8f0',
  },
  sectionContent: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
  },
  darkSectionContent: {
    color: '#cbd5e1',
  },
  contactInfo: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  darkContactInfo: {
    color: '#cbd5e1',
  },
});

export default PrivacyPolicyScreen;