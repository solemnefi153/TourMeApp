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
// tslint:disable:hbo-secrets no-any

import { StatusCodes } from '@hbo/hurley-http';
import * as express from 'express';

import tryCatchController from '../../../src/controllers/tryCatchController';
import { ServiceRequestError } from '../../../src/errors/requestErrors';
import { AuthRequest } from '../../../src/util/authUser';

describe('tryCatchController', () => {
    const mockReq = {} as AuthRequest;
    const mockNext = {} as express.NextFunction;
    let mockResponse: any = {};

    beforeEach(() => {
        mockResponse = ({
            json: jest.fn().mockName('mockedResponse'),
            status: jest.fn().mockReturnThis(),
        } as any) as express.Response;
    });

    it('testing a successful request', async () => {
        const mockCallbackFunction = async (req: AuthRequest) => {
            return 'testData';
        };
        const authRequestHandler = tryCatchController(mockCallbackFunction);

        expect(typeof authRequestHandler).toEqual('function');

        await authRequestHandler(mockReq, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.SUCCESS);
        expect(mockResponse.json).toHaveBeenCalledWith('testData');
    });

    it('testing a request that results in a ServiceRequestError', async () => {
        const formattedResponse = {
            message: 'testErrorMsg',
            status: 400,
        };
        const serviceRequestError = new ServiceRequestError(
            StatusCodes.BAD_REQUEST,
            'testError',
            'testErrorMsg'
        );
        const mockCallbackFunction = async (req: AuthRequest) => {
            throw serviceRequestError;
        };
        const authRequestHandler = tryCatchController(mockCallbackFunction);
        await authRequestHandler(mockReq, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCodes.BAD_REQUEST
        );
        expect(mockResponse.json).toHaveBeenCalledWith(formattedResponse);
    });

    it('testing a request that results in an error that is not a ServiceRequestError', async () => {
        const formattedResponse = {
            message: 'testErrorMsg',
            status: 500,
        };
        const errorMsg = 'testErrorMsg';
        const mockCallbackFunction = async (req: AuthRequest) => {
            throw new Error(errorMsg);
        };
        const authRequestHandler = tryCatchController(mockCallbackFunction);
        await authRequestHandler(mockReq, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCodes.INTERNAL_SERVER_ERROR
        );
        expect(mockResponse.json).toHaveBeenCalledWith(formattedResponse);
    });
});
