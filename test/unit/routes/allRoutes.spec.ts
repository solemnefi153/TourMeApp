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
import { Middleware } from '@hbo/hurley-loader';
import { exampleHandler } from '../../../src/controllers/exampleController';
import { getHealthcheck } from '../../../src/controllers/healthcheckController';
import { Globals } from '../../../src/Globals';
import * as exampleRoute from '../../../src/routes/exampleRoute';
import * as healthcheckRoute from '../../../src/routes/healthcheck';
import * as customers from '../../../src/routes/customers';

import postExampleSchema = require('../../../src/schemas/exampleRequestSchema.json');
import { IServerData } from '../../../src/serviceTypes';

describe('routes', () => {
    beforeEach(() => {
        spyOn(Globals.RouteFactory, 'createRoute');
    });

    describe('healthcheck', () => {
        it('creates the expected routes', () => {
            const routes = healthcheckRoute.createRoutes();
            const createRouteOpts = { disabledMiddleware: Middleware.ALL };
            expect(routes.length).toEqual(1);
            expect(Globals.RouteFactory.createRoute).toHaveBeenCalledWith(
                hurleyHttp.Methods.GET,
                '/healthcheck',
                {},
                [getHealthcheck],
                createRouteOpts
            );
        });
    });

    describe('example', () => {
        it('creates the expected routes', () => {
            const routes = exampleRoute.createRoutes();
            expect(routes.length).toEqual(1);
            expect(
                Globals.RouteFactory.createRoute
            ).toHaveBeenCalledWith(
                hurleyHttp.Methods.POST,
                '/example/:examplePathParam',
                postExampleSchema,
                [exampleHandler]
            );
        });
    });

    describe('customers', () => {
        it('creates the expected routes', () => {
            const serverData: IServerData = {} as any;
            const routes = customers.createRoutes(serverData);
            expect(routes.length).toEqual(5);
        });
    });
});
