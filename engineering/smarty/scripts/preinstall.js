if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn('pnpm is needed')
  process.exit(1)
}