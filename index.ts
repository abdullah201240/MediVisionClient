import { registerRootComponent } from 'expo';
import React from 'react';
import App from './App';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AlertProvider } from './src/context/AlertContext';

const RootApp = () => {
  return React.createElement(
    LanguageProvider,
    null,
    React.createElement(
      ThemeProvider,
      null,
      React.createElement(
        AlertProvider,
        null,
        React.createElement(App)
      )
    )
  );
};

registerRootComponent(RootApp);