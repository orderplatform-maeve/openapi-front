import reactEsLint from '@torder/eslint-config-9/react.eslint.config.js'

export default [
    ...reactEsLint,
    {
        rules: {
            /**
             * off only-export-components for Next.js
             */
            "react-refresh/only-export-components": "off",
        }
    }
];
