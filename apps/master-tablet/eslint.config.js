import reactEsLint from "@torder/eslint-config-9/react.eslint.config.js"

export default [
    ...reactEsLint,
    {
        rules: {
            'react/prop-types': 'off',  // PropTypes 검사 비활성화
        }
    }
];
