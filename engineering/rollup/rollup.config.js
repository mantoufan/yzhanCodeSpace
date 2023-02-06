import { terser } from 'rollup-plugin-terser'
export default {
  input: './src/index.js',
  output: [
    {
      file: './dist/es.min.js',
      format: 'es'
    }
  ],
  plugins: [terser()]
}