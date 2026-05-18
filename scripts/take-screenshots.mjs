/**
 * Vekta — Screenshots Automáticas
 *
 * Tira prints de cada painel logado e faz commit/push automático.
 * Pré-requisito: frontend (porta 5173) e backend (porta 3001) rodando.
 *
 * Uso:
 *   node scripts/take-screenshots.mjs
 */

import puppeteer from 'puppeteer'
import { execSync } from 'child_process'
import { mkdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const ROOT        = path.join(__dirname, '..')
const OUT_DIR     = path.join(ROOT, 'docs', 'screenshots')
const BASE_URL      = 'http://localhost:5173'
const DEMO_PASSWORD = 'Demo@2025#'
const VIEWPORT      = { width: 1440, height: 900 }

const PROFILES = [
  {
    label:         'Aluno',
    email:         'lucas@escola.vekta.app',
    password:      DEMO_PASSWORD,
    file:          'student-dashboard.png',
    dashboardPath: '/student',
  },
  {
    label:         'Professor',
    email:         'ana.lima@escola.vekta.app',
    password:      DEMO_PASSWORD,
    file:          'teacher-dashboard.png',
    dashboardPath: '/teacher',
  },
  {
    label:         'Coordenador',
    email:         'carlos@escola.vekta.app',
    password:      DEMO_PASSWORD,
    file:          'coordinator-dashboard.png',
    dashboardPath: '/coordinator',
  },
  {
    label:         'Responsável',
    email:         'fernanda.mendes@gmail.com',
    password:      DEMO_PASSWORD,
    file:          'guardian-dashboard.png',
    dashboardPath: '/guardian',
  },
  {
    label:         'Admin',
    email:         'admin@vekta.app',
    password:      'Vekta@2025#Admin',
    file:          'admin-dashboard.png',
    dashboardPath: '/admin',
  },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

async function isFrontendRunning() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) })
    return res.status < 500
  } catch {
    return false
  }
}

async function waitForDashboard(page, dashboardPath, timeoutMs = 25000) {
  await page.waitForFunction(
    (expected) => window.location.pathname.startsWith(expected),
    { timeout: timeoutMs },
    dashboardPath,
  )
}

async function waitForDataLoaded(page) {
  // Aguarda todos os spinners (animate-spin) desaparecerem
  await page
    .waitForFunction(
      () => document.querySelectorAll('.animate-spin').length === 0,
      { timeout: 15000 },
    )
    .catch(() => { /* pode não haver spinner */ })

  // Tempo extra para gráficos e animações CSS finalizarem
  await new Promise(r => setTimeout(r, 2500))
}

// ─── screenshot por perfil ─────────────────────────────────────────────────

async function screenshotProfile(browser, profile) {
  // Contexto isolado por perfil — sem cookies ou localStorage compartilhados
  const context = await browser.createBrowserContext()
  const page    = await context.newPage()

  try {
    await page.setViewport(VIEWPORT)

    // 1. Abre a página de login
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 })

    // 2. Preenche e-mail
    await page.waitForSelector('input[type="email"]', { timeout: 10000 })
    await page.click('input[type="email"]', { clickCount: 3 })
    await page.keyboard.type(profile.email, { delay: 35 })

    // 3. Preenche senha
    await page.waitForSelector('input[type="password"]')
    await page.click('input[type="password"]', { clickCount: 3 })
    await page.keyboard.type(profile.password, { delay: 35 })

    // 4. Clica no botão de entrar (btn-primary w-full) e aguarda dashboard
    await Promise.all([
      waitForDashboard(page, profile.dashboardPath),
      page.click('button.btn-primary.w-full'),
    ])

    // 5. Aguarda dados carregarem
    await waitForDataLoaded(page)

    // 6. Captura o screenshot
    const filePath = path.join(OUT_DIR, profile.file)
    await page.screenshot({ path: filePath, fullPage: false })

    return { ok: true }
  } catch (err) {
    // Salva um print de erro para facilitar o diagnóstico
    try {
      await page.screenshot({
        path: path.join(OUT_DIR, `ERROR_${profile.file}`),
        fullPage: false,
      })
    } catch { /* ignora */ }
    return { ok: false, error: err.message }
  } finally {
    await context.close()
  }
}

// ─── git ──────────────────────────────────────────────────────────────────────

function gitCommitAndPush() {
  const opts = { cwd: ROOT, stdio: 'pipe' }

  // Verifica se há algo a commitar
  const status = execSync('git status --porcelain docs/screenshots/', opts).toString().trim()
  if (!status) {
    console.log('ℹ️  Nenhuma alteração detectada em docs/screenshots/ — commit ignorado.')
    return
  }

  execSync('git add docs/screenshots/', opts)
  execSync(
    'git commit -m "docs: adiciona screenshots reais dos dashboards"',
    opts,
  )
  execSync('git push origin main', { cwd: ROOT, stdio: 'inherit' })
  console.log('\n🚀 Screenshots publicadas no GitHub!')
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🖼️   Vekta — Screenshots Automáticas')
  console.log(`📐  Resolução: ${VIEWPORT.width}×${VIEWPORT.height}`)
  console.log(`📁  Destino:   ${OUT_DIR}\n`)

  // Verifica frontend
  if (!(await isFrontendRunning())) {
    console.error('❌  Frontend não está acessível em http://localhost:5173')
    console.error('    Inicie com: npm run dev\n')
    process.exit(1)
  }

  // Garante diretório de saída
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  })

  const results = []

  for (const profile of PROFILES) {
    process.stdout.write(`📸  ${profile.label.padEnd(14)} `)
    const result = await screenshotProfile(browser, profile)
    if (result.ok) {
      console.log(`✅  ${profile.file}`)
    } else {
      console.log(`❌  falhou — ${result.error}`)
    }
    results.push({ ...profile, ...result })
  }

  await browser.close()

  const failed  = results.filter(r => !r.ok)
  const success = results.filter(r =>  r.ok)

  console.log(`\n📊  Resultado: ${success.length}/${PROFILES.length} screenshots capturados`)

  if (failed.length > 0) {
    console.warn('⚠️   Falhas:')
    failed.forEach(r => console.warn(`     • ${r.file}: ${r.error}`))
  }

  if (success.length === 0) {
    console.error('\n❌  Nenhum screenshot gerado. Abortando commit.\n')
    process.exit(1)
  }

  // Commit e push
  console.log('\n📦  Fazendo commit e push...\n')
  try {
    gitCommitAndPush()
  } catch (err) {
    console.error('⚠️   git falhou:', err.message)
    console.error('    Faça o commit manualmente: git add docs/screenshots/ && git commit && git push')
  }

  if (failed.length > 0) process.exit(1)
}

main().catch(err => {
  console.error('\n💥  Erro fatal:', err.message)
  process.exit(1)
})
