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

/* tslint:disable:no-any */
// @ts-ignore
import { errorTypes } from '@hbo/hurley-errormapper';
import { StatusCodes } from '@hbo/hurley-http';

/**
 * @class ServiceRequestError
 * @classdesc ServiceRequestError represents a basic request error for
 * an incoming request
 */
export class ServiceRequestError extends Error {
    public statusCode: StatusCodes;
    public message: string;
    public name: string;

    constructor(statusCode: StatusCodes, name?: string, message?: string) {
        super();
        this.statusCode = statusCode;
        this.name = name || /* istanbul ignore next */ 'ServiceRequestError';
        this.message =
            message || /* istanbul ignore next */ 'Service Request Error';
    }
}

/**
 * @class NotFoundError
 * @classdesc creates a ServiceRequestError when a resource is not found
 */
export class NotFoundError extends ServiceRequestError {
    constructor(message?: string) {
        super(
            StatusCodes.NOT_FOUND,
            'NotFoundError',
            message || /* istanbul ignore next */ 'resource not found'
        );
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

/**
 * @class BadRequestError
 * @classdesc creates a ServiceRequestError when a resource is not found
 */
export class BadRequestError extends ServiceRequestError {
    constructor(message?: string) {
        super(
            StatusCodes.BAD_REQUEST,
            'BadRequestError',
            message || /* istanbul ignore next */ 'bad request'
        );
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

/**
 * @class ConflictError
 * @classdesc creates a ServiceRequestError when incase of a conflict
 */
export class ConflictError extends ServiceRequestError {
    constructor(message?: string) {
        super(
            StatusCodes.CONFLICT,
            'ConflictError',
            message || /* istanbul ignore next */ 'conflict'
        );
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

export function isNotFoundError(e: Error): boolean {
    return (
        e.name === 'NoResultsError' ||
        e instanceof errorTypes.NotFoundError ||
        getErrorStatusCode(e) === StatusCodes.NOT_FOUND
    );
}

export function isConstraintViolationError(e: Error): boolean {
    return e.name === 'ConstraintViolationError';
}

export function getErrorStatusCode(err: any): number {
    // _statusCode comes from ApiClient
    // https://github.com/HBOCodeLabs/Hurley-ApiClients/blob/master/lib/ApiClientBase.js#L126
    return (
        err.statusCode || err._statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
}

export interface IErrorOutput {
    message: string;
    status: number;
}

/**
 * Serialize a Service Error as Json Object with correct format required by Client.
 * @param error
 */
export function writeServiceErrorAsJson(
    error: ServiceRequestError
): IErrorOutput {
    return {
        // only pass message and status for now
        // we can add more fields if necessary in the future
        message: error.message,
        status: getErrorStatusCode(error),
    };
}
