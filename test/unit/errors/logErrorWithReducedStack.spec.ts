/**
 * Copyright (c) 2020 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

import { ILogger } from '@hbo/hurley-api-logging';
import { IDistributedContext } from '@hbo/hurley-loader';
import { IOopType } from '../../../src/serviceTypes';

describe('logErrorWithReducedStack.ts', () => {
    const logger: ILogger = {
        error: jest.fn().mockName('mockedLogger#error'),
        warn: jest.fn().mockName('mockedLogger#warn'),
        trace: jest.fn().mockName('mockedLogger#trace'),
        debug: jest.fn().mockName('mockedLogger#debug'),
        info: jest.fn().mockName('mockedLogger#info'),
        fatal: jest.fn().mockName('mockedLogger#fatal'),
        using: jest.fn().mockName('mockedLogger#using'),
    };
    const ctx: IDistributedContext = {};
    const eventName: string = 'event';
    const addFields: object = { field: 'field' };

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('logErrorWithReducedStack', () => {
        const e: Error = new Error();
        const {
            logErrorWithReducedStack,
        }: IOopType = require('../../../src/errors/logErrorWithReducedStack');

        it('should fill in missing message or stack', async () => {
            e.stack = undefined;

            logErrorWithReducedStack(logger, eventName, e, ctx, addFields);
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith({
                ctx,
                errStack: undefined,
                error: 'Error',
                event: eventName,
                ...addFields,
            });
        });

        it('should flatten a stack with newlines', async () => {
            e.message = 'test error';
            e.stack = 'example\nmultiline\nstack';

            logErrorWithReducedStack(logger, eventName, e, ctx, addFields);
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith({
                ctx,
                errStack: ['example', 'multiline', 'stack'],
                error: 'test error',
                event: eventName,
                ...addFields,
            });
        });
    });

    describe('logWarnWithReducedStack', () => {
        const e: Error = new Error();
        const {
            logWarnWithReducedStack,
        }: IOopType = require('../../../src/errors/logErrorWithReducedStack');

        it('should fill in missing message or stack', async () => {
            e.stack = undefined;

            logWarnWithReducedStack(logger, eventName, e, ctx, addFields);
            expect(logger.warn).toHaveBeenCalledTimes(1);
            expect(logger.warn).toHaveBeenCalledWith({
                ctx,
                errStack: undefined,
                error: 'Error',
                event: eventName,
                ...addFields,
            });
        });

        it('should flatten a stack with newlines', async () => {
            e.message = 'test error';
            e.stack = 'example\nmultiline\nstack';

            logWarnWithReducedStack(logger, eventName, e, ctx, addFields);
            expect(logger.warn).toHaveBeenCalledTimes(1);
            expect(logger.warn).toHaveBeenCalledWith({
                ctx,
                errStack: ['example', 'multiline', 'stack'],
                error: 'test error',
                event: eventName,
                ...addFields,
            });
        });
    });
});
