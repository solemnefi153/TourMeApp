/**
 * Copyright (c) 2019 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

import { IConfig } from '@hbo/piconfig';
import { Application } from 'express';
import { Globals } from './Globals';

/**
 * This should be run only once on startup initialize the token generator for hurley-authcheck
 * @param  {any} config
 * @param  {Application} app
 * @returns Promise
 */
export async function initializeTokenGenerator(
    config: IConfig,
    app: Application
): Promise<any> {
    const { Secrets, TokenGenerator, Authentication } = Globals.AuthCheck;

    const secret = await Secrets.create(
        [Secrets.keys.VAULT_TOKEN],
        Secrets.implementations.VAULT
    );
    const generator = new TokenGenerator(
        secret,
        Secrets.keys.VAULT_TOKEN,
        config.meta.env
    );
    return Authentication.initialize(app, generator);
}
