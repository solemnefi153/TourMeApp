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
import * as errors from '../../../src/errors/requestErrors';

// tslint:disable:hbo-secrets
describe('ServiceError property setters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('gets and sets all properties for default ServiceRequestError', () => {
        const serviceError = new errors.ServiceRequestError(400);
        serviceError.name = 'TestServiceError';

        expect(serviceError.message).toEqual('Service Request Error');
        expect(serviceError.name).toBe('TestServiceError');
        expect(serviceError.statusCode).toBe(400);
    });

    it('gets and sets all properties for NotFoundError', () => {
        const serviceError = new errors.NotFoundError();

        expect(serviceError.message).toEqual('resource not found');
        expect(serviceError.name).toBe('NotFoundError');
        expect(serviceError.statusCode).toBe(404);
    });

    it('gets and sets all properties for BadRequestError', () => {
        const serviceError = new errors.BadRequestError();

        expect(serviceError.message).toEqual('bad request');
        expect(serviceError.name).toBe('BadRequestError');
        expect(serviceError.statusCode).toBe(400);
    });

    it('gets and sets all properties for ConflictError', () => {
        const serviceError = new errors.ConflictError();

        expect(serviceError.message).toEqual('conflict');
        expect(serviceError.name).toBe('ConflictError');
        expect(serviceError.statusCode).toBe(409);
    });

    it('check that the isNotFoundError function detects iNotFoundError errors', () => {
        const badRequestError = new errors.BadRequestError();
        const conflictError = new errors.ConflictError();
        const conflictErrorServiceRequestError = new errors.ServiceRequestError(
            409
        );
        const notFoudnServiceRequestError = new errors.ServiceRequestError(404);
        const notFoundError = new errors.NotFoundError();

        expect(errors.isNotFoundError(badRequestError)).toBe(false);
        expect(errors.isNotFoundError(conflictError)).toBe(false);
        expect(errors.isNotFoundError(conflictErrorServiceRequestError)).toBe(
            false
        );
        expect(errors.isNotFoundError(notFoudnServiceRequestError)).toBe(true);
        expect(errors.isNotFoundError(notFoundError)).toBe(true);
    });
});
