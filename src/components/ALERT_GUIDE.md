# Enhanced Alert System Guide

The MediVision mobile app now features an enhanced alert system with distinct visual styling for different types of alerts. This guide explains how to use the new alert variants throughout the application.

## Alert Types

### Success Alerts (Green)
- **Purpose**: Used for successful operations and confirmations
- **Color Scheme**: Green background with checkmark icon
- **Usage**: When an operation completes successfully

```typescript
showAlert({
  title: 'Success',
  message: 'Your action was completed successfully.',
  type: 'success',
  actions: [
    {
      text: 'OK',
      onPress: () => console.log('Success alert dismissed'),
    },
  ],
});
```

### Error Alerts (Red)
- **Purpose**: Used for errors, failures, and critical issues
- **Color Scheme**: Red background with error icon
- **Usage**: When an operation fails or encounters an error

```typescript
showAlert({
  title: 'Error',
  message: 'Failed to complete the operation.',
  type: 'error',
  actions: [
    {
      text: 'Retry',
      onPress: () => console.log('Retry action'),
    },
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: () => console.log('Cancel action'),
    },
  ],
});
```

### Warning Alerts (Yellow)
- **Purpose**: Used for warnings and cautionary messages
- **Color Scheme**: Yellow background with warning icon
- **Usage**: When the user needs to be cautious about something

```typescript
showAlert({
  title: 'Warning',
  message: 'This action cannot be undone.',
  type: 'warning',
  actions: [
    {
      text: 'Proceed',
      style: 'destructive',
      onPress: () => console.log('Proceed action'),
    },
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: () => console.log('Cancel action'),
    },
  ],
});
```

### Info Alerts (Blue)
- **Purpose**: Used for informational messages and general notifications
- **Color Scheme**: Blue background with information icon
- **Usage**: For general information or neutral notifications

```typescript
showAlert({
  title: 'Information',
  message: 'Here is some important information.',
  type: 'info',
  actions: [
    {
      text: 'Got it',
      onPress: () => console.log('Info alert dismissed'),
    },
  ],
});
```

## Implementation Details

The alert system is implemented using the `useAlert` hook and the `AlertProvider` context. The `AlertProvider` is already included in the root component (`App.tsx`), so the alert system is available throughout the entire application.

### Using Alerts in Components

1. Import the `useAlert` hook:
```typescript
import { useAlert } from '../context/AlertContext';
```

2. Use the hook in your component:
```typescript
const { showAlert } = useAlert();
```

3. Call the showAlert function with appropriate parameters:
```typescript
showAlert({
  title: 'Alert Title',
  message: 'Alert message.',
  type: 'success', // 'success' | 'error' | 'warning' | 'info'
  actions: [
    {
      text: 'OK',
      onPress: () => console.log('Alert dismissed'),
    },
  ],
});
```

## Action Styles

### Default Action
- **Style**: Green gradient button
- **Usage**: Primary action buttons

```typescript
{
  text: 'OK',
  onPress: () => console.log('Primary action'),
}
```

### Cancel Action
- **Style**: Gray bordered button
- **Usage**: Cancel or dismiss actions

```typescript
{
  text: 'Cancel',
  style: 'cancel',
  onPress: () => console.log('Cancel action'),
}
```

### Destructive Action
- **Style**: Red button
- **Usage**: Actions that delete or remove data

```typescript
{
  text: 'Delete',
  style: 'destructive',
  onPress: () => console.log('Destructive action'),
}
```

## Best Practices

1. **Use descriptive titles**: Make the alert title clear and concise
2. **Provide helpful messages**: Explain what happened or what the user should do next
3. **Choose the right type**: Match the alert type to the severity of the message
4. **Be consistent**: Use the same terminology and styling throughout the application
5. **Keep it brief**: Alerts should be concise and to the point
6. **Provide clear actions**: Make it obvious what the user can do next

## Examples

### Successful Form Submission
```typescript
try {
  await submitForm(data);
  showAlert({
    title: 'Form Submitted',
    message: 'Your form has been successfully submitted.',
    type: 'success',
    actions: [
      {
        text: 'OK',
        onPress: () => router.push('/dashboard'),
      },
    ],
  });
} catch (error) {
  showAlert({
    title: 'Submission Failed',
    message: 'Failed to submit the form. Please try again.',
    type: 'error',
    actions: [
      {
        text: 'Retry',
        onPress: () => submitForm(data),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  });
}
```

### File Upload Warning
```typescript
if (file.size > MAX_FILE_SIZE) {
  showAlert({
    title: 'File Too Large',
    message: `File size must be less than ${MAX_FILE_SIZE_MB}MB.`,
    type: 'warning',
    actions: [
      {
        text: 'Choose Another File',
        onPress: () => pickFile(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  });
  return;
}
```

### Informational Message
```typescript
showAlert({
  title: 'New Feature Available',
  message: 'Check out the new dashboard features in the settings menu.',
  type: 'info',
  actions: [
    {
      text: 'Got it',
      onPress: () => console.log('User acknowledged new feature'),
    },
  ],
});
```

## Customization

The alert system can be further customized by modifying the following files:
- `components/CustomAlert.tsx` - Core alert component styling and animations
- `context/AlertContext.tsx` - Alert state management
- `hooks/useCustomAlert.tsx` - Alert hook implementation

## Accessibility

The alert system includes:
- Proper contrast ratios for readability
- Clear visual indicators for each message type
- Screen reader support
- Keyboard navigable elements
- Animations that can be disabled for users with motion sensitivity

This ensures that all users can effectively understand and interact with alert notifications.