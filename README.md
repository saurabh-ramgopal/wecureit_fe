This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# WeCureIT Frontend (Next.js)

This Next.js app uses the Firebase Web SDK for client authentication and talks to the Spring Boot backend which verifies tokens with Firebase Admin.

## Firebase setup (Frontend)

1) Create `.env.local` in `wecureit_fe` with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBOF42H98BborasAUfzl-UXC0blY56gHt4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wecureit.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wecureit
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wecureit.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=143760587855
NEXT_PUBLIC_FIREBASE_APP_ID=1:143760587855:web:45f6b45d2488d7f52ffe3a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Q5HE50ZTMB

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2) Install deps (firebase is already in `package.json`):

```bash
npm i
```

---

````markdown

#Project Folder struture
wecureit_fe/
└── src/
    ├── app/
    │   ├── (public)/                      # public pages (accessible without login)
    │   │   ├── home/
    │   │   │   └── page.tsx
    │   │   ├── login/
    │   │   │   ├── page.tsx
    │   │   │   └── layout.tsx
    │   │   ├── register/
    │   │   │   └── page.tsx
    │   │   └── layout.tsx                 # shared public layout
    │   │
    │   ├── (protected)/                   # all authenticated pages
    │   │   ├── admin/
    │   │   │   ├── dashboard/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── DoctorsTable.tsx
    │   │   │   │   ├── FacilitiesTable.tsx
    │   │   │   │   └── SpecialtiesTable.tsx
    │   │   │   └── layout.tsx
    │   │   │
    │   │   ├── doctor/
    │   │   │   ├── schedule/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── AvailabilityForm.tsx
    │   │   │   │   └── AppointmentsList.tsx
    │   │   │   ├── profile/
    │   │   │   │   └── page.tsx
    │   │   │   └── layout.tsx
    │   │   │
    │   │   ├── patient/
    │   │   │   ├── appointments/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── AppointmentCard.tsx
    │   │   │   │   └── AppointmentForm.tsx
    │   │   │   ├── history/
    │   │   │   │   └── page.tsx
    │   │   │   └── layout.tsx
    │   │
    │   │   ├── layout.tsx                 # layout for authenticated users
    │   │   └── page.tsx                   # optional dashboard redirect
    │   │
    │   ├── api/                           # Next.js API routes (if any serverless logic)
    │   └── globals.css
    │
    ├── components/                        # reusable UI components
    │   ├── common/                        # UI used by everyone
    │   │   ├── Button.tsx
    │   │   ├── InputBox.tsx
    │   │   ├── NavBar.tsx
    │   │   ├── Footer.tsx
    │   │   └── Loader.tsx
    │   │
    │   ├── auth/
    │   │   ├── LoginCard.tsx
    │   │   ├── RegisterCard.tsx
    │   │   └── ProtectedRoute.tsx
    │   │
    │   ├── patient/
    │   │   └── AppointmentSummary.tsx
    │   │
    │   ├── doctor/
    │   │   └── ScheduleCard.tsx
    │   │
    │   └── admin/
    │       └── FacilityForm.tsx
    │
    ├── context/                           # React context for auth, roles, etc.
    │   ├── AuthContext.tsx
    │   ├── RoleContext.tsx
    │   └── ThemeContext.tsx
    │
    ├── hooks/                             # custom React hooks
    │   ├── useAuth.ts
    │   ├── useFetch.ts
    │   ├── useRole.ts
    │   └── useAppointments.ts
    │
    ├── lib/                               # reusable logic, API clients
    │   ├── api/
    │   │   ├── axiosClient.ts
    │   │   ├── patientApi.ts
    │   │   ├── doctorApi.ts
    │   │   ├── adminApi.ts
    │   │   └── authApi.ts
    │   ├── utils/
    │   │   ├── formatDate.ts
    │   │   ├── handleError.ts
    │   │   ├── constants.ts
    │   │   └── validation.ts
    │   └── types/
    │       ├── doctor.ts
    │       ├── patient.ts
    │       ├── appointment.ts
    │       └── facility.ts
    │
    ├── styles/                            # global and module styles
    │   ├── globals.css
    │   ├── variables.css
    │   └── components/
    │       └── Button.module.css
    │
    └── middleware.ts                      # for route protection (Next.js)
