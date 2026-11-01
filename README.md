# LiFE Gujarat
### A Digital Platform for Sustainable Living and Citizen Engagement

**Live Application:** https://lifegujrat123.vercel.app/  
**GitHub Repository:** https://github.com/PtlNeel113/Life-Gujarat

---

## 1. Overview

LiFE Gujarat is a digital citizen-engagement platform designed to encourage sustainable lifestyles by making environmentally responsible actions easier to understand, adopt, track, and improve.

Inspired by the Government of India's **Mission LiFE (Lifestyle for Environment)** initiative, the platform aims to bridge the gap between environmental awareness and everyday action.

The platform provides a digital environment where individuals can explore sustainable practices, monitor their progress, understand their environmental impact, and participate in collective action.

Its objective is to make sustainability measurable, accessible, and actionable.

## 2. Problem Statement

Environmental sustainability requires consistent participation from individuals and communities. However, several challenges prevent people from translating environmental awareness into everyday behaviour:

- Limited awareness of practical sustainable lifestyle choices.
- Difficulty tracking individual environmental contributions.
- Lack of a centralized digital platform for sustainability engagement.
- Limited visibility into the impact of everyday activities.
- Difficulty maintaining long-term participation in environmental initiatives.

The challenge is not simply spreading awareness. It is converting awareness into consistent, measurable action.

## 3. Our Solution

LiFE Gujarat addresses these challenges through a unified digital platform that connects environmental awareness with citizen participation.

The platform provides an organized experience for exploring sustainability initiatives, engaging with environmental activities, tracking progress, and understanding individual contributions.

## 4. Key Features

### 4.1 Citizen Dashboard
- Centralized overview of sustainability activities.
- Personalized user experience.
- Progress and participation summaries.
- Quick access to platform features.

### 4.2 Sustainable Lifestyle Activities
- Explore environmentally responsible activities.
- Encourage practical everyday sustainability habits.
- Organize activities into accessible categories.
- Support consistent citizen engagement.

### 4.3 Environmental Impact Tracking
- Present environmental contribution information.
- Visualize available sustainability metrics.
- Help users understand their progress.
- Provide an organized view of recorded activities.

### 4.4 Activity and Progress Management
- Track user participation.
- Display activity history and progress.
- Encourage continued engagement.
- Organize sustainability-related information.

### 4.5 Analytics and Visualizations
- Present environmental information through charts.
- Provide visual summaries of recorded data.
- Make sustainability information easier to interpret.

### 4.6 Impact Reports
- Generate structured environmental impact reports.
- Support PDF report export.
- Present recorded information in an organized format.

### 4.7 Multilingual Accessibility
- Language options for English, Hindi, and Gujarati, where implemented.

### 4.8 Responsive User Interface
- Responsive layouts for desktop, tablet, and mobile.
- Consistent navigation and user experience.
- Clearly structured interface components.

*Feature descriptions should reflect functionality actually implemented in the submitted build.*

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js |
| Programming Language | TypeScript |
| UI Development | React |
| Styling | CSS / Tailwind CSS |
| Backend Services | Firebase, where integrated |
| Database | Cloud Firestore, where integrated |
| Data Visualization | Existing chart components |
| PDF Generation | Existing PDF export implementation |
| Deployment | Vercel |
| Package Manager | npm |
| Version Control | Git and GitHub |

## 6. System Architecture

```text
                 USER
                   |
                   v
          Next.js Application
                   |
          React UI Components
                   |
          Application Logic
                   |
          +--------+---------+
          |                  |
          v                  v
     Firebase Services   Data Processing
          |                  |
          v                  v
     Firestore Data     Impact Calculations
          |                  |
          +--------+---------+
                   |
                   v
          Dashboard and Reports
                   |
                   v
             User Interface
```

The architecture is designed to support maintainability, modular development, and future feature expansion.

## 7. Application Workflow

1. A user accesses the LiFE Gujarat platform.
2. The user enters through the available authentication flow.
3. The application provides access to the citizen dashboard.
4. The user explores sustainability activities and available platform features.
5. User interactions and activity information are processed by the application.
6. Available environmental metrics are presented through the dashboard and visualizations.
7. The user can review progress and generate supported reports.

## 8. Project Structure

```text
Life-Gujarat/
│
├── app/
│   └── Application routes and pages
│
├── components/
│   └── Reusable and feature-specific UI components
│
├── lib/
│   └── Application utilities and integrations
│
├── public/
│   └── Static assets
│
├── scripts/
│   └── Project scripts
│
├── .env.example
├── package.json
├── package-lock.json
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## 9. Installation and Setup

### Prerequisites

- Node.js (compatible with the project's Next.js version)
- npm
- Git
- Firebase project credentials, if Firebase services are enabled

### Step 1: Clone the Repository

```bash
git clone https://github.com/PtlNeel113/Life-Gujarat.git

cd Life-Gujarat
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root.

Use `.env.example` as a reference and configure the required Firebase credentials and any external service variables used by the application.

Never commit private API keys, service-account credentials, or production secrets.

### Step 4: Start the Development Server

```bash
npm run dev
```

### Step 5: Open the Application

Visit:

```text
http://localhost:3000
```

### Step 6: Create a Production Build

```bash
npm run build
```

### Step 7: Run the Production Server

```bash
npm start
```

## 10. Deployment

The application is deployed using Vercel.

**Live Application:** https://lifegujrat123.vercel.app/

Deployment workflow:

1. Push the latest committed changes to GitHub.
2. Connect the repository to Vercel.
3. Configure the required environment variables.
4. Ensure Vercel uses npm and the committed `package-lock.json`.
5. Deploy the application.
6. Verify the deployed routes and application functionality.

## 11. Security and Reliability

The project aims to follow practical application security principles:

- Keep sensitive credentials in environment variables.
- Avoid exposing private service credentials in frontend code.
- Apply appropriate database security rules.
- Validate user inputs.
- Handle application errors gracefully.
- Keep dependencies and deployment configuration consistent.

## 12. Innovation and Impact

LiFE Gujarat focuses on making sustainable living more practical through digital participation and progress visibility.

Its intended value includes:

- Encouraging environmentally responsible daily habits.
- Improving awareness through accessible digital information.
- Making individual participation easier to track.
- Presenting environmental contributions in an understandable format.
- Supporting broader citizen engagement in sustainability initiatives.

## 13. Limitations and Future Scope

### Current Scope

The current implementation focuses on functionality available in the deployed application. Environmental calculations and reports depend on the data and calculation logic actually integrated into the system.

### Future Enhancements

- Integration with verified environmental datasets and government initiatives.
- Improved environmental impact calculation methodologies.
- Community-level participation and engagement.
- Additional sustainability challenges and campaigns.
- Enhanced analytics and reporting.
- Improved accessibility and multilingual support.
- Integration with relevant public sustainability programs.

## 14. Development and Compliance

The project is developed for the sprint and follows the applicable participation requirements.

- Core implementation and project-specific logic are developed during the permitted sprint.
- Third-party libraries and development tools are used where permitted.
- The team is prepared to explain its implementation decisions, technical approach, and known limitations.

All project-specific claims should be supported by the actual implementation and development history.

## 15. Evaluation Readiness

| Evaluation Area | Demonstration Focus |
|---|---|
| Technical Execution | Application functionality and implementation |
| Architecture | Modular structure and backend integration |
| Scalability | Separation of components and services |
| UI/UX | Navigation, accessibility, and responsiveness |
| Innovation | Digital citizen engagement for sustainable living |
| Problem Fit | Connection to Mission LiFE objectives |

## 16. Team

**Project:** LiFE Gujarat

**Repository:** https://github.com/PtlNeel113/Life-Gujarat

**Live Deployment:** https://lifegujrat123.vercel.app/

**Team Name:** INFINITE HACKERS

**Team Members:** 1) NEEL PATEL ( LEADER )
                  2) NIRAJ SHARMA
                  3) KAIVAL SOLANKI

---

## Conclusion

LiFE Gujarat aims to turn environmental awareness into meaningful citizen participation.

By bringing sustainability activities, progress tracking, environmental information, and digital engagement into one platform, the project seeks to make responsible living more accessible and measurable.

**Our vision is simple: Make sustainable living an everyday action, not just an awareness message.**
