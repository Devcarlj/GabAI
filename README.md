
```
GabAI
├─ client
│  ├─ .dockerignore
│  ├─ @
│  │  ├─ components
│  │  │  └─ ui
│  │  │     └─ button.tsx
│  │  └─ lib
│  │     └─ utils.ts
│  ├─ components.json
│  ├─ Dockerfile
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ axiosInstance.ts
│  │  │  ├─ geocode.ts
│  │  │  └─ nearbyLgus.ts
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ ActiveTriageFeed.tsx
│  │  │  ├─ IncidentDetailCard.tsx
│  │  │  ├─ KPIMetricsGrid.tsx
│  │  │  ├─ Layouts
│  │  │  │  └─ DashboardShells.tsx
│  │  │  ├─ LGUdetailcard.tsx
│  │  │  ├─ MapViewSection.tsx
│  │  │  ├─ MobileSubmissionBar.tsx
│  │  │  ├─ NavbarHeader.tsx
│  │  │  ├─ ProtectedRoute.tsx
│  │  │  └─ SubmissionForm.tsx
│  │  ├─ context
│  │  │  ├─ AuthContext.ts
│  │  │  └─ AuthProvider.tsx
│  │  ├─ data
│  │  │  └─ mockTickets.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ Auth
│  │  │  │  ├─ ForgotPassword.tsx
│  │  │  │  ├─ Home.tsx
│  │  │  │  ├─ Login.tsx
│  │  │  │  ├─ Register.tsx
│  │  │  │  ├─ ResetPassword.tsx
│  │  │  │  ├─ VerifyEmail.tsx
│  │  │  │  └─ VerifyOtp.tsx
│  │  │  └─ Home.tsx
│  │  └─ types
│  │     └─ ticket.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ docker-compose.yml
├─ README.md
└─ server
   ├─ .dockerignore
   ├─ config
   │  ├─ connectDB.ts
   │  └─ sendEmail.ts
   ├─ controllers
   │  ├─ geocodeController.ts
   │  ├─ nearbyLguController.ts
   │  ├─ superAdminController.ts
   │  ├─ triageController.ts
   │  ├─ UploadImageController.ts
   │  └─ UserController.ts
   ├─ Dockerfile
   ├─ middleware
   │  ├─ auth.ts
   │  ├─ multer.ts
   │  ├─ rateLimiter.ts
   │  ├─ role.ts
   │  └─ superadmin.ts
   ├─ models
   │  ├─ EmailSettings.ts
   │  ├─ TicketModel.ts
   │  └─ User.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ geocode.route.ts
   │  ├─ superadmin.route.ts
   │  ├─ ticket.route.ts
   │  └─ user.route.ts
   ├─ scripts
   ├─ server.ts
   ├─ tsconfig.json
   ├─ types
   │  └─ ticket.ts
   └─ utils
      ├─ forgotPasswordTemplate.ts
      ├─ generatedAccessToken.ts
      ├─ generatedOtp.ts
      ├─ generatedRefreshToken.ts
      ├─ uploadImageCloudinary.ts
      └─ verifyEmailTemplate.ts

```