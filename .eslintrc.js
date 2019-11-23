module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'Game': 'readonly',
        'Memory': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        "semi": [
            "error",
            "always"
        ],
        "space-before-function-paren": ["error", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        "keyword-spacing": [
            "error", 
            {
                "after": true
            }
        ],
        "curly": [
            "error",
            "multi",
            "consistent"
        ],
        "brace-style": [
            "error",
            "allman",
            {
                "allowSingleLine": true 
            }
        ]
    }
};