// Interactive micro-animations for practice cards

export function init() {
  initTerminalTyping()
  initTestRunner()
  initDiffHighlight()
  initModuleInteraction()
  initPipelineProgress()
  initMetricsLive()
}

/* ── 1. Agentic Coding: Terminal typing line by line ── */
function initTerminalTyping() {
  const body = document.querySelector('.mock-terminal-body')
  if (!body) return

  const lines = [
    { text: '<span class="t-prompt">$</span> <span class="t-cmd">claude --agent</span>', delay: 600 },
    { text: '<span class="t-success">⟳</span> <span class="t-file">Scanning repository...</span>', delay: 800 },
    { text: '<span class="t-success">✓</span> <span class="t-file">Analyzed 142 files</span>', delay: 700 },
    { text: '<span class="t-success">✓</span> <span class="t-file">Generated 12 test cases</span>', delay: 600 },
    { text: '<span class="t-success">✓</span> <span class="t-file">Refactored auth module</span>', delay: 700 },
    { text: '<span class="t-success">✓</span> <span class="t-file">Updated API documentation</span>', delay: 600 },
    { text: '<span class="t-success">✓</span> All checks passed — ready to ship', delay: 800 },
    { text: '<span class="t-prompt">$</span> <span class="t-cmd">git push origin main</span><span class="t-cursor"></span>', delay: 0 },
  ]

  function runSequence() {
    body.innerHTML = ''
    let totalDelay = 500

    lines.forEach((line, i) => {
      totalDelay += line.delay || 500
      setTimeout(() => {
        const div = document.createElement('div')
        div.innerHTML = line.text
        div.style.opacity = '0'
        div.style.transform = 'translateY(4px)'
        body.appendChild(div)

        requestAnimationFrame(() => {
          div.style.transition = 'opacity 0.3s, transform 0.3s'
          div.style.opacity = '1'
          div.style.transform = 'translateY(0)'
        })
      }, totalDelay)
    })

    // Loop after all lines are done
    setTimeout(runSequence, totalDelay + 4000)
  }

  runSequence()
}

/* ── 2. Test-Driven: Tests run one by one ── */
function initTestRunner() {
  const container = document.querySelector('.mock-tests')
  if (!container) return

  const tests = [
    { name: 'auth.login', time: '12ms', pass: true },
    { name: 'auth.signup', time: '8ms', pass: true },
    { name: 'api.users', time: '23ms', pass: true },
    { name: 'api.projects', time: '18ms', pass: true },
    { name: 'db.migrations', time: '45ms', pass: true },
    { name: 'auth.refresh', time: '15ms', pass: true },
    { name: 'api.webhooks', time: '31ms', pass: true },
  ]

  function runTests() {
    container.innerHTML = ''
    let delay = 300

    tests.forEach((test, i) => {
      delay += 400
      setTimeout(() => {
        const row = document.createElement('div')
        row.className = 'mock-test-row'
        row.style.opacity = '0'
        row.style.transform = 'translateX(-10px)'
        row.innerHTML = `
          <span class="mock-test-icon ${test.pass ? 'pass' : 'fail'}">${test.pass ? '✓' : '✗'}</span>
          <span class="mock-test-name">${test.name}</span>
          <span class="mock-test-time">${test.time}</span>
        `
        container.appendChild(row)

        requestAnimationFrame(() => {
          row.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
          row.style.opacity = '1'
          row.style.transform = 'translateX(0)'
        })

        // Only keep last 5 visible
        const rows = container.querySelectorAll('.mock-test-row')
        if (rows.length > 5) {
          const old = rows[0]
          old.style.transition = 'opacity 0.2s, transform 0.2s'
          old.style.opacity = '0'
          old.style.transform = 'translateX(10px)'
          setTimeout(() => old.remove(), 200)
        }
      }, delay)
    })

    setTimeout(runTests, delay + 3000)
  }

  runTests()
}

/* ── 3. Code Review: Lines appear sequentially with highlight ── */
function initDiffHighlight() {
  const body = document.querySelector('.mock-diff-body')
  if (!body) return

  const diffs = [
    [
      { num: '14', cls: 'neutral', text: '  const token = req.headers' },
      { num: '15', cls: 'remove', text: '- const user = decode(token)' },
      { num: '15', cls: 'add', text: '+ const user = await verify(token)' },
      { num: '16', cls: 'add', text: '+ if (!user) throw new AuthError()' },
      { num: '17', cls: 'neutral', text: '  req.user = user' },
      { num: '18', cls: 'neutral', text: '  next()' },
    ],
    [
      { num: '32', cls: 'neutral', text: '  async function fetchData() {' },
      { num: '33', cls: 'remove', text: '- const res = await fetch(url)' },
      { num: '33', cls: 'add', text: '+ const res = await retry(fetch, url)' },
      { num: '34', cls: 'add', text: '+ logger.info("fetched", { url })' },
      { num: '35', cls: 'neutral', text: '  return res.json()' },
      { num: '36', cls: 'neutral', text: '  }' },
    ],
    [
      { num: '7', cls: 'neutral', text: '  export const config = {' },
      { num: '8', cls: 'remove', text: '-   timeout: 5000,' },
      { num: '8', cls: 'add', text: '+   timeout: env.TIMEOUT ?? 5000,' },
      { num: '9', cls: 'remove', text: '-   retries: 3,' },
      { num: '9', cls: 'add', text: '+   retries: env.RETRIES ?? 3,' },
      { num: '10', cls: 'neutral', text: '  }' },
    ],
  ]

  let diffIdx = 0

  function showDiff() {
    const lines = diffs[diffIdx % diffs.length]
    body.innerHTML = ''

    lines.forEach((line, i) => {
      setTimeout(() => {
        const div = document.createElement('div')
        div.className = `diff-line ${line.cls}`
        div.innerHTML = `<span class="diff-num">${line.num}</span>${line.text}`
        div.style.opacity = '0'
        div.style.transform = 'translateY(3px)'
        body.appendChild(div)

        requestAnimationFrame(() => {
          div.style.transition = 'opacity 0.25s, transform 0.25s'
          div.style.opacity = '1'
          div.style.transform = 'translateY(0)'
        })

        // Flash highlight on add/remove
        if (line.cls === 'add' || line.cls === 'remove') {
          div.style.background = line.cls === 'add'
            ? 'rgba(16, 185, 129, 0.08)'
            : 'rgba(239, 68, 68, 0.08)'
          setTimeout(() => { div.style.transition = 'background 1s'; div.style.background = 'transparent' }, 600)
        }
      }, i * 200)
    })

    diffIdx++
    setTimeout(showDiff, lines.length * 200 + 4000)
  }

  showDiff()
}

/* ── 4. Modular: Modules light up in sequence ── */
function initModuleInteraction() {
  const modules = document.querySelectorAll('.mock-module')
  if (!modules.length) return

  // Remove static active classes
  modules.forEach(m => m.classList.remove('active'))

  let activeIdx = 0

  function pulse() {
    modules.forEach(m => m.classList.remove('active'))

    // Light up 2-3 connected modules
    const count = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < count; i++) {
      const idx = (activeIdx + i) % modules.length
      modules[idx].classList.add('active')
    }

    activeIdx = (activeIdx + count) % modules.length
  }

  setInterval(pulse, 1800)
  pulse()
}

/* ── 5. CI/CD: Pipeline progresses step by step ── */
function initPipelineProgress() {
  const stages = document.querySelectorAll('.mock-stage')
  const lines = document.querySelectorAll('.mock-stage-line')
  if (!stages.length) return

  let step = 0

  function reset() {
    stages.forEach(s => { s.classList.remove('done', 'running') })
    lines.forEach(l => l.classList.remove('done'))
    step = 0
  }

  function advance() {
    if (step >= stages.length) {
      // All done — hold, then restart
      setTimeout(() => { reset(); advance() }, 2500)
      return
    }

    // Previous stage becomes done
    if (step > 0) {
      stages[step - 1].classList.remove('running')
      stages[step - 1].classList.add('done')
      stages[step - 1].querySelector('.mock-stage-dot').textContent = '✓'
      if (lines[step - 1]) lines[step - 1].classList.add('done')
    }

    // Current stage is running
    stages[step].classList.add('running')
    stages[step].querySelector('.mock-stage-dot').textContent = '⟳'

    step++
    setTimeout(advance, 1200)
  }

  reset()
  setTimeout(advance, 800)
}

/* ── 6. Observability: Metrics update randomly ── */
function initMetricsLive() {
  const fills = document.querySelectorAll('.mock-metric-fill')
  const vals = document.querySelectorAll('.mock-metric-val')
  if (!fills.length) return

  const baseValues = [82, 65, 99.9, 12]
  const suffixes = ['%', '%', '%', 'ms']

  function update() {
    fills.forEach((fill, i) => {
      const jitter = (Math.random() - 0.5) * 15
      let val = baseValues[i] + jitter
      if (i === 2) val = Math.min(100, Math.max(98, val)) // uptime stays high
      if (i === 3) val = Math.max(5, Math.min(30, val))   // latency range

      const pct = i === 3 ? (val / 50) * 100 : val
      fill.style.transition = 'width 0.8s ease'
      fill.style.width = Math.min(100, pct) + '%'

      if (vals[i]) {
        vals[i].textContent = (i === 2 ? val.toFixed(1) : Math.round(val)) + suffixes[i]
      }
    })
  }

  setInterval(update, 2000)
  update()
}
