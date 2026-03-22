process.chdir(__dirname)
async function start() {
  const { createServer } = await import('vite')
  const server = await createServer({
    root: __dirname,
    server: { port: 5173 }
  })
  await server.listen()
  server.printUrls()
}
start()
