module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'Game': 'readonly',
        'Memory': 'readonly',
        'FIND_SOURCES': 'readonly',
        'ERR_NOT_IN_RANGE': 'readonly',
        'RESOURCE_ENERGY': 'readonly',
        'WORK': 'readonly',
        'CARRY': 'readonly',
        'MOVE': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 6,
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