module.exports = {
  "presets": [
    [ 
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ['ie >= 11']
        },
        "loose": true
      }
    ]
  ],

  "plugins": [
    [
      "module-resolver",
      {
        "root": [
          "./src"
        ],
        "alias": {
          "test": "./test"
        }
      }
    ]
  ]
}