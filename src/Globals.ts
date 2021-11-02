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

import { RouteFactory } from '@hbo/hurley-loader';
import { LoggerFactory } from '@hbo/hurley-logging';
import { MetricsClient } from '@hbo/hurley-metrics';
import { Config } from '@hbo/piconfig';

// tslint:disable-next-line:no-var-requires
const hurleyAuthCheck = require('@hbo/hurley-authcheck'); // tslint:disable-line:variable-name
const configSource: Config = Config.createDefaultConfig();

const {
    meta: { service: serviceName },
    logging,
    metrics,
} = configSource.getConfig();
const metricsConfig: object = Object.assign({ serviceName }, metrics);

const loggerFactory: LoggerFactory = new LoggerFactory(serviceName, logging);
const metricsClient: MetricsClient = new MetricsClient(metricsConfig);
const routeFactory: RouteFactory = new RouteFactory(
    metricsClient,
    loggerFactory.getLogger('routes'),
    configSource.getConfig()
);

// tslint:disable-line:variable-name
export const Globals = {
    // tslint:disable-line:variable-name
    AuthCheck: hurleyAuthCheck.using({
        Config: configSource,
        Logger: loggerFactory,
        metrics: metricsClient,
    }),
    Config: configSource,
    LoggerFactory: loggerFactory,
    RouteFactory: routeFactory,
    metrics: metricsClient,
    serviceName,
};

export type IGlobals = typeof Globals;
