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
import * as express from 'express';
import * as healthcheckController from '../../../src/controllers/healthcheckController';

describe('healthcheckController', () => {
    const request = (jest
        .fn()
        .mockName('mockedRequest') as unknown) as express.Request;
    const responseSendStatus = ({
        sendStatus: jest.fn(),
    } as unknown) as express.Response;

    describe('getHealthCheck', () => {
        it('handles the getHealthCheck request', () => {
            healthcheckController.getHealthcheck(request, responseSendStatus);
            expect(request).not.toHaveBeenCalled();
            expect(responseSendStatus.sendStatus).toHaveBeenCalledWith(
                StatusCodes.SUCCESS
            );
        });
    });
});
