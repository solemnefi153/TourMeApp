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

import { StatusCodes } from '@hbo/hurley-http';
import { IRequest } from '@hbo/hurley-loader';
import * as express from 'express';

describe('exampleController', () => {
    // mocking request/response
    const request = (jest
        .fn()
        .mockName('mockedRequest') as unknown) as IRequest;
    request.model = {
        data: { exampleRequestParam: 'example value' },
        params: { examplePathParam: 42 },
    };

    const mockedBodySender = jest.fn().mockName('mockedStatusBody');
    const mockedStatus = jest
        .fn()
        .mockName('mockedStatus')
        .mockImplementation(() => ({ json: mockedBodySender }));
    const responseSendStatus = ({
        status: mockedStatus,
    } as unknown) as express.Response;

    // mocking model
    const mockResult = 42;
    const mockModel = {
        exampleBusinessLogic: jest
            .fn()
            .mockName('mockedCreatedModel')
            .mockResolvedValue(mockResult),
    };
    const mockModelClass = {
        ExampleModel: { create: jest.fn().mockImplementation(() => mockModel) },
    };

    // mocking test module
    jest.mock('../../../src/models/exampleModel', () => mockModelClass);
    const testModule: typeof import('../../../src/controllers/exampleController') = require('../../../src/controllers/exampleController');

    describe('exampleHandler', () => {
        it('handles the exampleHandler request', async () => {
            await testModule.exampleHandler(request, responseSendStatus);
            expect(request).not.toHaveBeenCalled();
            expect(responseSendStatus.status).toHaveBeenCalledWith(
                StatusCodes.ACCEPTED
            );
            expect(mockedBodySender).toHaveBeenCalledTimes(1);
            expect(mockedBodySender).toHaveBeenCalledWith(mockResult);
        });
    });
});
