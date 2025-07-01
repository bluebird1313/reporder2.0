# RepOrder Authentication Setup

This document explains how to set up the Supabase authentication system with role-based access control.

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Configuration (Required for database and auth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Supabase Client Configuration (Required for frontend auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Shopify OAuth (existing)
SHOPIFY_CLIENT_ID=your_shopify_client_id
SHOPIFY_CLIENT_SECRET=your_shopify_client_secret

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3003
```

## 📁 Database Setup

1. **Apply the new migration**:
   ```bash
   npx supabase db push
   ```

2. **Regenerate database types**:
   ```bash
   npx supabase gen types typescript --local > src/lib/database.types.ts
   ```

3. **Verify tables were created**:
   - `public.users` - User profiles with roles
   - Updated `rep_access` and `product_sharing_permissions` with RLS policies

## 🎭 User Roles System

### Company Users
- **Role**: `'company'`
- **Access**: `/dashboard/company`
- **Permissions**: 
  - Manage rep access to their store
  - Set product sharing permissions
  - View analytics for their store

### Sales Rep Users  
- **Role**: `'rep'`
- **Access**: `/dashboard/rep`
- **Permissions**:
  - View assigned store inventories
  - Access only permitted product collections
  - Track sales performance

## 🔐 Authentication Flow

### Sign Up Process
1. User visits `/login`
2. Selects role (Company or Rep)
3. Fills out registration form
4. System creates auth user + profile record
5. Email verification sent
6. After verification, user can sign in

### Sign In Process  
1. User enters email/password at `/login`
2. System validates credentials
3. Fetches user profile with role
4. Redirects to appropriate dashboard:
   - Company → `/dashboard/company`
   - Rep → `/dashboard/rep`

### Route Protection
- Middleware checks auth cookies for dashboard routes
- Dashboard pages verify role and redirect if wrong
- AuthProvider manages auth state globally

## 🛡️ Row Level Security (RLS)

### Users Table
- Users can only read/update their own profile
- Profile creation handled by trigger on signup

### Rep Access Table
- Reps see only their own access records
- Companies see all access for their shop domain
- Only companies can manage rep access

### Product Sharing Permissions
- Reps see only their own permissions
- Companies see all permissions for their shop
- Only companies can grant/revoke permissions

## 🧪 Testing the Auth System

### Create Test Users

1. **Company User**:
   - Go to `/login`
   - Click "Sign up" 
   - Select "Store Owner/Company"
   - Fill out form with company details
   - Verify email and sign in

2. **Rep User**:
   - Go to `/login`
   - Click "Sign up"
   - Select "Sales Representative" 
   - Fill out form
   - Verify email and sign in

### Test Role-Based Access
- Try accessing wrong dashboard (should redirect)
- Sign out and sign in with different roles
- Verify middleware protects routes

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Apply database migrations
npx supabase db push

# Reset database (careful!)
npx supabase db reset

# View database in browser
npx supabase start
# Then visit http://localhost:54323

# Generate fresh database types
npx supabase gen types typescript --local > src/lib/database.types.ts
```

## 📋 Auth Features Implemented

✅ **User Registration** with role selection  
✅ **Email/Password Authentication**  
✅ **Role-based Route Protection**  
✅ **Automatic Dashboard Redirection**  
✅ **Row Level Security (RLS)**  
✅ **Auth Context Provider**  
✅ **Middleware Protection**  
✅ **Sign Out Functionality**  
✅ **Loading States**  
✅ **Error Handling**  

## 🚀 Next Steps

1. **Apply migrations** to your Supabase project
2. **Update environment variables** with your Supabase keys
3. **Test the authentication flow** with both user types
4. **Customize the UI** styling as needed
5. **Add invite system** for companies to invite reps
6. **Connect real data** to replace mock APIs

## 🔍 Troubleshooting

### "Cannot find module" errors
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Database type errors  
```bash
npx supabase gen types typescript --local > src/lib/database.types.ts
```

### Auth not working
1. Check environment variables are set correctly
2. Verify Supabase project URL and keys
3. Check browser console for errors
4. Ensure migrations have been applied

### Role redirects not working
1. Check middleware is running (`src/middleware.ts`)
2. Verify user profile has correct role in database
3. Clear browser cookies and try again 