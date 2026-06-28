import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local manually
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(p => p.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
)

const url = env['NEXT_PUBLIC_SUPABASE_URL']
const anon = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!url || !anon) {
  console.error('❌ Missing env vars in .env.local')
  process.exit(1)
}

const supabase = createClient(url, anon)

console.log(`\n🔌 Testing connection to: ${url}\n`)

// Test 1: saas_entries
const { data: entries, error: entriesError } = await supabase
  .from('saas_entries')
  .select('id, nome, nicho')
  .limit(6)

if (entriesError) {
  console.error('❌ saas_entries:', entriesError.message)
} else {
  console.log(`✅ saas_entries — ${entries.length} rows`)
  entries.forEach(e => console.log(`   • ${e.nome} (${e.nicho})`))
}

// Test 2: profiles (will be empty until someone signs up)
const { data: profiles, error: profilesError } = await supabase
  .from('profiles')
  .select('id, email')
  .limit(5)

if (profilesError) {
  console.error('❌ profiles:', profilesError.message)
} else {
  console.log(`\n✅ profiles — ${profiles.length} rows`)
  if (profiles.length === 0) console.log('   (empty — expected before first signup)')
}

console.log('\n✓ Connection test complete\n')
