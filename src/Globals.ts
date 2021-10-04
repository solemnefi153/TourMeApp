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

import { RouteFactory } from '@hbo/hurley-loader';
import { LoggerFactory } from '@hbo/hurley-logging';
import { MetricsClient } from '@hbo/hurley-metrics';
import { Config } from '@hbo/piconfig';

export interface IGlobals {
    Config: typeof Config;
    LoggerFactory: LoggerFactory;
    RouteFactory: RouteFactory;
    metrics: MetricsClient;
    serviceName: string;
}

const {
    meta: { service: serviceName },
    logging,
    metrics,
} = Config.getConfig();

const metricsConfig: Record<string, unknown> = Object.assign(
    { serviceName },
    metrics
);

const loggerFactory: LoggerFactory = new LoggerFactory(serviceName, logging);
const metricsClient: MetricsClient = new MetricsClient(metricsConfig);
const routeFactory: RouteFactory = new RouteFactory(
    metricsClient,
    loggerFactory.getLogger('loader.routes'),
    Config.getConfig()
);

export const Globals: IGlobals = {
    Config,
    LoggerFactory: loggerFactory,
    RouteFactory: routeFactory,
    metrics: metricsClient,
    serviceName,
};
