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

import * as Secret from '@hbo/hurley-secret';
import { IConfig } from '@hbo/piconfig';
import { Globals, IGlobals } from '../Globals';
import { ILogger } from '@hbo/hurley-api-logging';

const { Config, LoggerFactory }: IGlobals = Globals;
const config: IConfig = Config.getConfig();
const { vaultConfig }: IConfig = config;
const logger: ILogger = LoggerFactory.getLogger('extractSecret');

const secretInstance = Secret.using({
    Logger: LoggerFactory,
});
const currentEnvironment: string = config.meta.env;
// tslint:disable-next-line:hbo-secrets
export const defaultBasePath: string = `secret/hurley/chameleon/${currentEnvironment}`;

/**
 * given a file name and the version of the secret
 * extracts the secret from vault
 * @param {string} secretBasePath - base path of the secret, before version and file name
 * @param {string} secretFileName - secret name
 * @param {number} secretVersion -  secret version (optional)
 */
export async function loadSecretWithVersionFile<T>(
    secretBasePath: string,
    secretFileName: string,
    secretVersion?: number
): Promise<T> {
    const path = `${secretBasePath}/${secretFileName}${
        secretVersion ? '/v' + secretVersion : ''
    }`;
    try {
        const resolvedInstance = await secretInstance.createVaultSecretStorageInstance(
            vaultConfig
        );
        const secret = await resolvedInstance.getItemWithRetry({
            item: path,
            ttl: 5000,
        });
        return secret.data;
    } catch (e) {
        logger.error({
            error: e,
            event: 'unableToRetrieveSecret',
            path,
        });
        throw e;
    }
}
