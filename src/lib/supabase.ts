import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#F8FAFC">
      <div style="text-align:center;padding:2rem;max-width:420px">
        <p style="font-size:2rem">⚙️</p>
        <h2 style="color:#0F172A;margin:0 0 .5rem">Variáveis de ambiente ausentes</h2>
        <p style="color:#64748B;font-size:.9rem">Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no painel do Vercel e faça um novo deploy.</p>
      </div>
    </div>`
  throw new Error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão definidas.')
}

export const supabase = createClient(url, key)
