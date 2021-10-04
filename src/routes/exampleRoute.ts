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

import * as hurleyHttp from '@hbo/hurley-http';
import { ILoaderRoute } from '@hbo/hurley-loader';
import { exampleHandler } from '../controllers/exampleController';
import { Globals } from '../Globals';

import postExampleSchema = require('../schemas/exampleRequestSchema.json');

export function createRoutes(): ILoaderRoute[] {
    const handlers = [exampleHandler];
    return [
        Globals.RouteFactory.createRoute(
            hurleyHttp.Methods.POST,
            '/example/:examplePathParam',
            postExampleSchema,
            handlers
        ),
    ];
}
