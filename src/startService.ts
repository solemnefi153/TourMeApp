/**
 * Copyright (c) 2021 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

//import { CredentialsSchema } from '@hbo/hurley-credentials-data-model';
import { addCORSHeader } from '@hbo/hurley-http';
import { HurleyService } from '@hbo/hurley-loader';
import {
    IDatabaseCredentialsConfig,
    initPostgresClient,
    IPostgresInitConfig,
} from '@hbo/hurley-postgres';
import * as events from 'events';
import { Application } from 'express';
import * as path from 'path';
import { initializeTokenGenerator } from './authentication';
import * as compression from 'compression';
import * as http from 'http';

import { Globals } from './Globals';
import { loadSecretWithVersionFile } from './util/extractSecret';

const { serviceName, Config, LoggerFactory, metrics } = Globals;

// 6 is the default level, but explicitly set it https://github.com/expressjs/compression#level
const COMPRESSION_LEVEL: number = 6;
const LOGGER_NAME: string = 'loader';

export async function startService(): Promise<http.Server> {
    const config = Config.getConfig();
    const addCORS = addCORSHeader(config.accessControlMaxAge);

    const postgresSecrets: Record<
        string,
        string
    > = await loadSecretWithVersionFile(
        config.aws.postgres.vaultFilePath,
        'postgres',
        config.aws.postgres.secretsVersion
    );

    const credentials: IDatabaseCredentialsConfig = {
        read: {
            password: postgresSecrets.ro_password,
            username: postgresSecrets.ro_username,
        },
        write: {
            password: postgresSecrets.rw_password,
            username: postgresSecrets.rw_username,
        },
    };

    const credentialsRequestSignature = config.requestSignatures.credentials;
    const credentialsSignatureLookup = await loadSecretWithVersionFile<
        Record<string, string>
    >(credentialsRequestSignature.path, credentialsRequestSignature.fileName);
    const credentialsSignature =
        credentialsSignatureLookup[`v${credentialsRequestSignature.version}`];

    const dbClient = await initPostgresClient({
        ...config.aws.postgres,
        credentials,
        debugEnabled: config.logging.level === 'debug',
        eventEmitter: new events.EventEmitter(),
        logger: LoggerFactory.getLogger('pgClient'),
        metrics: metrics.subMetrics('postgres.client'),
    } as IPostgresInitConfig);

    const service = new HurleyService({
        loader: {
            rootDirectory: path.join(process.cwd(), 'dist'),
            schemas: {
                autoLoad: false,
            },
        },
        logger: LoggerFactory.getLogger(LOGGER_NAME),
        metricsClient: metrics,
        onAppInit,
        port: config.port,
        serviceName,
        socketExpiration: {
            enabled: true,
        },
        useFirst: [addCORS],
        userData: {
            credentialsSignature,
            dbClient,
        },
    });

    // loadSchema manually
    // loadSchemaWithUri('credentials', CredentialsSchema);

    return service
        .use(
            compression({
                level: COMPRESSION_LEVEL,
            })
        )
        .start();

    function onAppInit(app: Application): Promise<any> {
        return initializeTokenGenerator(config, app);
    }
}
