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
/* tslint:disable: typedef no-any variable-name*/

const stubbedLogger = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
};
const globalsModule = {
    Globals: {
        LoggerFactory: {
            getLogger: jest
                .fn()
                .mockName('mockLoggerFactory')
                .mockReturnValue(stubbedLogger),
        },
    },
};
jest.mock('../../../../../../src/Globals.ts', () => globalsModule);
import { IDistributedContext } from '@hbo/hurley-loader';
import { PlatformTenantCode } from '@hbo/hurley-platform-tenant-config';
import {
    IPostgresTransaction,
    MeasuredTransactionCallbackFn,
    PostgresClient,
} from '@hbo/hurley-postgres';
import { IUpdateCustomerRequestBody } from '../../../../../../src/interfaces/Customer';
import { mockCustomer } from '../../../../../testUtils/mockCustomer';
import { customerAlreadyExistError } from '../../../../../../src/db/postgres/daos/customersDao/customersRequestErrors';

/**
 * Setup and return mock customersDao and customersModel
 * @param mockServerData
 * @param mockDaoImplementation
 */
function getCustomersDaoInstance(mockPostgresClient: PostgresClient) {
    const CustomersDaoModule = require('../../../../../../src/db/postgres/daos/customersDao/customersDao');
    const custmersDao = new CustomersDaoModule.CustomersDao(
        mockPostgresClient as PostgresClient
    );
    return { custmersDao };
}

describe('custmersDao', () => {
    const dbResponse = {
        customer_id: mockCustomer.customerId,
        first_name: mockCustomer.firstName,
        last_name: mockCustomer.lastName,
        phone_number: mockCustomer.phoneNumber,
        created_at: mockCustomer.createdAt,
    };

    const dbResponseArray = [
        { ...dbResponse },
        { ...dbResponse },
        { ...dbResponse },
    ];
    dbResponseArray[0].customer_id += '_1';
    dbResponseArray[1].customer_id += '_2';
    dbResponseArray[2].customer_id += '_3';

    const mockCustomerArray = [
        { ...mockCustomer },
        { ...mockCustomer },
        { ...mockCustomer },
    ];
    mockCustomerArray[0].customerId += '_1';
    mockCustomerArray[1].customerId += '_2';
    mockCustomerArray[2].customerId += '_3';

    type IDbResponse = typeof dbResponse;

    const mockCtx: IDistributedContext = {
        ['prop']: 'any',
        clientUuid: 'mockedClientUuid',
    };

    const mockTransactionInstance = {
        many: jest.fn(),
        manyOrNone: jest.fn(),
        oneOrNone: jest.fn(),
        one: jest.fn(),
        none: jest.fn(),
    };

    const mockImplementation = async (
        callback: MeasuredTransactionCallbackFn<any>
    ) => {
        return await callback(
            (mockTransactionInstance as unknown) as IPostgresTransaction
        );
    };
    const mockPostgresClient = ({
        readTaskInAnyInstance: jest
            .fn()
            .mockName('mockReadTaskInAnyInstance')
            .mockImplementation(mockImplementation),
        writeTaskInPrimaryInstance: jest
            .fn()
            .mockName('mockwriteTaskInPrimaryInstance')
            .mockImplementation(mockImplementation),
    } as unknown) as PostgresClient;

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('createCustomer', () => {
        it('should successfully create a customer', async () => {
            mockTransactionInstance.one = jest
                .fn()
                .mockResolvedValueOnce(dbResponse);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            const result = await custmersDao.createCustomer(
                mockCtx,
                mockCustomer
            );
            expect(result).toEqual(mockCustomer);
        });

        it('should throw ConflictError if the error returned is constriant violation', async () => {
            try {
                const errorResp = new Error();
                errorResp.name = 'ConstraintViolationError';
                mockTransactionInstance.one = jest
                    .fn()
                    .mockRejectedValue(errorResp);

                const { custmersDao } = getCustomersDaoInstance(
                    mockPostgresClient
                );

                await custmersDao.createCustomer(mockCtx, mockCustomer);
            } catch (err) {
                expect(err).isPrototypeOf('ConflictError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                expect(err.message).toBe(customerAlreadyExistError());
                return;
            }
            expect('should enter').toBe(false);
        });

        it('should bubble up any error that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            mockTransactionInstance.one = jest
                .fn()
                .mockRejectedValue(errorResp);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);
            try {
                await custmersDao.createCustomer(mockCtx, mockCustomer);
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
            expect('should enter').toBe(false);
        });
    });

    describe('fetchCustomerById', () => {
        const mockCustomerId = mockCustomer.customerId;

        it('should successfully return a customer with the  provided customerId and platformTenentCode', async () => {
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockResolvedValueOnce(dbResponse);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);
            const result = await custmersDao.fetchCustomerByCustomerId(
                mockCtx,
                mockCustomerId
            );

            expect(result).toEqual(mockCustomer);
        });

        it('should throw NotFoundError if the postgres returns no results.', async () => {
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockResolvedValueOnce(null);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);
            try {
                await custmersDao.fetchCustomerByCustomerId(
                    mockCtx,
                    mockCustomerId
                );
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                return;
            }
            expect('should enter').toBe(false);
        });

        it('should throw NotFoundError if the error returned is NoResultsError', async () => {
            const errorResp = new Error();
            errorResp.name = 'NoResultsError';
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockRejectedValue(errorResp);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.fetchCustomerByCustomerId(
                    mockCtx,
                    mockCustomerId
                );
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                return;
            }
            expect('should enter').toBe(false);
        });

        it('should bubble up any error that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockRejectedValue(errorResp);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.fetchCustomerByCustomerId(
                    mockCtx,
                    mockCustomerId
                );
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
            expect('should enter').toBe(false);
        });
    });

    describe('fetchAllCustomers', () => {
        it('should successfully return an array of customers', async () => {
            mockTransactionInstance.manyOrNone = jest
                .fn()
                .mockResolvedValueOnce(dbResponseArray);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);
            const result = await custmersDao.fetchAllCustomers(mockCtx);
            expect(result).toEqual(mockCustomerArray);
        });

        it('should not throw an error if there are no results', async () => {
            const dbResponseArray: Array<IDbResponse> = [];
            const mockEmptyResponse: Array<IDbResponse> = [];

            mockTransactionInstance.manyOrNone = jest
                .fn()
                .mockResolvedValueOnce(dbResponseArray);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                const result = await custmersDao.fetchAllCustomers(mockCtx);
                expect(result).toEqual(mockEmptyResponse);
            } catch (err) {
                expect(err).toBeUndefined();
                return;
            }
        });

        it('should bubble up any error that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            mockTransactionInstance.manyOrNone = jest
                .fn()
                .mockRejectedValue(errorResp);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.fetchAllCustomers(mockCtx);
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
            expect('should enter').toBe(false);
        });
    });

    describe('updateCustomer', () => {
        it('should successfully update account', async () => {
            const updateCustomerDao: IUpdateCustomerRequestBody = {
                customerId: mockCustomer.customerId,
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '999-999-9999',
            };

            const mockCustomerUpdateResponse: IUpdateCustomerRequestBody = {
                customerId: mockCustomer.customerId,
                firstName: 'Clark',
                lastName: 'Kent',
                phoneNumber: '999-999-9999',
            };

            mockTransactionInstance.one = jest
                .fn()
                .mockResolvedValueOnce(updateCustomerDao);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            const result = await custmersDao.updateCustomer(mockCtx, {
                updateCustomerDao,
            });
            expect(result).toEqual(mockCustomerUpdateResponse);
        });

        it('should throw NotFoundError if the error returned is NoResultsError', async () => {
            const updateCustomerDao: IUpdateCustomerRequestBody = {
                customerId: mockCustomer.customerId,
                firstName: 'Clark',
            };

            const errorResp = new Error();
            errorResp.name = 'NoResultsError';
            mockTransactionInstance.one = jest
                .fn()
                .mockRejectedValue(errorResp);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.updateCustomer(mockCtx, {
                    updateCustomerDao,
                });
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                return;
            }
            expect('should enter').toBe(false);
        });

        it('should throw ConflictError if the error returned is constriant violation', async () => {
            const updateCustomerDao: IUpdateCustomerRequestBody = {
                customerId: mockCustomer.customerId,
                firstName: 'Clark',
            };

            const errorResp = new Error();
            errorResp.name = 'ConstraintViolationError';
            mockTransactionInstance.one = jest
                .fn()
                .mockRejectedValue(errorResp);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.updateCustomer(mockCtx, {
                    updateCustomerDao,
                });
            } catch (err) {
                expect(err).isPrototypeOf('ConflictError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                return;
            }
            expect('should enter').toBe(false);
        });

        it('should bubble up any error that is not wrapped by ServiceRequestError', async () => {
            const updateCustomerDao: IUpdateCustomerRequestBody = {
                customerId: mockCustomer.customerId,
                firstName: 'Clark',
            };

            const errorResp = new Error('Unknown Error');
            mockTransactionInstance.one = jest
                .fn()
                .mockRejectedValue(errorResp);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.updateCustomer(mockCtx, {
                    updateCustomerDao,
                });
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
            expect('should enter').toBe(false);
        });
    });

    describe('deleteCustomerById', () => {
        const mockCustomerId = mockCustomer.customerId;

        it('should successfully return a customer with the  provided customerId  after deleting the customer form the database', async () => {
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockResolvedValueOnce(dbResponse);
            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);
            try {
                const result = await custmersDao.deleteCustomerById(
                    mockCtx,
                    mockCustomerId
                );
                expect(result).toEqual(mockCustomer);
                return;
            } catch (err) {
                expect('should enter').toBe(false);
            }
        });

        it('should throw NotFoundError if the postgres returns no results.', async () => {
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockResolvedValueOnce(null);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);
            try {
                await custmersDao.deleteCustomerById(mockCtx, mockCustomerId);
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                return;
            }
            expect('should enter').toBe(false);
        });

        it('should throw NotFoundError if the error returned is NoResultsError', async () => {
            const errorResp = new Error();
            errorResp.name = 'NoResultsError';
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockRejectedValue(errorResp);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.deleteCustomerById(mockCtx, mockCustomerId);
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                return;
            }
            expect('should enter').toBe(false);
        });

        it('should bubble up any error that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            mockTransactionInstance.oneOrNone = jest
                .fn()
                .mockRejectedValue(errorResp);

            const { custmersDao } = getCustomersDaoInstance(mockPostgresClient);

            try {
                await custmersDao.deleteCustomerById(mockCtx, mockCustomerId);
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
            expect('should enter').toBe(false);
        });
    });
});
