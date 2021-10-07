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

import { addCORSHeader } from '@hbo/hurley-http';
import { HurleyService } from '@hbo/hurley-loader';
import * as compression from 'compression';
import { Server } from 'http';
import { Globals } from './Globals';
import type * as express from 'express';

const { serviceName, Config, LoggerFactory, metrics } = Globals;

// 6 is the default level, but explicitly set it https://github.com/expressjs/compression#level
const COMPRESSION_LEVEL: number = 6;

export async function startService(): Promise<Server> {
    const config = Config.getConfig();
    const addCORS = addCORSHeader(config.accessControlMaxAge);

    const service = new HurleyService({
        logger: LoggerFactory.getLogger('loader'),
        metricsClient: metrics,
        onAppInit,
        port: config.port,
        serviceName,
        useFirst: [addCORS],
    });

    return service
        .use(
            compression({
                level: COMPRESSION_LEVEL,
            })
        )
        .start();

    async function onAppInit(app: express.Application): Promise<void> {
        // Please add code that is supposed to run after the application has been initialized.
    }
}
