module.exports = {
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    target: 'es5',
    noImplicitAny: true,
    moduleResolution: 'node',
    sourceMap: false,
    rootDir: 'src',
    outDir: 'build',
    baseUrl: '.',
    paths: {
      '*': ['node_modules/*', 'src/types/*'],
    },
  },
  include: ['src/**/*'],
};
