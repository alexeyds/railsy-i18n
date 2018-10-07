module.exports = {
  "env": {
      "es6": true,
      "node": true
  },
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  }, 
  "extends": ["eslint:recommended"],
  "rules": {
      "indent": [
          "error",
          2, { "SwitchCase": 1 }
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "semi": [
          "error",
          "always"
      ]
  }
};