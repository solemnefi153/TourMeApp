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

// import { CastleSchema } from '@hbo/hurley-castle-data-model';
import { Methods } from '@hbo/hurley-http';
import { ILoaderRoute } from '@hbo/hurley-loader';
import { customersController } from '../controllers/customersController';
import { Globals, IGlobals } from '../Globals';
import { IServerData } from '../serviceTypes';
import customersSchemas = require('../schemas/customersRequestsSchemas.json');

const { AuthCheck, LoggerFactory, RouteFactory }: IGlobals = Globals;

export function createRoutes(serverData: IServerData): ILoaderRoute[] {
    const customersControllerInstance = customersController(serverData);

    return [
        RouteFactory.createRoute(
            Methods.POST,
            '/customers',
            customersSchemas.createCustomerRequestSchema,
            [customersControllerInstance.createCustomer.bind(null)],
            {
                apiName: 'post.customers',
            }
        ),
        RouteFactory.createRoute(
            Methods.GET,
            '/customers/:customerId',
            customersSchemas.fetchCustomerRequestSchema,
            [customersControllerInstance.fetchCustomerById.bind(null)],
            {
                apiName: 'post.customers',
            }
        ),
        RouteFactory.createRoute(
            Methods.GET,
            '/customers',
            {},
            [customersControllerInstance.fetchAllCustomers.bind(null)],
            {
                apiName: 'post.customers',
            }
        ),
        RouteFactory.createRoute(
            Methods.PUT,
            '/customers/:customerId',
            customersSchemas.updateCustomerRequestSchema,
            [customersControllerInstance.updateCustomer.bind(null)],
            {
                apiName: 'post.customers',
            }
        ),
        RouteFactory.createRoute(
            Methods.DELETE,
            '/customers/:customerId',
            customersSchemas.deleteCustomerRequestSchema,
            [customersControllerInstance.deleteCustomerById.bind(null)],
            {
                apiName: 'post.customers',
            }
        ),
    ];
}
