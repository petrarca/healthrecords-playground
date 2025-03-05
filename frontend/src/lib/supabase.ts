import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null
let initializationError: Error | null = null

export function isInitialized() {
  return client !== null
}

export function getInitializationError() {
  return initializationError
}

export async function initializeSupabase() {
  // If already initialized, return existing client
  if (client) return client

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    client = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test the connection
    const { data, error, status } = await client.from('versions').select().limit(1)
    if (error) {
      throw new Error(`Failed to connect to Supabase: ${error.message}`)
    }
    if (status !== 200) {
      throw new Error(`Failed to connect to Supabase: Status ${status}`)
    }

    console.debug('Supabase connection successful:', { status, data})
    
    initializationError = null
    return client
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error('Failed to initialize Supabase')
    client = null
    throw initializationError
  }
}

export function getClient() {
  if (!client) {
    throw new Error('Supabase client has not been initialized or initialization failed. Check initialization status first.')
  }
  return client
}
