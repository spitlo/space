export default {
  build: {
    outDir: './docs',
  },
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
  }
}
