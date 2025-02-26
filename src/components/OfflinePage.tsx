import { getInitializationError } from '../lib/supabase'

export function OfflinePage() {
  const error = getInitializationError()
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Currently Offline
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Unable to connect to the database. Please check your connection and try again.
          </p>
          {error && (
            <p className="mt-4 text-sm text-red-600">
              Error details: {error.message}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
