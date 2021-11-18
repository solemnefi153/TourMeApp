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

import { IDistributedContext } from '@hbo/hurley-loader';
import {
    DefaultQueryMetricNameGenerator,
    DefaultQueryOperationMetricNameGenerator,
    IPostgresTask,
    NoResultsError,
    PostgresClient,
    QueryOperationMetricType,
} from '@hbo/hurley-postgres';
import { logErrorWithReducedStack } from '../../../../errors/logErrorWithReducedStack';
import {
    ConflictError,
    isConstraintViolationError,
    isNotFoundError,
    NotFoundError,
} from '../../../../errors/requestErrors';
import { Globals, IGlobals } from '../../../../Globals';
import {
    ICreateCustomerRequestBody,
    IGetCustomerByIdRequestBody,
    IUpdateCustomerRequestBody,
    IDeleteCustomerRequestBody,
    ICustomer,
} from '../../../../interfaces/Customer';
import {
    CREATE_CUSTOMER_SQL,
    FETCH_ALL_CUSTOMERS_SQL,
    FETCH_CUSTOMER_BY_ID_SQL,
    DELTE_CUSTOMER_BY_ID_SQL,
    generateUpdateCustomerSqlStatement,
    customerUpdateColumns,
} from './customersQueries';
import { camelizeKeys } from '../../../utils/sqlUtils';
import {
    customerAlreadyExistError,
    customerWithIdWasNotFoundError,
} from './customersRequestErrors';

const { LoggerFactory }: IGlobals = Globals;
const logger = LoggerFactory.getLogger('CustomersDao');

/**
 * @class CustomersDao, set of methods to write and read data from the Customers table.
 */
export class CustomersDao {
    private _postgresClient: PostgresClient;

    /**
     * @param postgresClient
     */
    constructor(postgresClient: PostgresClient) {
        this._postgresClient = postgresClient;
    }

    /**
     * Adds a new customer to the  Customers table in the database
     * @param ctx
     * @param createCustomerRequestBody
     */
    public async createCustomer(
        ctx: IDistributedContext,
        createCustomerRequestBody: ICreateCustomerRequestBody
    ): Promise<ICustomer> {
        try {
            const newCustomer = await this._postgresClient.writeTaskInPrimaryInstance(
                async (task: IPostgresTask) => {
                    return await this.createCustomerTask(
                        createCustomerRequestBody,
                        task
                    );
                },
                new DefaultQueryMetricNameGenerator({
                    context: 'customersDao',
                    descriptor: 'createCustomer',
                }),
                ctx
            );

            logger.info({
                ctx,
                event: 'customersDao.createCustomer.success',
                customerId: newCustomer.customerId,
                firstName: newCustomer.firstName,
                lastName: newCustomer.lastName,
                phoneNumber: newCustomer.phoneNumber,
            });

            return newCustomer;
        } catch (err) {
            logErrorWithReducedStack(
                logger,
                'customersDao.createCustomer.failed',
                err as Error,
                ctx
            );
            if (isConstraintViolationError(err as Error)) {
                throw new ConflictError(customerAlreadyExistError());
            }
            throw err;
        }
    }

    private async createCustomerTask(
        createCustomerRequestBody: ICreateCustomerRequestBody,
        task: IPostgresTask
    ): Promise<ICustomer> {
        const result = await task.one(
            new DefaultQueryOperationMetricNameGenerator({
                descriptor: 'customersDao',
                operation: QueryOperationMetricType.create,
            }),
            CREATE_CUSTOMER_SQL,
            createCustomerRequestBody
        );
        camelizeKeys(result);
        return result;
    }

    /**
     * Gets the information of all customers sotored in the database
     * @param ctx
     */
    public async fetchAllCustomers(
        ctx: IDistributedContext
    ): Promise<Array<ICustomer>> {
        try {
            const savedCustomers = await this._postgresClient.readTaskInAnyInstance(
                async (task: IPostgresTask) => {
                    return await this.fetchAllCustomersTask(task);
                },
                new DefaultQueryMetricNameGenerator({
                    context: 'customersDao',
                    descriptor: 'fetchAllCustomers',
                }),
                ctx
            );

            logger.info({
                ctx,
                event: 'customersDao.fetchAllCustomers.success',
            });

            return savedCustomers;
        } catch (err) {
            logErrorWithReducedStack(
                logger,
                'customersDao.fetchAllCustomers.failed',
                err as Error,
                ctx
            );
            throw err;
        }
    }

    private async fetchAllCustomersTask(
        task: IPostgresTask
    ): Promise<Array<ICustomer>> {
        const result = await task.manyOrNone(
            new DefaultQueryOperationMetricNameGenerator({
                descriptor: 'CustomersDao',
                operation: QueryOperationMetricType.get,
            }),

            FETCH_ALL_CUSTOMERS_SQL
        );

        try {
            if (result.length !== undefined) {
                for (let i = 0; i < result.length; ++i) {
                    camelizeKeys(result[i]);
                }
            }
        } catch (err) {
            //do nothing, just retun the result as is
        }

        return result;
    }

    /**
     * Gets the information of a customer stored in the database
     * @param ctx
     * @param getCustomerByIdRequestBody
     */
    public async fetchCustomerByCustomerId(
        ctx: IDistributedContext,
        getCustomerByIdRequestBody: IGetCustomerByIdRequestBody
    ): Promise<ICustomer> {
        try {
            const existingCustomer = await this._postgresClient.readTaskInAnyInstance(
                async (task: IPostgresTask) => {
                    return await this.fetchCustomerByIdTask(
                        getCustomerByIdRequestBody,
                        task
                    );
                },
                new DefaultQueryMetricNameGenerator({
                    context: 'customersDao',
                    descriptor: 'fetchCustomerByCustomerId',
                }),
                ctx
            );

            if (!existingCustomer) {
                throw new NoResultsError(
                    customerWithIdWasNotFoundError(
                        getCustomerByIdRequestBody.customerId
                    ),
                    'NoResultsError'
                );
            }

            logger.info({
                ctx,
                event: 'customersDao.fetchCustomerByCustomerId.success',
                customerId: existingCustomer.customerId,
                firstName: existingCustomer.firstName,
                lastName: existingCustomer.lastName,
                phoneNumber: existingCustomer.phoneNumber,
            });

            return existingCustomer;
        } catch (err) {
            logErrorWithReducedStack(
                logger,
                'CustomersDao.fetchCustomerByCustomerId.failed',
                err as Error,
                ctx
            );
            if (isNotFoundError(err as Error)) {
                throw new NotFoundError(
                    customerWithIdWasNotFoundError(
                        getCustomerByIdRequestBody.customerId
                    )
                );
            }
            throw err;
        }
    }

    private async fetchCustomerByIdTask(
        getCustomerByIdRequestBody: IGetCustomerByIdRequestBody,
        task: IPostgresTask
    ): Promise<ICustomer | null> {
        const result: ICustomer | null = await task.oneOrNone(
            new DefaultQueryOperationMetricNameGenerator({
                descriptor: 'customersDao',
                operation: QueryOperationMetricType.get,
            }),
            FETCH_CUSTOMER_BY_ID_SQL,
            getCustomerByIdRequestBody
        );
        if (result) {
            camelizeKeys(result);
        }
        return result;
    }

    /**
     * Update the database Customers table to the data columns in updateCustomerRequestBody
     * @param ctx
     * @param updateCustomerRequestBody
     */
    public async updateCustomer(
        ctx: IDistributedContext,
        updateCustomerRequestBody: IUpdateCustomerRequestBody
    ): Promise<ICustomer> {
        try {
            const updatedCustomer = await this._postgresClient.writeTaskInPrimaryInstance(
                async (task: IPostgresTask) => {
                    return await this.updateCustomerTask(
                        updateCustomerRequestBody,
                        task
                    );
                },
                new DefaultQueryMetricNameGenerator({
                    context: 'customersDao',
                    descriptor: 'updateCustomer',
                }),
                ctx
            );

            logger.info({
                ctx,
                event: 'customersDao.updateCustomer.success',
                customerId: updatedCustomer.customerId,
                firstName: updatedCustomer.firstName,
                lastName: updatedCustomer.lastName,
                phoneNumber: updatedCustomer.phoneNumber,
            });

            return updatedCustomer;
        } catch (err) {
            logErrorWithReducedStack(
                logger,
                'customersDao.updateCustomer.failed',
                err as Error,
                ctx
            );
            if (isNotFoundError(err as Error)) {
                const { message } = err as Error;
                throw new NotFoundError(message);
            }
            if (isConstraintViolationError(err as Error)) {
                throw new ConflictError(
                    'Some values are already used by another Customer'
                );
            }
            throw err;
        }
    }

    private async updateCustomerTask(
        updateCustomerRequestBody: IUpdateCustomerRequestBody,
        task: IPostgresTask
    ): Promise<ICustomer> {
        const query = generateUpdateCustomerSqlStatement(
            customerUpdateColumns,
            updateCustomerRequestBody
        );

        const result = await task.one(
            new DefaultQueryOperationMetricNameGenerator({
                descriptor: 'CustomersDao',
                operation: QueryOperationMetricType.update,
            }),
            generateUpdateCustomerSqlStatement(
                customerUpdateColumns,
                updateCustomerRequestBody
            ),
            updateCustomerRequestBody
        );
        camelizeKeys(result);
        return result;
    }

    /**
     * Delete from  the database Customers table the customer that matches the infomation in  deleteCustomerByIdRequestBody
     * @param ctx
     * @param deleteCustomerRequestBody
     */
    public async deleteCustomerById(
        ctx: IDistributedContext,
        deleteCustomerRequestBody: IDeleteCustomerRequestBody
    ): Promise<ICustomer> {
        try {
            const deletedCustomer = await this._postgresClient.writeTaskInPrimaryInstance(
                async (task: IPostgresTask) => {
                    return await this.deleteCustomerByIdTask(
                        deleteCustomerRequestBody,
                        task
                    );
                },
                new DefaultQueryMetricNameGenerator({
                    context: 'customersDao',
                    descriptor: 'deleteCustomerById',
                }),
                ctx
            );

            if (!deletedCustomer) {
                throw new NoResultsError(
                    customerWithIdWasNotFoundError(
                        deleteCustomerRequestBody.customerId
                    ),
                    'NoResultsError'
                );
            }

            logger.info({
                ctx,
                event: 'customersDao.deleteCustomerById.success',
                customerId: deletedCustomer.customerId,
                firstName: deletedCustomer.firstName,
                lastName: deletedCustomer.lastName,
                phoneNumber: deletedCustomer.phoneNumber,
            });
            return deletedCustomer;
        } catch (err) {
            logErrorWithReducedStack(
                logger,
                'customersDao.deleteCustomerById.failed',
                err as Error,
                ctx
            );

            if (isNotFoundError(err as Error)) {
                throw new NotFoundError(
                    customerWithIdWasNotFoundError(
                        deleteCustomerRequestBody.customerId
                    )
                );
            }
            throw err;
        }
    }

    private async deleteCustomerByIdTask(
        deleteCustomerRequestBody: IDeleteCustomerRequestBody,
        task: IPostgresTask
    ): Promise<ICustomer> {
        const result = await task.oneOrNone(
            new DefaultQueryOperationMetricNameGenerator({
                descriptor: 'customersDao',
                operation: QueryOperationMetricType.delete,
            }),
            DELTE_CUSTOMER_BY_ID_SQL,
            deleteCustomerRequestBody
        );

        camelizeKeys(result);
        return result as ICustomer;
    }
}
