# Laura Assistant Intent Recognition

This is an experimental application for intent recognition for the Laura Assistant using TensorFlow.js and the Universal Sentence Encoder.

## Features

- Real-time intent detection using TensorFlow.js
- Chat interface for interacting with the assistant
- Fallback to rule-based intent matching when TensorFlow is not available
- Debug information for intent detection

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the experiment directory:
   ```bash
   cd experiments/laura
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

```bash
npm run dev
```

The application will start on port 5174 and can be accessed at http://localhost:5174

## Development

### Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
laura/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   ├── services/      # Services (TensorFlow, etc.)
│   ├── styles/        # CSS styles
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── main.tsx       # Application entry point
├── .eslintrc.cjs      # ESLint configuration
├── .prettierrc        # Prettier configuration
├── index.html         # HTML entry point
├── package.json       # Dependencies and scripts
├── postcss.config.js  # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## Technologies

- React
- TypeScript
- Vite
- TensorFlow.js
- Universal Sentence Encoder
- Tailwind CSS
