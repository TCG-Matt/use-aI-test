# React Native Architecture Guide for Claude

This document provides architectural guidance for AI assistants working on this React Native project.

## Project Overview

This is a React Native application using Expo with TypeScript and Expo Router for file-based routing.

## Architecture Principles

### 1. Expo-First Approach
- **Use Expo SDK**: Leverage Expo's managed workflow for faster development
- **EAS Build**: Use EAS for building and deploying
- **Expo Router**: Use file-based routing for navigation

### 2. Component Organization

```
app/
├── (tabs)/              # Tab-based navigation
│   ├── index.tsx
│   ├── explore.tsx
│   └── _layout.tsx
├── (auth)/              # Authentication flow
│   ├── login.tsx
│   └── _layout.tsx
├── [id].tsx             # Dynamic routes
└── _layout.tsx          # Root layout

components/
├── ui/                  # Reusable UI components
├── features/            # Feature-specific components
└── layouts/             # Layout components

hooks/                   # Custom React hooks
utils/                   # Utility functions
constants/               # App constants and theme
types/                   # TypeScript type definitions
```

### 3. State Management Strategy

**Local State**:
```typescript
import { useState } from 'react';

function Component() {
  const [count, setCount] = useState(0);
  return <Text>{count}</Text>;
}
```

**Global State (Zustand)**:
```typescript
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**Server State (React Query)**:
```typescript
import { useQuery } from '@tanstack/react-query';

function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
}
```

### 4. Navigation Patterns

**Stack Navigation**:
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

**Tab Navigation**:
```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### 5. Styling Approach

**StyleSheet**:
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

**Theme System**:
```typescript
// constants/theme.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
};
```

## Common Patterns

### Screen Template
```typescript
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text>Screen Content</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
```

### List Rendering
```typescript
import { FlatList } from 'react-native';

<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemComponent item={item} />}
  ListEmptyComponent={<EmptyState />}
/>
```

### Form Handling
```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => (
        <TextInput
          value={field.value}
          onChangeText={field.onChange}
        />
      )}
    />
  );
}
```

## Testing Strategy

1. **Unit Tests**: Test utility functions and custom hooks
2. **Component Tests**: Test components with React Native Testing Library
3. **Integration Tests**: Test feature flows
4. **E2E Tests**: Test critical user journeys with Detox

## Performance Optimization

1. Use FlatList for long lists
2. Implement proper memoization (React.memo, useMemo, useCallback)
3. Optimize images (WebP, proper dimensions)
4. Use Hermes engine
5. Profile with Flipper
6. Lazy load screens and components

## Security

1. Store sensitive data in Expo SecureStore
2. Validate all user input
3. Use HTTPS for all network requests
4. Implement proper authentication
5. Handle permissions properly

## Platform-Specific Considerations

### iOS
- Handle safe areas properly
- Test on different iPhone sizes
- Implement proper haptic feedback
- Follow iOS Human Interface Guidelines

### Android
- Handle back button
- Test on different Android versions
- Implement proper Material Design
- Handle permissions at runtime

## AI Assistant Guidelines

When implementing features:
1. Use Expo SDK when possible
2. Implement proper TypeScript types
3. Follow the file structure conventions
4. Add proper error handling
5. Implement loading states
6. Write tests alongside implementation
7. Consider both iOS and Android platforms
8. Optimize for performance from the start
