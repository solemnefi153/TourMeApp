/*
 * Copyright (c) 2021 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */
module.exports = {
    extends: ['./node_modules/@hbo/hurley-tsconfigs/recommended.eslintrc.json'],
    parserOptions: {
        tsconfigRootDir: __dirname,
    },
    rules: {
        'node/no-missing-require': [
            'error',
            {
                tryExtensions: ['.js', '.json', '.ts'],
            },
        ],

        '@typescript-eslint/no-parameter-properties': 'off',
    },
};
