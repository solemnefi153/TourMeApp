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

import { StatusCodes } from '@hbo/hurley-http';
import { IRequest } from '@hbo/hurley-loader';
import { ILogger } from '@hbo/hurley-api-logging';
import { Globals } from '../Globals';

import * as express from 'express';

const logger: ILogger = Globals.LoggerFactory.getLogger(
    'controllers.HealthcheckController'
);

export function getHealthcheck(
    request: IRequest,
    response: express.Response
): void {
    logger.trace({ event: 'checkingHealth' });
    response.sendStatus(StatusCodes.SUCCESS);
}
