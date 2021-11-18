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
import { Response } from 'express';

import {
    getErrorStatusCode,
    ServiceRequestError,
    writeServiceErrorAsJson,
} from '../errors/requestErrors';
import { AuthRequest, AuthRequestHandler } from '../util/authUser';

/**
 * Runs the given callbackFunction and provides wrappers for response and error handlers
 * @param callbackFunction -  A function which accepts the request object,
 * and returns a result for the API.
 * @param successStatusCode
 */
export default function tryCatchController<T>(
    callbackFunction: (request: AuthRequest) => Promise<T>,
    successStatusCode: StatusCodes = StatusCodes.SUCCESS
): AuthRequestHandler {
    return async function handleRoute(
        request: AuthRequest,
        response: Response
    ): Promise<void> {
        try {
            const data = await callbackFunction(request);
            response.status(successStatusCode).json(data);
        } catch (e) {
            if (e instanceof ServiceRequestError) {
                response
                    .status(getErrorStatusCode(e))
                    .json(writeServiceErrorAsJson(e));
            } else {
                response
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(writeServiceErrorAsJson(e as ServiceRequestError));
            }
        }
    };
}
