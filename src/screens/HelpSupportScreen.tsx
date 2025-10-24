import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';

type HelpSupportScreenProps = {
  onBackPress: () => void;
};

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ onBackPress }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const { showAlert } = useAlert();
  const [feedback, setFeedback] = useState('');

  const handleFeedbackSubmit = () => {
    if (feedback.trim().length > 0) {
      // In a real app, you would send this feedback to your backend
      showAlert({
        title: t('success'),
        message: t('feedbackSuccess'),
        type: 'success'
      });
      setFeedback('');
    }
  };

  const faqs = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer')
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer')
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer')
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer')
    },
    {
      question: t('faq5Question'),
      answer: t('faq5Answer')
    }
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* FAQ Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
            {t('faqTitle')}
          </Text>
          
          {faqs.map((faq, index) => (
            <View key={index} style={[styles.faqItem, isDarkMode && styles.darkFaqItem]}>
              <Text style={[styles.faqQuestion, isDarkMode && styles.darkFaqQuestion]}>
                {faq.question}
              </Text>
              <Text style={[styles.faqAnswer, isDarkMode && styles.darkFaqAnswer]}>
                {faq.answer}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact Support Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
            {t('contactSupport')}
          </Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, isDarkMode && styles.darkContactLabel]}>{t('email')}</Text>
              <Text style={[styles.contactValue, isDarkMode && styles.darkContactValue]}>{t('supportEmail')}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, isDarkMode && styles.darkContactLabel]}>{t('phone')}</Text>
              <Text style={[styles.contactValue, isDarkMode && styles.darkContactValue]}>{t('supportPhone')}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactValue, isDarkMode && styles.darkContactValue]}>{t('supportHours')}</Text>
            </View>
          </View>
        </View>

        {/* Feedback Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
            {t('feedbackTitle')}
          </Text>
          
          <TextInput
            style={[styles.feedbackInput, isDarkMode && styles.darkFeedbackInput]}
            multiline
            numberOfLines={4}
            placeholder={t('feedbackPlaceholder')}
            placeholderTextColor={isDarkMode ? "#94a3b8" : "#999"}
            value={feedback}
            onChangeText={setFeedback}
          />
          
          <TouchableOpacity 
            style={[styles.submitButton, isDarkMode && styles.darkSubmitButton]} 
            onPress={handleFeedbackSubmit}
            disabled={feedback.trim().length === 0}
          >
            <Text style={[styles.submitButtonText, isDarkMode && styles.darkSubmitButtonText]}>
              {t('submitFeedback')}
            </Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2d3748',
  },
  darkSectionTitle: {
    color: '#e2e8f0',
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  darkFaqItem: {
    borderBottomColor: '#334155',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2d3748',
  },
  darkFaqQuestion: {
    color: '#e2e8f0',
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4a5568',
  },
  darkFaqAnswer: {
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
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    color: '#2d3748',
    marginBottom: 16,
    height: 100,
  },
  darkFeedbackInput: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#e2e8f0',
  },
  submitButton: {
    backgroundColor: '#00835A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  darkSubmitButton: {
    backgroundColor: '#0f4c3a',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkSubmitButtonText: {
    color: '#e2e8f0',
  },
});

export default HelpSupportScreen;