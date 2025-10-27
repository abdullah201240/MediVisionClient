# Enhanced Alert System

The MediVision app now features an enhanced alert system with distinct visual styling for different types of alerts to improve user experience and understanding.

## Alert Types

### Success Alerts (Green)
- Used for successful operations and confirmations
- Green color scheme with checkmark icon
- Background: rgba(16, 185, 129, 0.15) in light mode, rgba(52, 211, 153, 0.15) in dark mode

### Error Alerts (Red)
- Used for errors, failures, and critical issues
- Red color scheme with error icon
- Background: rgba(239, 68, 68, 0.15) in light mode, rgba(248, 113, 113, 0.15) in dark mode

### Warning Alerts (Yellow)
- Used for warnings and cautionary messages
- Yellow color scheme with warning icon
- Background: rgba(245, 158, 11, 0.15) in light mode, rgba(251, 191, 36, 0.15) in dark mode

### Info Alerts (Blue)
- Used for informational messages and general notifications
- Blue color scheme with information icon
- Background: rgba(59, 130, 246, 0.15) in light mode, rgba(96, 165, 250, 0.15) in dark mode

## Features

- Animated entrance and exit transitions
- Pulsing icon effect for visual attention
- Glass morphism design with blur effect
- Responsive design that works on all screen sizes
- Dark mode support with appropriate color adjustments
- Custom actions with different styling options (default, cancel, destructive)

## Usage

```typescript
const { showAlert } = useAlert();

showAlert({
  title: 'Success!',
  message: 'Your action was completed successfully.',
  type: 'success', // 'success' | 'error' | 'warning' | 'info'
  actions: [
    {
      text: 'OK',
      onPress: () => console.log('Alert dismissed'),
    },
  ],
});
```