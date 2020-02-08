module.exports = {
  presets: [<% if (props.typescript) { %>
    '@babel/preset-typescript',<% } if (props.react) { %>
    '@babel/preset-react',<% } %>
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        targets: {
          browsers: [
            '> 1%',
            'Android >= 4.4',
            'IOS >= 7',
            'ie >= 10'
          ]
        }
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        regenerator: true
      }
    ],
    'add-module-exports',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],<% if (props.react) { %>
    '@babel/plugin-transform-react-display-name',<% } %>
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        proposal: 'minimal'
      }
    ],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-function-bind'
  ]
};
