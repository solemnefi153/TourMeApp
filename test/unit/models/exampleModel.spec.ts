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

import { ExampleModel } from '../../../src/models/exampleModel';

describe('ExampleModel', () => {
    it('returns the ultimate answer', async () => {
        const paramValue = '42';
        const asBinaryInt = parseInt(paramValue, 10);
        const model = ExampleModel.create(paramValue, asBinaryInt);
        const mockCtx = jest
            .fn()
            .mockName('mockCtx')
            .mockImplementation(() => ({ clientUuid: '123123' }));
        await expect(model.exampleBusinessLogic(mockCtx)).resolves.toBe(
            `The answer for ${paramValue} is ${asBinaryInt}`
        );
    });
});
