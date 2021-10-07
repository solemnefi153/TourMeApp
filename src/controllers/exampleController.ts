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
import * as express from 'express';
import { Globals } from '../Globals';
import { ExampleModel } from '../models/exampleModel';

const logger: ILogger = Globals.LoggerFactory.getLogger(
    'controllers.ExampleController'
);

export async function exampleHandler(
    request: IRequest,
    response: express.Response
): Promise<express.Response> {
    const model = ExampleModel.create(
        request.model.data.exampleBodyValue,
        request.model.params.examplePathParam
    );
    const result = await model.exampleBusinessLogic(request.ctx);
    logger.info({
        ctx: request.ctx,
        event: 'exampleHandlerDone',
        message: `request.model value": ${JSON.stringify(request.model)}`,
    });
    return response.status(StatusCodes.ACCEPTED).json(result);
}
