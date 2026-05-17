import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variáveis SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias no .env')
}

// Cliente admin: service role key, sem sessão de usuário — bypassa RLS
// Usado para todas as operações de banco de dados
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Cria um cliente limpo para autenticar o usuário via signInWithPassword.
// Precisa ser uma instância separada para não contaminar o supabaseAdmin
// com a sessão do usuário (o que faria o RLS ser aplicado nas queries seguintes).
export function createAuthClient() {
  return createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
