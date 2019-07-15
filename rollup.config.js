import babel from 'rollup-plugin-babel';

import pkg from './package.json';

export default [
  {
    input: 'src/i18n/main.js',
    output: { file: 'lib/i18n.js', format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel()]
  }
];