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
/* tslint:disable:no-any typedef */

import {
    ICreateCustomerRequestBody,
    IGetCustomerByIdRequestBody,
    IUpdateCustomerRequestBody,
    IDeleteCustomerRequestBody,
    ICustomer,
} from '../../../src/interfaces/Customer';
import { StatusCodes } from '@hbo/hurley-http';
import { IDistributedContext } from '@hbo/hurley-loader';
import {
    IPostgresTask,
    MeasuredTaskCallbackFn,
    PostgresClient,
} from '@hbo/hurley-postgres';
import {
    ConflictError,
    NotFoundError,
} from '../../../src/errors/requestErrors';

import { customerAlreadyExistError } from '../../../src/db/postgres/daos/customersDao/customersRequestErrors';

import { IServerData } from '../../../src/serviceTypes';
import { mockCustomer } from '../../testUtils/mockCustomer';
import { IClient } from '@hbo/hurley-request';

/**
 * Setup and return mock CustomersDao and customersModel
 * @param mockServerData
 * @param mockDaoImplementation
 */
function getCustomersModelInstance(
    mockServerData: IServerData,
    mockDaoImplementation = {
        createCustomer: jest.fn(),
        fetchCustomerByCustomerId: jest.fn(),
        fetchAllCustomers: jest.fn(),
        updateCustomer: jest.fn(),
        deleteCustomerById: jest.fn(),
    } as any
) {
    const customersDao = jest.fn().mockImplementation(() => {
        return mockDaoImplementation;
    });
    jest.mock(
        '../../../src/db/postgres/daos/customersDao/customersDao',
        () => ({
            CustomersDao: customersDao,
        })
    );

    // tslint:disable-next-line: variable-name
    const CustomersModel = require('../../../src/models/customersModel');
    const customersModelInstance = new CustomersModel.CustomersModel(
        mockServerData
    );

    return { customersDao, customersModelInstance };
}

describe('accountsModel', () => {
    const tx: IPostgresTask = {} as any;

    const daoResponse: ICustomer = {
        customerId: mockCustomer.customerId,
        firstName: mockCustomer.firstName,
        lastName: mockCustomer.lastName,
        phoneNumber: mockCustomer.phoneNumber,
        createdAt: mockCustomer.createdAt,
    };

    const dbResponseArray = [
        { ...daoResponse },
        { ...daoResponse },
        { ...daoResponse },
    ];
    dbResponseArray[0].customerId += '_1';
    dbResponseArray[1].customerId += '_2';
    dbResponseArray[2].customerId += '_3';

    const mockCustomerArray = [
        { ...mockCustomer },
        { ...mockCustomer },
        { ...mockCustomer },
    ];
    mockCustomerArray[0].customerId += '_1';
    mockCustomerArray[1].customerId += '_2';
    mockCustomerArray[2].customerId += '_3';

    const stubbedLogger = jest.fn().mockName('mockedLogger');
    const logger = {
        getLogger: jest.fn().mockName('mockedLoggerFactory').mockReturnValue({
            error: stubbedLogger,
            info: stubbedLogger,
            warn: stubbedLogger,
        }),
    };

    const mockServerData: IServerData = ({
        databaseClient: ({
            readTaskInAnyInstance: jest
                .fn()
                .mockName('mockReadTaskInAnyInstance')
                .mockImplementation((callback: MeasuredTaskCallbackFn<any>) =>
                    callback(tx)
                ),
            readTaskInPrimaryInstanceIfNotFoundInReplica: jest
                .fn()
                .mockName('mockReadTaskInPrimaryInstanceIfNotFoundInReplica')
                .mockImplementation((callback: MeasuredTaskCallbackFn<any>) =>
                    callback(tx)
                ),
            writeTaskInPrimaryInstance: jest
                .fn()
                .mockName('mockwriteTaskInPrimaryInstance')
                .mockImplementation((callback: MeasuredTaskCallbackFn<any>) =>
                    callback(tx)
                ),
        } as any) as PostgresClient,
        signatureKey: 'signatureKey',
    } as unknown) as IServerData;

    jest.mock('../../../src/Globals', () => ({
        Globals: {
            LoggerFactory: logger,
            getServiceToken: jest.fn().mockReturnValue('service token'),
        },
    }));

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('createCustomer', () => {
        const createCustomerRequestBody: ICreateCustomerRequestBody = {
            firstName: mockCustomer.firstName,
            lastName: mockCustomer.firstName,
            phoneNumber: mockCustomer.phoneNumber,
        };

        const ctx: IDistributedContext = {
            ['prop']: 'any',
            clientUuid: 'mockedClientUuid',
        };

        it('should create a customer in the database through the Dao', async () => {
            const createCustomerMock = jest.fn().mockResolvedValue(daoResponse);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    createCustomer: createCustomerMock,
                }
            );
            const result: ICustomer = await customersModelInstance.createCustomer(
                ctx,
                createCustomerRequestBody
            );
            expect(result).toEqual(mockCustomer);
        });

        it('should throw ConflictError if the error returned is constriant violation', async () => {
            const errorResp = new ConflictError(customerAlreadyExistError());
            const createCustomerMock = jest.fn().mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    createCustomer: createCustomerMock,
                }
            );
            try {
                await customersModelInstance.createCustomer(
                    ctx,
                    createCustomerRequestBody
                );
            } catch (err) {
                expect(err.name).toBe('ConflictError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                expect(err.message).toBe(customerAlreadyExistError());
            }
        });

        it('should bubble up any error that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            const createCustomerMock = jest.fn().mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    createCustomer: createCustomerMock,
                }
            );
            try {
                await customersModelInstance.createCustomer(
                    ctx,
                    createCustomerRequestBody
                );
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
        });
    });

    describe('fetchCustomerById', () => {
        const getCustomerByIdRequestBody: IGetCustomerByIdRequestBody = {
            customerId: mockCustomer.customerId,
        };

        const ctx: IDistributedContext = {
            ['prop']: 'any',
            clientUuid: 'mockedClientUuid',
        };

        it('should fetch a customer in from the database that matches the customer id', async () => {
            const fetchCustomerByCustomerIdMock = jest
                .fn()
                .mockResolvedValue(daoResponse);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    fetchCustomerByCustomerId: fetchCustomerByCustomerIdMock,
                }
            );
            const result: ICustomer = await customersModelInstance.fetchCustomerById(
                ctx,
                getCustomerByIdRequestBody
            );
            expect(result).toEqual(mockCustomer);
        });

        it('should throw NotFoundError if the Dao returns no results.', async () => {
            const errorResp = new NotFoundError();
            const fetchCustomerByCustomerIdMock = jest
                .fn()
                .mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    fetchCustomerByCustomerId: fetchCustomerByCustomerIdMock,
                }
            );
            try {
                await customersModelInstance.fetchCustomerById(
                    ctx,
                    getCustomerByIdRequestBody
                );
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                expect(err.statusCode).toEqual(StatusCodes.NOT_FOUND);
                return;
            }
        });

        it('should bubble up DAO NotFoundError that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            const fetchCustomerByCustomerIdMock = jest
                .fn()
                .mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    fetchCustomerByCustomerId: fetchCustomerByCustomerIdMock,
                }
            );
            try {
                await customersModelInstance.fetchCustomerById(
                    ctx,
                    getCustomerByIdRequestBody
                );
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
        });
    });

    describe('fetchAllCustomers', () => {
        const ctx: IDistributedContext = {
            ['prop']: 'any',
            clientUuid: 'mockedClientUuid',
        };

        it('should retunr an array of clients obtained through the Dao', async () => {
            const fetchAllCustomers = jest
                .fn()
                .mockResolvedValue(dbResponseArray);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    fetchAllCustomers: fetchAllCustomers,
                }
            );
            const result: Array<ICustomer> = await customersModelInstance.fetchAllCustomers(
                ctx
            );
            expect(result).toEqual(mockCustomerArray);
        });

        it('should not get an error from the Dao if there are no results', async () => {
            const noresultsDaoResponseArray: Array<IClient> = [];
            const mockEmptyArayResponse: Array<IClient> = [];

            const fetchAllCustomers = jest
                .fn()
                .mockResolvedValue(noresultsDaoResponseArray);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    fetchAllCustomers: fetchAllCustomers,
                }
            );
            try {
                const result: Array<ICustomer> = await customersModelInstance.fetchAllCustomers(
                    ctx
                );
                expect(result).toEqual(mockEmptyArayResponse);
                return;
            } catch (err) {
                expect('should enter').toBe(false);
            }
        });

        it('should bubble up DAO NotFoundError that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            const fetchAllCustomers = jest.fn().mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    fetchAllCustomers: fetchAllCustomers,
                }
            );
            try {
                await customersModelInstance.fetchAllCustomers(ctx);
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
        });
    });

    describe('updateCustomer', () => {
        const ctx: IDistributedContext = {
            ['prop']: 'any',
            clientUuid: 'mockedClientUuid',
        };

        const updateCustomerRequestBody: IUpdateCustomerRequestBody = {
            customerId: mockCustomer.customerId,
            firstName: mockCustomer.firstName,
            lastName: mockCustomer.firstName,
            phoneNumber: mockCustomer.phoneNumber,
        };

        it('should successfully update account through the Dao', async () => {
            const updateCustomer = jest.fn().mockResolvedValue(daoResponse);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    updateCustomer: updateCustomer,
                }
            );

            const result: ICustomer = await customersModelInstance.updateCustomerById(
                ctx,
                updateCustomerRequestBody
            );
            expect(result).toEqual(mockCustomer);
        });

        it('should throw NotFoundError if the Dao does not find the customer.', async () => {
            const errorResp = new NotFoundError();
            const updateCustomer = jest.fn().mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    updateCustomer: updateCustomer,
                }
            );
            try {
                await customersModelInstance.updateCustomerById(
                    ctx,
                    updateCustomerRequestBody
                );
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                expect(err.statusCode).toEqual(StatusCodes.NOT_FOUND);
                return;
            }
        });

        it('should bubble up DAO NotFoundError that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            const updateCustomer = jest.fn().mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    updateCustomer: updateCustomer,
                }
            );
            try {
                await customersModelInstance.updateCustomerById(
                    ctx,
                    updateCustomerRequestBody
                );
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
        });
    });

    describe('deleteCustomerById', () => {
        const ctx: IDistributedContext = {
            ['prop']: 'any',
            clientUuid: 'mockedClientUuid',
        };

        const deleteCustomerRequestBody: IDeleteCustomerRequestBody = {
            customerId: mockCustomer.customerId,
        };

        it('should successfully delete the client   through the Dao', async () => {
            const deleteCustomerById = jest.fn().mockResolvedValue(daoResponse);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    deleteCustomerById: deleteCustomerById,
                }
            );
            const result: ICustomer = await customersModelInstance.deleteCustomerById(
                ctx,
                deleteCustomerRequestBody
            );
            expect(result).toEqual(mockCustomer);
        });

        it('should throw NotFoundError if the Dao does not find the customer.', async () => {
            const errorResp = new NotFoundError();
            const deleteCustomerById = jest.fn().mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    deleteCustomerById: deleteCustomerById,
                }
            );
            try {
                await customersModelInstance.deleteCustomerById(
                    ctx,
                    deleteCustomerRequestBody
                );
            } catch (err) {
                expect(err).isPrototypeOf('NotFoundError');
                expect(err.hasOwnProperty('statusCode')).toBeTruthy();
                expect(err.statusCode).toEqual(StatusCodes.NOT_FOUND);
                return;
            }
        });

        it('should bubble up DAO NotFoundError that is not wrapped by ServiceRequestError', async () => {
            const errorResp = new Error('Unknown Error');
            const deleteCustomerById = jest.fn().mockResolvedValue(errorResp);
            const { customersModelInstance } = getCustomersModelInstance(
                mockServerData,
                {
                    deleteCustomerById: deleteCustomerById,
                }
            );
            try {
                await customersModelInstance.deleteCustomerById(
                    ctx,
                    deleteCustomerRequestBody
                );
            } catch (err) {
                expect(err.message).toBe('Unknown Error');
                return;
            }
        });
    });
});
