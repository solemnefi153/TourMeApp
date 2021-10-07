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

import { Server } from 'http';
import { ILogger } from '@hbo/hurley-api-logging';
import { Globals } from './Globals';
import { startService } from './startService';

const logger: ILogger = Globals.LoggerFactory.getLogger('service.init');

// Exporting startServiceResult to be able to examine the promises chain in unit tests
// noinspection JSUnusedGlobalSymbols
export const startServiceResult: Promise<Server> = startService().catch(
    (err: Error) => {
        logger.error({ event: 'serviceStartError', err });

        // eslint-disable-next-line
        process.exit(1);
    }
);
