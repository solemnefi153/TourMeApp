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

import * as http from 'http';

describe('server', () => {
    const logger = { error: jest.fn().mockName('mockedLogger#error') };
    const serviceGlobals = {
        LoggerFactory: {
            getLogger: jest
                .fn()
                .mockName('mockedLoggerFactory')
                .mockReturnValue(logger),
        },
    };
    jest.mock('../../src/Globals', () => ({ Globals: serviceGlobals }));

    function loadModuleAndReturnResult(
        startService: Promise<http.Server>
    ): Promise<http.Server> {
        jest.mock('../../src/startService', () => ({
            startService,
        }));
        const serverModule = require('../../src/server') as typeof import('../../src/server');
        return serverModule.startServiceResult;
    }

    beforeEach(() => {
        jest.resetModules();
    });

    describe('when service starts successfully', () => {
        let goodService: any;

        beforeEach(() => {
            goodService = jest
                .fn()
                .mockName('successfulStartService')
                .mockResolvedValue(null);
        });

        test('starts the service', async () =>
            loadModuleAndReturnResult(goodService).then(() => {
                expect(goodService).toHaveBeenCalledTimes(1);
            }));

        test('does not exit the process', async () =>
            loadModuleAndReturnResult(goodService).then(() => {
                expect(process.exit).not.toHaveBeenCalled();
            }));
    });

    describe('when service fails to start', () => {
        const mockedExit = jest.fn().mockName('process#exit');
        global.process.exit = mockedExit as any;

        const err = new Error('This is only a test');
        let badService: any;

        beforeEach(() => {
            badService = jest.fn().mockReturnValue(Promise.reject(err));
        });

        test('exits the process', async () =>
            loadModuleAndReturnResult(badService).then(() => {
                expect(process.exit).toHaveBeenCalledWith(1);
                expect(process.exit).toHaveBeenCalledTimes(1);
            }));

        test('logs the error', async () =>
            loadModuleAndReturnResult(badService).then(() => {
                expect(logger.error).toHaveBeenCalledTimes(1);
                expect(logger.error).toHaveBeenCalledWith({
                    event: 'serviceStartError',
                    err,
                });
            }));

        test('logs before exiting the process', async () =>
            loadModuleAndReturnResult(badService).then(() => {
                expect(logger.error.mock.invocationCallOrder[0]).toBeLessThan(
                    mockedExit.mock.invocationCallOrder[0]
                );
            }));
    });
});
