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

import { Methods } from '@hbo/hurley-http';
import { ILoaderRoute } from '@hbo/hurley-loader';
import { dynamicController } from '../controllers/dynamicController';
import { Globals, IGlobals } from '../Globals';
import { IServerData } from '../serviceTypes';

import dynamicSchema = require('../schemas/dynamicRequestsSchemas.json');

const { AuthCheck, LoggerFactory, RouteFactory }: IGlobals = Globals;

export function createRoutes(serverData: IServerData): ILoaderRoute[] {
    const dynamicControllerInstance = dynamicController(serverData);
    return [
        RouteFactory.createRoute(
            Methods.POST,
            '/dynamic/:queryName',
            dynamicSchema.dynamicRequestSchema,
            [dynamicControllerInstance.executeDynamicRequest.bind(null)],
            {
                apiName: 'post.dynamic',
            }
        )
    ];
}
