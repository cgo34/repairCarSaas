module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue'
  ],
  rules: {
    // Règles de base
    'selector-class-pattern': null,
    'no-empty-source': null,
    'string-quotes': 'single',
    
    // Règles SCSS
    'scss/dollar-variable-pattern': null,
    'scss/at-import-partial-extension': null,
    
    // Règles d'indentation
    'indentation': 2,
    
    // Règles de commentaires
    'comment-empty-line-before': null,
    
  }
}