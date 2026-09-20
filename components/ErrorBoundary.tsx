// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

// Correctly define the generic types for Props and State
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // Fix: Removed unnecessary generic type definitions after 'Component'
  // The constructor accepts props, and we initialize the state.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // Static method signature is correct.
  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  
  // You can optionally implement componentDidCatch for logging errors:
  // componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
  //   console.error("Uncaught error:", error, errorInfo);
  // }

  render() {
    if (this.state.hasError) {
      return (
        // --- DESIGN CHANGE 1: Dark background and minimal padding ---
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
          <div 
            // --- DESIGN CHANGE 2: Dark card styling with Amber accent ---
            className="text-center p-8 rounded-xl shadow-2xl bg-gray-800 border border-amber-800"
          >
            {/* --- DESIGN CHANGE 3: Light text and Amber header icon --- */}
            <h1 className="text-5xl font-extrabold mb-4 text-amber-500">
              Oops!
            </h1>
            <p className="text-xl text-gray-100 mb-6">
              Something went wrong on our end.
            </p>
            <button
              onClick={() => window.location.reload()}
              // Use the amber button style established in Login/Register
              className="bg-amber-600 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-500 transition shadow-lg shadow-amber-500/30"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}