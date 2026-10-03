# Implementation Plan: Email/Password Sign-In

## Overview
Replace the current magic link authentication with email and password sign-in at the top right corner of the header.

## Current State
- Authentication uses Supabase magic link (OTP) via `signInWithOtp`
- Sign-in UI is in `trip/src/components/layout/Header.tsx`
- Auth logic is in `trip/src/auth/AuthContext.tsx`
- Currently shows email input only with "Send magic link" button

## Files to Modify
1. `trip/src/auth/AuthContext.tsx` - Update sign-in method
2. `trip/src/components/layout/Header.tsx` - Update sign-in form UI

## Implementation Steps

### Step 1: Update AuthContext.tsx
- Change `signInWithEmail` to `signInWithPassword`
- Update function signature to accept both email and password
- Use Supabase's `signInWithPassword` method instead of `signInWithOtp`
- Remove magic link redirect logic

**Changes:**
```typescript
// Before
signInWithEmail: (email: string) => Promise<{ error: string | null }>

// After
signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>
```

**Implementation:**
```typescript
const signInWithPassword = useCallback(async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error?.message ?? null }
}, [])
```

### Step 2: Update Header.tsx
- Add password state and input field
- Update form to include both email and password fields
- Change button text from "Send magic link" to "Sign in"
- Remove success message about checking email (since password auth is immediate)
- Update function call to pass both email and password

**UI Changes:**
- Add password input field below email input
- Keep same styling as email input
- Update button text to "Sign in"
- Remove the `signInSent` state and success message (no longer needed)

## Design Notes
- Follow existing form styling from `ui-design-guideline.md`
- Use same input styling: `bg-bg border border-border rounded-[10px] text-[13px]`
- Maintain focus state: `focus:outline-none focus:border-teal-mid`
- Keep button styling: `bg-teal-dark text-white rounded-[10px] text-[12px] font-semibold`
- Form should remain in the dropdown at top right corner

## Verification
- [ ] User can enter email and password
- [ ] Sign-in works with valid credentials
- [ ] Error message displays for invalid credentials
- [ ] User email displays after successful sign-in
- [ ] Sign out button works correctly
- [ ] No "magic link" text or functionality remains
- [ ] Form styling matches design guidelines
