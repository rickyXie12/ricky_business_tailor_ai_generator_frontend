# Social Media Content Generator - Frontend

This is the frontend for the Social Media Content Generator, a system that can generate 10-100 Instagram posts simultaneously using AI.

This is a Next.js project bootstrapped with `create-next-app`.

## Tech Stack

- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript
- **UI**: shadcn/ui
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **State Management**: Zustand
- **Form Handling**: React Hook Form & Zod

## Features Implemented

- User Authentication flow (Login)
- Campaign Management (Create and List Campaigns)
- Batch Content Generation Interface (1 to 100+ posts)
- Real-time Batch Progress Tracking via API polling
- Responsive UI built entirely with `shadcn/ui` components.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, pnpm, or bun
- A running instance of the backend service.

### Installation and Running

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
