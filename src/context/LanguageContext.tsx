import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isLanguageSelected: boolean;
  setIsLanguageSelected: (selected: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    welcome: 'Welcome to MediVision',
    selectLanguage: 'Select Language',
    bangla: 'Bangla',
    english: 'English',
    continue: 'Continue',
    poweredBy: 'Powered by XYZ Healthcare',
    tagline: 'Your Health, Our Priority',
    languageSelection: 'Choose Your Language',
    languageDescription: 'Select your preferred language to continue',
    pocketHealthcare: 'Your pocket healthcare assistant for medicine details and safety.',
    pocketHealthcareBn: 'Your pocket healthcare assistant for medicine details and safety.',
    
    // Dashboard translations
    searchMedicine: 'Search Medicine',
    quickActions: 'Quick Actions',
    scanMedicine: 'Scan Medicine',
    useCameraToScan: 'Use Camera to Scan Medicine Box',
    uploadImages: 'Upload Images',
    selectFromGallery: 'Select from gallery or files',
    savedRecords: 'Saved Records',
    viewScanHistory: 'View your scan history',
    recentlyScanned: 'Recently Scanned',
    paracetamol: 'Paracetamol',
    napaExtra: 'Napa Extra',
    
    // Scan screen translations
    scanMedicineTitle: 'Scan Medicine',
    scanMedicineSubtitle: 'Use your camera to scan medicine boxes',
    cameraView: '📷 Camera View',
    pointCamera: 'Point your camera at a medicine box',
    ensureVisible: 'Ensure the barcode/QR code is visible',
    tapScan: 'Tap the scan button to analyze',
    cameraPermissionRequired: 'Camera permission is required to scan medicine',
    allowCameraAccess: 'Allow Camera Access',
    barcodeScanned: 'Barcode Scanned',
    barcodeType: 'Barcode Type',
    data: 'Data',
    photoTaken: 'Photo Taken',
    photoSavedToGallery: 'Photo has been saved to your gallery',
    error: 'Error',
    failedToTakePhoto: 'Failed to take photo',
    
    // History screen translations
    scanHistory: 'Scan History',
    recentScans: 'Your recent medicine scans',
    at: 'at',
    
    // Profile screen translations
    personalInformation: 'Personal Information',
    settings: 'Settings',
    privacyPolicy: 'Privacy Policy',
    helpSupport: 'Help & Support',
    about: 'About',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    address: 'Address',
    editPersonalInfo: 'Edit Personal Info',
    save: 'Save',
    cancel: 'Cancel',
    success: 'Success',
    personalInfoUpdated: 'Personal information updated successfully',
    
    // Bottom navigation translations
    home: 'Home',
    scan: 'Scan',
    history: 'History',
    profile: 'Profile',
    
    // Header translations
    menuOptions: 'Menu Options',
    notifications: 'Notifications',
    logout: 'Logout',
    noNewNotifications: 'No new notifications',
    viewAll: 'View All',
    areYouSureLogout: 'Are you sure you want to logout?',
    changeLanguage: 'Change Language',
    
    // Authentication translations
    login: 'Login',
    createAccount: 'Create Account',
    name: 'Name',
    enterEmail: 'Please enter your email',
    enterNameAndEmail: 'Please enter your name and email',
    enter4DigitOtp: 'Please enter a 4-digit OTP',
    sending: 'Sending...',
    sendOtp: 'Send OTP',
    enterOtpSent: 'Enter the OTP code sent to your email',
    
    // Common translations
    ok: 'OK',
    back: 'Back',
    
    // Image upload translations
    permissionRequired: 'Permission Required',
    galleryPermissionRequired: 'Gallery permission is required to select images',
    imagesSelected: 'Images Selected',
    imagesSelectedMessage: 'image(s) selected successfully',
    
    // Menu options
    selectAnOption: 'Select an option from the menu below',
    
    // Settings screen translations
    language: 'Language',
    appearance: 'Appearance',
    security: 'Security',
    account: 'Account',
    support: 'Support',
    dangerZone: 'Danger Zone',
    enableNotifications: 'Enable Notifications',
    receiveAppNotifications: 'Receive app notifications and alerts',
    darkMode: 'Dark Mode',
    enableDarkTheme: 'Enable dark theme for better night viewing',
    biometricAuth: 'Biometric Authentication',
    useFingerprintFaceID: 'Use fingerprint or Face ID for login',
    changePassword: 'Change Password',
    updateYourPassword: 'Update your account password',
    editProfile: 'Edit Profile',
    updateProfileInfo: 'Update your personal information',
    changeEmail: 'Change Email',
    updateEmailAddress: 'Update your email address',
    rateApp: 'Rate This App',
    rateThisApp: 'Rate us on the app store',
    rateAppError: 'Unable to open the app store. Please search for the app in your device\'s app store.',
    deleteAccount: 'Delete Account',
    permanentlyDeleteAccount: 'Permanently delete your account and data',
    getHelpWithApp: 'Get help with using the app',
    aboutThisApp: 'About this application',
    updated: 'updated',
    enabled: 'enabled',
    disabled: 'disabled',
    passwordChangeInstructions: 'Enter your current password and new password to update your account password.',
    profileEditInstructions: 'Update your personal information including name, email, and contact details.',
    emailChangeInstructions: 'Enter your new email address and confirm to update your account.',
    supportInstructions: 'Contact our support team for assistance with the app.',
    appDescription: 'MediVision is your trusted companion for medicine safety and information.',
    rateAppInstructions: 'Rate our app on the app store to help us improve.',
    deleteAccountWarning: 'Are you sure you want to delete your account? This action cannot be undone.',
    accountDeleted: 'Your account has been successfully deleted.',
    
    // Privacy Policy translations
    informationCollection: 'Information Collection',
    informationCollectionDesc: 'We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us.',
    informationUsage: 'Information Usage',
    informationUsageDesc: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.',
    informationSharing: 'Information Sharing',
    informationSharingDesc: 'We do not share your personal information with third parties except as necessary to provide our services or as required by law.',
    dataSecurity: 'Data Security',
    dataSecurityDesc: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
    dataRetention: 'Data Retention',
    dataRetentionDesc: 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations.',
    yourRights: 'Your Rights',
    yourRightsDesc: 'You have the right to access, update, or delete your personal information at any time.',
    childrenPrivacy: 'Children\'s Privacy',
    childrenPrivacyDesc: 'Our services are not intended for children under the age of 13, and we do not knowingly collect personal information from children.',
    policyChanges: 'Policy Changes',
    policyChangesDesc: 'We may update this privacy policy from time to time, and we will notify you of any changes by posting the new policy on our website.',
    effectiveDate: 'Effective Date: January 1, 2024',
    privacyPolicyIntro: 'This Privacy Policy describes how MediVision collects, uses, and shares your personal information when you use our mobile application.',
    privacyContact: 'If you have any questions about this Privacy Policy, please contact us at privacy@medivision.com.',
    
    // About page translations
    aboutMediVision: 'About MediVision',
    aboutIntro: 'MediVision is your trusted companion for medicine safety and information. Our mission is to empower individuals with accurate, accessible, and reliable pharmaceutical knowledge.',
    ourMission: 'Our Mission',
    missionDesc: 'To make medicine information accessible to everyone, ensuring safe and informed healthcare decisions for all.',
    keyFeatures: 'Key Features',
    feature1: 'Medicine Scanner - Instantly scan medicine barcodes to get detailed information',
    feature2: 'Safety Alerts - Receive important safety alerts and recall notifications',
    feature3: 'Medication History - Keep track of your medication usage and history',
    feature4: 'Drug Interaction Checker - Check potential interactions between different medications',
    feature5: 'Multilingual Support - Available in multiple languages for wider accessibility',
    ourTeam: 'Our Team',
    teamDesc: 'MediVision is developed by a dedicated team of healthcare professionals, pharmacists, and technology experts committed to improving healthcare accessibility.',
    contactUs: 'Contact Us',
    contactDesc: 'Have questions or feedback? We\'d love to hear from you!',
    contactEmail: 'support@medivision.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '123 Healthcare Avenue, Medical District, MD 12345',
    version: 'Version',
    appVersion: '1.0.0',
    
    // Help & Support page translations
    helpSupportTitle: 'Help & Support',
    faqTitle: 'Frequently Asked Questions',
    faq1Question: 'How do I scan a medicine?',
    faq1Answer: 'To scan a medicine, go to the Scan tab and point your camera at the barcode or QR code on the medicine box. Ensure the code is clearly visible and tap the scan button.',
    faq2Question: 'What information can I get from scanning?',
    faq2Answer: 'By scanning a medicine, you can get detailed information including ingredients, dosage instructions, side effects, warnings, and safety alerts.',
    faq3Question: 'Is my data secure?',
    faq3Answer: 'Yes, we take data security seriously. All your personal information and scan history are encrypted and stored securely. Please review our Privacy Policy for more details.',
    faq4Question: 'How can I contact support?',
    faq4Answer: 'You can contact our support team by emailing support@medivision.com or calling our helpline at +1 (555) 123-4567.',
    faq5Question: 'Can I use the app offline?',
    faq5Answer: 'While some features require an internet connection, your scan history is stored locally and can be accessed offline.',
    contactSupport: 'Contact Support',
    supportEmail: 'support@medivision.com',
    supportPhone: '+1 (555) 123-4567',
    supportHours: 'Support Hours: Monday - Friday, 9:00 AM - 6:00 PM EST',
    feedbackTitle: 'Send Feedback',
    feedbackPlaceholder: 'How can we improve your experience?',
    submitFeedback: 'Submit Feedback',
    feedbackSuccess: 'Thank you for your feedback!',
  },
  bn: {
    welcome: 'মেডিভিশনে স্বাগতম',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    bangla: 'বাংলা',
    english: 'ইংরেজি',
    continue: 'চালিয়ে যান',
    poweredBy: 'XYZ স্বাস্থ্যসেবা দ্বারা পরিচালিত',
    tagline: 'আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার',
    languageSelection: 'আপনার ভাষা চয়ন করুন',
    languageDescription: 'চালিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন',
    pocketHealthcare: 'আপনার পকেট স্বাস্থ্যসেবা সহায়ক ওষুধের বিস্তারিত এবং নিরাপত্তার জন্য।',
    pocketHealthcareBn: 'আপনার পকেট স্বাস্থ্যসেবা সহায়ক ওষুধের বিস্তারিত এবং নিরাপত্তার জন্য।',
    
    // Dashboard translations
    searchMedicine: 'ঔষধ অনুসন্ধান করুন',
    quickActions: 'দ্রুত কাজ',
    scanMedicine: 'ঔষধ স্ক্যান করুন',
    useCameraToScan: 'ক্যামেরা ব্যবহার করে ঔষধের বাক্স স্ক্যান করুন',
    uploadImages: 'ছবি আপলোড করুন',
    selectFromGallery: 'গ্যালারি বা ফাইল থেকে নির্বাচন করুন',
    savedRecords: 'সংরক্ষিত রেকর্ড',
    viewScanHistory: 'আপনার স্ক্যান ইতিহাস দেখুন',
    recentlyScanned: 'সম্প্রতি স্ক্যান করা হয়েছে',
    paracetamol: 'প্যারাসিটামল',
    napaExtra: 'নাপা এক্সট্রা',
    
    // Scan screen translations
    scanMedicineTitle: 'ঔষধ স্ক্যান করুন',
    scanMedicineSubtitle: 'আপনার ক্যামেরা ব্যবহার করে ঔষধের বাক্স স্ক্যান করুন',
    cameraView: '📷 ক্যামেরা ভিউ',
    pointCamera: 'আপনার ক্যামেরা ঔষধের বাক্সের দিকে নির্দেশ করুন',
    ensureVisible: 'বারকোড/QR কোড দৃশ্যমান নিশ্চিত করুন',
    tapScan: 'বিশ্লেষণ করতে স্ক্যান বোতামে ট্যাপ করুন',
    cameraPermissionRequired: 'ঔষধ স্ক্যান করার জন্য ক্যামেরা অনুমতি প্রয়োজন',
    allowCameraAccess: 'ক্যামেরা অ্যাক্সেস অনুমতি দিন',
    barcodeScanned: 'বারকোড স্ক্যান করা হয়েছে',
    barcodeType: 'বারকোড টাইপ',
    data: 'ডেটা',
    photoTaken: 'ছবি তোলা হয়েছে',
    photoSavedToGallery: 'ছবি আপনার গ্যালারিতে সংরক্ষণ করা হয়েছে',
    error: 'ত্রুটি',
    failedToTakePhoto: 'ছবি তোলা ব্যর্থ হয়েছে',
    
    // History screen translations
    scanHistory: 'স্ক্যান ইতিহাস',
    recentScans: 'আপনার সম্প্রতি স্ক্যান করা ঔষধগুলি',
    at: '-এ',
    
    // Profile screen translations
    personalInformation: 'ব্যক্তিগত তথ্য',
    settings: 'সেটিংস',
    privacyPolicy: 'গোপনীয়তা নীতি',
    helpSupport: 'সাহায্য ও সমর্থন',
    about: 'সম্পর্কে',
    fullName: 'পূর্ণ নাম',
    email: 'ইমেইল',
    phone: 'ফোন',
    dateOfBirth: 'জন্ম তারিখ',
    gender: 'লিঙ্গ',
    address: 'ঠিকানা',
    editPersonalInfo: 'ব্যক্তিগত তথ্য সম্পাদনা করুন',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    success: 'সফল',
    personalInfoUpdated: 'ব্যক্তিগত তথ্য সফলভাবে আপডেট হয়েছে',
    
    // Bottom navigation translations
    home: 'হোম',
    scan: 'স্ক্যান',
    history: 'ইতিহাস',
    profile: 'প্রোফাইল',
    
    // Header translations
    menuOptions: 'মেনু অপশন',
    notifications: 'বিজ্ঞপ্তি',
    logout: 'লগআউট',
    noNewNotifications: 'কোন নতুন বিজ্ঞপ্তি নেই',
    viewAll: 'সব দেখুন',
    areYouSureLogout: 'আপনি কি লগআউট করতে চান?',
    changeLanguage: 'ভাষা পরিবর্তন করুন',
    
    // Authentication translations
    login: 'লগইন',
    createAccount: 'একাউন্ট তৈরি করুন',
    name: 'নাম',
    enterEmail: 'দয়া করে আপনার ইমেইল লিখুন',
    enterNameAndEmail: 'দয়া করে আপনার নাম এবং ইমেইল লিখুন',
    enter4DigitOtp: 'দয়া করে 4 ডিজিটের OTP প্রদান করুন',
    sending: 'পাঠানো হচ্ছে...',
    sendOtp: 'OTP পাঠান',
    enterOtpSent: 'আপনার ইমেইলে পাঠানো OTP কোড লিখুন',
    
    // Common translations
    ok: 'ঠিক আছে',
    back: 'ফিরে যান',
    
    // Image upload translations
    permissionRequired: 'অনুমতি প্রয়োজন',
    galleryPermissionRequired: 'ছবি নির্বাচন করতে গ্যালারি অনুমতি প্রয়োজন',
    imagesSelected: 'ছবি নির্বাচিত',
    imagesSelectedMessage: 'টি ছবি সফলভাবে নির্বাচিত হয়েছে',
    
    // Menu options
    selectAnOption: 'নিচের মেনু থেকে একটি অপশন নির্বাচন করুন',
    
    // Settings screen translations
    language: 'ভাষা',
    appearance: 'অ্যাপিয়ারেন্স',
    security: 'নিরাপত্তা',
    account: 'একাউন্ট',
    support: 'সমর্থন',
    dangerZone: 'বিপজ্জনক অঞ্চল',
    enableNotifications: 'বিজ্ঞপ্তি সক্রিয় করুন',
    receiveAppNotifications: 'অ্যাপ বিজ্ঞপ্তি এবং সতর্কতা পান',
    darkMode: 'ডার্ক মোড',
    enableDarkTheme: 'রাতে ভালো দেখার জন্য ডার্ক থিম সক্রিয় করুন',
    biometricAuth: 'বায়োমেট্রিক প্রমাণীকরণ',
    useFingerprintFaceID: 'লগইনের জন্য আঙ্গুলের ছাপ বা ফেস আইডি ব্যবহার করুন',
    changePassword: 'পাসওয়ার্ড পরিবর্তন করুন',
    updateYourPassword: 'আপনার একাউন্ট পাসওয়ার্ড আপডেট করুন',
    editProfile: 'প্রোফাইল সম্পাদনা করুন',
    updateProfileInfo: 'আপনার ব্যক্তিগত তথ্য আপডেট করুন',
    changeEmail: 'ইমেইল পরিবর্তন করুন',
    updateEmailAddress: 'আপনার ইমেইল ঠিকানা আপডেট করুন',
    rateApp: 'অ্যাপটি রেট করুন',
    rateThisApp: 'অ্যাপ স্টোরে আমাদের রেট করুন',
    rateAppError: 'অ্যাপ স্টোর খুলতে অক্ষম। দয়া করে আপনার ডিভাইসের অ্যাপ স্টোরে অ্যাপটি খুঁজে নিন।',
    deleteAccount: 'একাউন্ট মুছে ফেলুন',
    permanentlyDeleteAccount: 'আপনার একাউন্ট এবং ডেটা স্থায়ীভাবে মুছে ফেলুন',
    getHelpWithApp: 'অ্যাপটি ব্যবহার করতে সাহায্য নিন',
    aboutThisApp: 'এই অ্যাপ্লিকেশন সম্পর্কে',
    updated: 'আপডেট হয়েছে',
    enabled: 'সক্রিয়',
    disabled: 'নিষ্ক্রিয়',
    passwordChangeInstructions: 'আপনার বর্তমান পাসওয়ার্ড এবং নতুন পাসওয়ার্ড প্রবেশ করান আপনার অ্যাকাউন্ট পাসওয়ার্ড আপডেট করতে।',
    profileEditInstructions: 'আপনার নাম, ইমেইল এবং যোগাযোগের বিবরণসহ ব্যক্তিগত তথ্য আপডেট করুন।',
    emailChangeInstructions: 'আপনার নতুন ইমেইল ঠিকানা প্রবেশ করান এবং নিশ্চিত করুন আপনার অ্যাকাউন্ট আপডেট করতে।',
    supportInstructions: 'অ্যাপটির সাহায্যের জন্য আমাদের সমর্থন দলের সাথে যোগাযোগ করুন।',
    appDescription: 'মেডিভিশন হল আপনার ওষুধ নিরাপত্তা এবং তথ্যের জন্য বিশ্বস্ত সঙ্গী।',
    rateAppInstructions: 'আমাদের অ্যাপটি রেট করুন অ্যাপ স্টোরে আমাদের উন্নতি করতে সাহায্য করতে।',
    deleteAccountWarning: 'আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্ট মুছে ফেলতে চান? এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।',
    accountDeleted: 'আপনার অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।',
    
    // Privacy Policy translations
    informationCollection: 'তথ্য সংগ্রহ',
    informationCollectionDesc: 'আমরা আপনার কাছ থেকে সরাসরি তথ্য সংগ্রহ করি, যেমন আপনি যখন একটি অ্যাকাউন্ট তৈরি করেন, আমাদের পরিষেবা ব্যবহার করেন বা আমাদের সাথে যোগাযোগ করেন।',
    informationUsage: 'তথ্য ব্যবহার',
    informationUsageDesc: 'আমরা আমাদের পরিষেবা প্রদান, রক্ষণাবেক্ষণ এবং উন্নত করতে, আপনার সাথে যোগাযোগ করতে এবং আইনী দায়িত্ব পূরণ করতে আমরা সংগৃহীত তথ্য ব্যবহার করি।',
    informationSharing: 'তথ্য শেয়ারিং',
    informationSharingDesc: 'আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না যদি না এটি আমাদের পরিষেবা প্রদানের জন্য প্রয়োজনীয় হয় বা আইন দ্বারা প্রয়োজন হয়।',
    dataSecurity: 'ডেটা নিরাপত্তা',
    dataSecurityDesc: 'আমরা আপনার ব্যক্তিগত তথ্যকে অননুমোদিত অ্যাক্সেস, পরিবর্তন, প্রকাশ বা ধ্বংস থেকে সুরক্ষিত করতে উপযুক্ত নিরাপত্তা পদক্ষেপ বাস্তবায়ন করি।',
    dataRetention: 'ডেটা সংরক্ষণ',
    dataRetentionDesc: 'আমরা আমাদের পরিষেবা প্রদান এবং আইনী দায়িত্ব পূরণ করতে প্রয়োজনীয় সময়ের জন্য আপনার ব্যক্তিগত তথ্য সংরক্ষণ করি।',
    yourRights: 'আপনার অধিকার',
    yourRightsDesc: 'আপনার যেকোনো সময় আপনার ব্যক্তিগত তথ্য অ্যাক্সেস, আপডেট বা মুছে ফেলার অধিকার রয়েছে।',
    childrenPrivacy: 'শিশুদের গোপনীয়তা',
    childrenPrivacyDesc: 'আমাদের পরিষেবা 13 বছরের কম বয়সী শিশুদের জন্য উদ্দিষ্ট নয়, এবং আমরা জানিয়ে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।',
    policyChanges: 'নীতি পরিবর্তন',
    policyChangesDesc: 'আমরা সময়ে সময়ে এই গোপনীয়তা নীতিটি আপডেট করতে পারি, এবং আমরা ওয়েবসাইটে নতুন নীতিটি পোস্ট করে আপনাকে পরিবর্তনগুলি সম্পর্কে অবগত করব।',
    effectiveDate: 'কার্যকর তারিখ: ১ জানুয়ারি, ২০২৪',
    privacyPolicyIntro: 'এই গোপনীয়তা নীতিটি বর্ণনা করে যে MediVision আপনি আমাদের মোবাইল অ্যাপ্লিকেশন ব্যবহার করার সময় আপনার ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার এবং শেয়ার করে।',
    privacyContact: 'আপনার যদি এই গোপনীয়তা নীতি সম্পর্কে কোনও প্রশ্ন থাকে, তবে দয়া করে privacy@medivision.com এ আমাদের সাথে যোগাযোগ করুন।',
    
    // About page translations
    aboutMediVision: 'মেডিভিশন সম্পর্কে',
    aboutIntro: 'মেডিভিশন হল আপনার ওষুধ নিরাপত্তা এবং তথ্যের জন্য বিশ্বস্ত সঙ্গী। আমাদের মিশন হল ব্যক্তিদের নির্ভুল, অ্যাক্সেসযোগ্য এবং নির্ভরযোগ্য ফার্মাসিউটিক্যাল জ্ঞান দিয়ে ক্ষমতায়ন করা।',
    ourMission: 'আমাদের মিশন',
    missionDesc: 'সবার জন্য ওষুধের তথ্য অ্যাক্সেসযোগ্য করা, সবার জন্য নিরাপদ এবং তথ্যসমৃদ্ধ স্বাস্থ্যসেবা সিদ্ধান্ত নিশ্চিত করা।',
    keyFeatures: 'প্রধান বৈশিষ্ট্য',
    feature1: 'ঔষধ স্ক্যানার - ওষুধের বারকোড স্ক্যান করে বিস্তারিত তথ্য পান',
    feature2: 'নিরাপত্তা সতর্কতা - গুরুত্বপূর্ণ নিরাপত্তা সতর্কতা এবং রিকল নোটিফিকেশন পান',
    feature3: 'ঔষধ ইতিহাস - আপনার ঔষধ ব্যবহার এবং ইতিহাস ট্র্যাক করুন',
    feature4: 'ড্রাগ ইন্টারঅ্যাকশন চেকার - বিভিন্ন ওষুধের মধ্যে সম্ভাব্য ইন্টারঅ্যাকশন চেক করুন',
    feature5: 'বহুভাষিক সমর্থন - ব্যাপক অ্যাক্সেসযোগ্যতার জন্য একাধিক ভাষায় উপলব্ধ',
    ourTeam: 'আমাদের দল',
    teamDesc: 'মেডিভিশন একটি নিবেদিত স্বাস্থ্যসেবা পেশাদার, ফার্মাসিস্ট এবং প্রযুক্তি বিশেষজ্ঞদের দল দ্বারা ডেভেলপ করা হয়েছে যারা স্বাস্থ্যসেবা অ্যাক্সেসযোগ্যতা উন্নত করতে নিবেদিত।',
    contactUs: 'যোগাযোগ করুন',
    contactDesc: 'প্রশ্ন বা প্রতিক্রিয়া আছে? আমরা আপনার কথা শুনতে চাই!',
    contactEmail: 'support@medivision.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '123 হেলথকেয়ার অ্যাভিনিউ, মেডিকেল জেলা, MD 12345',
    version: 'সংস্করণ',
    appVersion: '1.0.0',
    
    // Help & Support page translations
    helpSupportTitle: 'সাহায্য ও সমর্থন',
    faqTitle: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
    faq1Question: 'আমি কিভাবে একটি ঔষধ স্ক্যান করব?',
    faq1Answer: 'একটি ঔষধ স্ক্যান করতে, স্ক্যান ট্যাবে যান এবং ঔষধের বাক্সের বারকোড বা QR কোডের দিকে আপনার ক্যামেরা নির্দেশ করুন। কোডটি স্পষ্টভাবে দৃশ্যমান নিশ্চিত করুন এবং স্ক্যান বোতামে ট্যাপ করুন।',
    faq2Question: 'স্ক্যান করে আমি কী তথ্য পাব?',
    faq2Answer: 'একটি ঔষধ স্ক্যান করে, আপনি উপাদান, ডোজ নির্দেশ, পার্শ্বপ্রতিক্রিয়া, সতর্কতা এবং নিরাপত্তা সতর্কতা সহ বিস্তারিত তথ্য পেতে পারেন।',
    faq3Question: 'আমার ডেটা কি নিরাপদ?',
    faq3Answer: 'হ্যাঁ, আমরা ডেটা নিরাপত্তাকে গুরুত্বের সাথে নেই। আপনার সমস্ত ব্যক্তিগত তথ্য এবং স্ক্যান ইতিহাস এনক্রিপ্ট করা হয় এবং নিরাপদভাবে সংরক্ষণ করা হয়। আরও বিস্তারিত জানতে আমাদের গোপনীয়তা নীতি পর্যালোচনা করুন।',
    faq4Question: 'আমি কিভাবে সমর্থনের সাথে যোগাযোগ করতে পারি?',
    faq4Answer: 'আপনি support@medivision.com এ ইমেইল করে বা +1 (555) 123-4567 হেল্পলাইনে কল করে আমাদের সমর্থন দলের সাথে যোগাযোগ করতে পারেন।',
    faq5Question: 'আমি কি অফলাইনে অ্যাপটি ব্যবহার করতে পারি?',
    faq5Answer: 'যদিও কিছু বৈশিষ্ট্যের জন্য ইন্টারনেট সংযোগ প্রয়োজন, আপনার স্ক্যান ইতিহাস স্থানীয়ভাবে সংরক্ষণ করা হয় এবং অফলাইনে অ্যাক্সেস করা যেতে পারে।',
    contactSupport: 'সমর্থনের সাথে যোগাযোগ করুন',
    supportEmail: 'support@medivision.com',
    supportPhone: '+1 (555) 123-4567',
    supportHours: 'সমর্থন ঘন্টা: সোমবার - শুক্রবার, সকাল ৯:০০ - বিকাল ৬:০০ EST',
    feedbackTitle: 'প্রতিক্রিয়া পাঠান',
    feedbackPlaceholder: 'আপনি কিভাবে আপনার অভিজ্ঞতা উন্নত করতে পারেন?',
    submitFeedback: 'প্রতিক্রিয়া জমা দিন',
    feedbackSuccess: 'আপনার প্রতিক্রিয়ার জন্য ধন্যবাদ!',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLanguageSelected, setIsLanguageSelected }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


