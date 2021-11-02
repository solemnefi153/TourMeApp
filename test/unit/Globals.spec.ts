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

import * as _ from 'lodash';

describe('Globals', () => {
    const serviceName = 'mocked-service-name';

    const config = {
        logging: { key1: 1, key2: 'two' },
        meta: { service: serviceName },
        metrics: { key1: 'one', key2: 2 },
    };
    const configSource = {} as { getConfig: jest.Mock<any, any> };
    const piConfig = {
        Config: {} as { createDefaultConfig: jest.Mock<any, any> },
    };

    const aLogger = { key: 'aLogger' };
    const loggerFactoryInstance = {} as { getLogger: any };
    const hurleyLogging = {} as { LoggerFactory: any };

    const metricsClient = { key: 'metricsClient' };
    const hurleyMetrics = {} as { MetricsClient: jest.Mock<any, any> };

    let routeFactory: jest.Mock<any, any>;
    const hurleyLoader = {} as { RouteFactory: jest.Mock<any, any> };

    let authCheck: jest.Mock<any, any>;
    const hurleyAuthCheck = {} as { using: jest.Mock<any, any> };

    let globalsModule: typeof import('../../src/Globals');

    beforeEach(() => {
        configSource.getConfig = jest
            .fn()
            .mockName('mockedConfigSource')
            .mockReturnValue(config);
        piConfig.Config.createDefaultConfig = jest
            .fn()
            .mockName('mockedDefaultConfig')
            .mockReturnValue(configSource);

        loggerFactoryInstance.getLogger = jest.fn().mockReturnValue(aLogger);

        hurleyLogging.LoggerFactory = jest
            .fn()
            .mockName('mockedLoggerFactory')
            .mockImplementation(() => loggerFactoryInstance);

        hurleyMetrics.MetricsClient = jest
            .fn()
            .mockName('mockedMetricsClient')
            .mockImplementation(() => metricsClient);

        routeFactory = jest.fn().mockName('mockedRouteFactory');

        hurleyLoader.RouteFactory = jest
            .fn()
            .mockName('mockedHurleyLoader')
            .mockImplementation(() => routeFactory);

        authCheck = jest.fn().mockName('mockedAuthCheck');
        hurleyAuthCheck.using = jest
            .fn()
            .mockName('mockedHurleyAuthcheck')
            .mockImplementation(() => authCheck);
        jest.mock('@hbo/hurley-loader', () => hurleyLoader);
        jest.mock('@hbo/hurley-logging', () => hurleyLogging);
        jest.mock('@hbo/hurley-metrics', () => hurleyMetrics);
        jest.mock('@hbo/hurley-authcheck', () => hurleyAuthCheck);
        jest.mock('@hbo/piconfig', () => piConfig);

        jest.resetModules();
        globalsModule = require('../../src/Globals');
    });

    it('creates and returns the default config', () => {
        expect(globalsModule.Globals.Config).toBe(configSource);
    });

    it('returns the logger factory', () => {
        expect(globalsModule.Globals.LoggerFactory).toBe(loggerFactoryInstance);
    });

    it('instantiates the logger factory', () => {
        expect(hurleyLogging.LoggerFactory).toHaveBeenCalledWith(
            serviceName,
            config.logging
        );
    });

    it('instantiates the metrics client', () => {
        expect(hurleyMetrics.MetricsClient).toHaveBeenCalled();
    });

    it('sets service name in metrics configuration', () => {
        const expectedConfig = _.assign(
            { serviceName },
            configSource.getConfig().metrics
        );
        expect(hurleyMetrics.MetricsClient).toHaveBeenCalledWith(
            expectedConfig
        );
    });

    it('returns the metrics client', () => {
        expect(globalsModule.Globals.metrics).toBe(metricsClient);
    });

    it('returns the route factory', () => {
        expect(globalsModule.Globals.RouteFactory).toBe(routeFactory);
    });

    it('returns sets the metrics client, a logger and configSource for the route factory', () => {
        expect(loggerFactoryInstance.getLogger).toHaveBeenCalledWith('routes');
        expect(hurleyLoader.RouteFactory).toHaveBeenCalledWith(
            metricsClient,
            aLogger,
            config
        );
    });

    it('returns the service name', () => {
        expect(globalsModule.Globals.serviceName).toEqual(serviceName);
    });
});
