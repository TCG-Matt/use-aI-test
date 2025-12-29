# Next.js Architecture Guide for Claude

This document provides architectural guidance for AI assistants working on this Next.js project.

## Project Overview

This is a Next.js 14+ application using the App Router with TypeScript and Tailwind CSS.

## Architecture Principles

### 1. Server-First Approach
- **Default to Server Components**: Use Server Components unless you need interactivity
- **Data Fetching**: Fetch data in Server Components, not in `useEffect`
- **Performance**: Server Components reduce client-side JavaScript

### 2. Component Organization

```
app/
├── (marketing)/          # Route group for marketing pages
│   ├── page.tsx
│   └── about/
├── (app)/               # Route group for authenticated app
│   ├── dashboard/
│   └── settings/
├── api/                 # API routes
└── components/
    ├── ui/             # Shadcn/ui components
    ├── features/       # Feature-specific components
    └── layouts/        # Layout components
```

### 3. Data Fetching Patterns

**Server Component (Preferred)**:
```typescript
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return <div>{data.title}</div>;
}
```

**Client Component (When Needed)**:
```typescript
'use client';
import { useEffect, useState } from 'react';

export function ClientComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return <div>{data?.title}</div>;
}
```

### 4. State Management

- **Server State**: Use Server Components and React Server Actions
- **Client State**: Use `useState` for local state
- **Global State**: Consider Zustand or Jotai for complex client state
- **Form State**: Use React Hook Form with Zod validation

### 5. Styling

- **Tailwind CSS**: Use utility classes for styling
- **CSS Modules**: For component-specific styles when needed
- **Shadcn/ui**: Use for consistent UI components

## Common Patterns

### Loading States
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />;
}
```

### Error Handling
```typescript
// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorBoundary error={error} reset={reset} />;
}
```

### Metadata
```typescript
export const metadata = {
  title: 'Dashboard',
  description: 'User dashboard',
};
```

## Testing Strategy

1. **Unit Tests**: Test utility functions and hooks
2. **Component Tests**: Test Client Components with React Testing Library
3. **Integration Tests**: Test Server Components with Playwright
4. **E2E Tests**: Test critical user flows

## Performance Optimization

1. Use `next/image` for automatic image optimization
2. Implement proper caching strategies
3. Use dynamic imports for code splitting
4. Optimize fonts with `next/font`
5. Monitor Core Web Vitals

## Security

1. Validate all user input with Zod
2. Use environment variables for secrets
3. Implement CSRF protection for forms
4. Use Server Actions for mutations
5. Sanitize user-generated content

## Deployment

- **Vercel**: Recommended for zero-config deployment
- **Docker**: Use provided `docker-compose.yml` for containerized deployment
- **Environment Variables**: Configure in `.env.local` (development) and deployment platform

## AI Assistant Guidelines

When implementing features:
1. Start with Server Components
2. Add `'use client'` only when necessary
3. Implement proper error boundaries
4. Add loading states
5. Write tests alongside implementation
6. Follow the existing file structure
7. Use TypeScript strictly (no `any`)
