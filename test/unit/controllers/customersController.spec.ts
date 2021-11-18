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

import {
    PlatformTenantCode,
    ProductCode,
} from '@hbo/hurley-platform-tenant-config';
import {
    ICreateCustomerRequestBody,
    IGetCustomerByIdRequestBody,
    IUpdateCustomerRequestBody,
    IDeleteCustomerRequestBody,
    ICustomer,
} from '../../../src/interfaces/Customer';
import { customersController } from '../../../src/controllers/customersController';
import { AuthRequest } from '../../../src/util/authUser';
import { mockCustomer } from '../../testUtils/mockCustomer';
const { Properties } = require('@hbo/hurley-authcheck'); // tslint:disable-line no-var-requires typedef

const aLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
};
const mockGlobals = {
    Globals: {
        LoggerFactory: {
            getLogger: jest
                .fn()
                .mockName('mockLoggerFactory')
                .mockReturnValue(aLogger),
        },
    },
};

jest.mock('../../../src/Globals', () => mockGlobals);

const mockCreateCustomer = jest.fn();
const mockFetchCustomerById = jest.fn();
const mockFetchAllCustomers = jest.fn();
const mockUpdateCustomerById = jest.fn();
const mockDeleteCustomerById = jest.fn();

jest.mock('../../../src/models/customersModel', () => {
    return {
        CustomersModel: jest.fn().mockImplementation(() => ({
            createCustomer: mockCreateCustomer,
            fetchCustomerById: mockFetchCustomerById,
            fetchAllCustomers: mockFetchAllCustomers,
            updateCustomerById: mockUpdateCustomerById,
            deleteCustomerById: mockDeleteCustomerById,
        })),
    };
});

describe('customersController', () => {
    const controller = customersController({} as any);

    beforeAll(() => jest.clearAllMocks());
    it('creates the customers controller', () => {
        expect(controller.createCustomer).toBeDefined();
    });

    describe('createCustomer', () => {
        beforeEach(() => jest.clearAllMocks());

        const requestData: ICreateCustomerRequestBody = {
            firstName: mockCustomer.firstName,
            lastName: mockCustomer.lastName,
            phoneNumber: mockCustomer.phoneNumber,
        };

        const request = ({
            body: requestData,
            user: {
                getProperty: (property: number) => {
                    switch (property) {
                        case Properties.PLATFORM_TENANT_CODE:
                            return PlatformTenantCode.HBO_DIRECT;
                        case Properties.PRODUCT_CODE:
                            return ProductCode.HBO_MAX;
                    }
                },
            },
        } as unknown) as AuthRequest;

        const res = { status: () => res, json: () => 1 } as any;
        const next = () => ({});

        it('calls the createCustomer controller', async () => {
            await controller.createCustomer(request, res, next);
            expect(mockCreateCustomer).toHaveBeenCalled();
        });
    });

    describe('fetchCustomerById', () => {
        beforeEach(() => jest.clearAllMocks());
        const requestData: IGetCustomerByIdRequestBody = {
            customerId: mockCustomer.customerId,
        };
        const request = ({
            params: requestData,
            user: {
                getProperty: (property: number) => {
                    switch (property) {
                        case Properties.PLATFORM_TENANT_CODE:
                            return PlatformTenantCode.HBO_DIRECT;
                        case Properties.PRODUCT_CODE:
                            return ProductCode.HBO_MAX;
                    }
                },
            },
        } as unknown) as AuthRequest;

        const res = { status: () => res, json: () => 1 } as any;
        const next = () => ({});
        it('calls the fetchCustomerById controller', async () => {
            await controller.fetchCustomerById(request, res, next);
            expect(mockFetchCustomerById).toHaveBeenCalled();
        });
    });

    describe('fetchCustomers', () => {
        beforeEach(() => jest.clearAllMocks());

        const request = ({
            user: {
                getProperty: (property: number) => {
                    switch (property) {
                        case Properties.PLATFORM_TENANT_CODE:
                            return PlatformTenantCode.HBO_DIRECT;
                        case Properties.PRODUCT_CODE:
                            return ProductCode.HBO_MAX;
                    }
                },
            },
        } as unknown) as AuthRequest;

        const res = { status: () => res, json: () => 1 } as any;
        const next = () => ({});
        it('calls the fetchAllCustomers controller', async () => {
            await controller.fetchAllCustomers(request, res, next);
            expect(mockFetchAllCustomers).toHaveBeenCalled();
        });
    });

    describe('updateCustomerById', () => {
        beforeEach(() => jest.clearAllMocks());

        const requestData: IUpdateCustomerRequestBody = {
            customerId: mockCustomer.customerId,
            firstName: mockCustomer.firstName,
            lastName: mockCustomer.lastName,
            phoneNumber: mockCustomer.phoneNumber,
        };

        const request = ({
            params: { customerId: mockCustomer.customerId },
            body: requestData,
            user: {
                getProperty: (property: number) => {
                    switch (property) {
                        case Properties.PLATFORM_TENANT_CODE:
                            return PlatformTenantCode.HBO_DIRECT;
                        case Properties.PRODUCT_CODE:
                            return ProductCode.HBO_MAX;
                    }
                },
            },
        } as unknown) as AuthRequest;

        const res = { status: () => res, json: () => 1 } as any;
        const next = () => ({});
        it('calls the updateCustomer controller', async () => {
            await controller.updateCustomer(request, res, next);
            expect(mockUpdateCustomerById).toHaveBeenCalled();
        });
    });

    describe('deleteCustomerById', () => {
        beforeEach(() => jest.clearAllMocks());

        const requestData: IDeleteCustomerRequestBody = {
            customerId: mockCustomer.customerId,
        };

        const request = ({
            params: requestData,
            user: {
                getProperty: (property: number) => {
                    switch (property) {
                        case Properties.PLATFORM_TENANT_CODE:
                            return PlatformTenantCode.HBO_DIRECT;
                        case Properties.PRODUCT_CODE:
                            return ProductCode.HBO_MAX;
                    }
                },
            },
        } as unknown) as AuthRequest;

        const res = { status: () => res, json: () => 1 } as any;
        const next = () => ({});

        it('calls the deleteCustomerById controller', async () => {
            await controller.deleteCustomerById(request, res, next);
            expect(mockDeleteCustomerById).toHaveBeenCalled();
        });
    });
});
