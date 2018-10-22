require('now-env')

module.exports = {
  "presets": ["next/babel"],
  "plugins": [
    "transform-flow-strip-types",
    [
      "styled-components", 
      {
        "ssr": true, 
        "displayName": true, 
        "preprocess": false 
      }
    ]
  ]
}