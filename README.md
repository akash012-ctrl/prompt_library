# Prompt Library

A full-featured web application for creating, storing, and managing AI prompts. Built with Next.js, TypeScript, Mantine UI, and Tailwind CSS.

![Prompt Library Screenshot](public/screenshot.png) <!-- You may want to add an actual screenshot image later -->

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **UI Libraries**: Mantine UI v7 for component library, Tailwind CSS for styling
- **State Management**: React Hooks for local state
- **Authentication**: JWT-based authentication
- **HTTP Client**: Axios for API requests
- **Icons**: Tabler Icons and Heroicons
- **Form Handling**: Mantine Form
- **Notifications**: Mantine Notifications for toast messages

## Features

- **User Authentication**: Registration, login, and logout functionality
- **CRUD Operations**: Create, read, update, and delete prompts
- **Search Functionality**: Search prompts by title or tags
- **Responsive Design**: Mobile-first approach using Mantine UI components
- **Form Validation**: Client-side validation with proper error handling
- **Authorization**: Protected routes and component-level access control

## Project Structure

```
/prompt_library-frontend/
├── app/                       # Next.js App Router directory
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication related components
│   │   └── prompts/           # Prompt management components
│   ├── lib/                   # Utility functions and API services
│   ├── prompts/               # Prompt-related pages
│   │   ├── [id]/              # View specific prompt
│   │   ├── edit/[id]/         # Edit specific prompt
│   │   └── new/               # Create new prompt
│   ├── globals.css            # Global CSS styles
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Main application page (home)
├── public/                    # Static assets
├── .env.sample                # Environment variables template
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Project dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Core Components

### Authentication System

The authentication system is implemented in `app/lib/auth.ts` and `app/components/auth/AuthForm.tsx`. It provides:

- **JWT-based Authentication**: The system stores JWT tokens in local storage
- **Login/Registration Forms**: UI components for user authentication
- **Token Management**: Functions to handle JWT tokens (storage, retrieval, and decoding)
- **Authorization Headers**: Helper functions to add auth headers to API requests

### Prompt Management

The prompt system consists of several components:

- **Prompt List** (`app/components/prompts/PromptList.tsx`): Displays all prompts with search functionality
- **Prompt Card** (`app/components/prompts/PromptCard.tsx`): Card component to display individual prompts
- **Prompt Form** (`app/components/prompts/PromptForm.tsx`): Form for creating and editing prompts
- **Prompt API Service** (`app/lib/prompts.ts`): API service for CRUD operations on prompts

### Route Structure

- **/** - Home page with authentication form or prompt list
- **/prompts/[id]** - View a specific prompt
- **/prompts/new** - Create a new prompt
- **/prompts/edit/[id]** - Edit an existing prompt

## API Integration

The application integrates with a RESTful API:

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate a user
- `POST /auth/update-password` - Update user password
- `POST /auth/forgot-password` - Initiate password reset
- `POST /auth/reset-password/:token` - Complete password reset

### Prompt Endpoints

- `GET /prompts` - Fetch all prompts
- `GET /prompts/:id` - Fetch a specific prompt
- `POST /prompts` - Create a new prompt (requires auth)
- `PUT /prompts/:id` - Update a prompt (requires auth)
- `DELETE /prompts/:id` - Delete a prompt (requires auth)
- `GET /prompts/search?query=` - Search prompts

## Key Technical Implementation Details

### Authentication Flow

1. User submits credentials via `AuthForm.tsx`
2. Credentials are sent to API using `auth.ts` service
3. On successful authentication, JWT token is stored in localStorage
4. UI updates to show the authenticated state
5. Subsequent requests include the JWT token in Authorization header

### Prompt CRUD Operations

- **Create**: `PromptForm.tsx` collects data, `prompts.ts` sends POST request
- **Read**: `PromptList.tsx` & `PromptCard.tsx` display data from GET requests
- **Update**: Pre-populated `PromptForm.tsx` sends PUT requests via `prompts.ts`
- **Delete**: Confirmation dialog triggers DELETE request via `prompts.ts`

### Form Handling

- Forms use controlled components with React state
- Client-side validation before submission
- Server error messages are displayed to the user
- Loading states during async operations

### User Experience Features

- **Debounced Search**: Search requests are debounced to improve performance
- **Notifications**: Toast notifications for user feedback on actions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach using Mantine UI components

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/prompt-library.git
   cd prompt-library
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Copy `.env.sample` to `.env.local` and update with your API endpoint:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Run the development server with Turbopack:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development Guidelines

### Component Structure

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props and state

### State Management

- Local component state with useState for simple state
- Context API for shared state when needed
- Avoid prop drilling by structuring components appropriately

### API Communication

- Use the service layer in `app/lib` for all API calls
- Handle loading states and errors consistently
- Use TypeScript interfaces for API responses

### Styling Approach

- Use Mantine components as the primary UI building blocks
- Use Tailwind utility classes for custom styling needs
- Keep global styles minimal
- Use CSS variables for theming

## Contributing

We welcome contributions to the Prompt Library! Here's how you can contribute:

### Setting Up the Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/prompt-library.git
   cd prompt-library
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes and commit them:
   ```bash
   git commit -m "Add your descriptive commit message"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request from your fork to the main repository

### Contribution Guidelines

- **Code Style**: Follow the existing code style and formatting
- **TypeScript**: Use proper TypeScript types for all new code
- **Testing**: Add tests for new features when possible
- **Documentation**: Update documentation for any changes to the API or features
- **Commit Messages**: Use clear, descriptive commit messages
- **Pull Requests**: Keep PRs focused on a single feature or bug fix

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Mantine UI](https://mantine.dev/) - UI component library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Tabler Icons](https://tabler-icons.io/) - SVG icons library
