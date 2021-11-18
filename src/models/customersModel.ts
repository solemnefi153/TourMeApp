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
import { PostgresClient } from '@hbo/hurley-postgres';
import { CustomersDao } from '../db/postgres/daos/customersDao/customersDao';

import { Globals, IGlobals } from '../Globals';
import {
    ICreateCustomerRequestBody,
    IGetCustomerByIdRequestBody,
    IUpdateCustomerRequestBody,
    IDeleteCustomerRequestBody,
    ICustomer,
} from '../interfaces/Customer';

import { IServerData } from '../serviceTypes';

const { LoggerFactory }: IGlobals = Globals;
const logger = LoggerFactory.getLogger('customersModel');

export class CustomersModel {
    private _databaseClient: PostgresClient;
    private _customersDao: CustomersDao;

    /**
     * @param serverData
     */
    constructor(serverData: IServerData) {
        this._databaseClient = serverData.databaseClient;
        this._customersDao = new CustomersDao(this._databaseClient);
    }

    /**
     * Create a customer  if it doesn't exist already in the database
     * @param ctx
     * @param params
     */
    public async createCustomer(
        ctx: IDistributedContext,
        requestBody: ICreateCustomerRequestBody
    ): Promise<ICustomer> {
        return await this._customersDao.createCustomer(ctx, requestBody);
    }

    /**
     * Fetch a customer by customer id.
     * @param ctx
     * @param requestBody
     */
    public async fetchCustomerById(
        /* istanbul ignore next */
        ctx: IDistributedContext = {},
        requestBody: IGetCustomerByIdRequestBody
    ): Promise<ICustomer> {
        return await this._customersDao.fetchCustomerByCustomerId(
            ctx,
            requestBody
        );
    }

    /**
     * Fetch all the customers in the database
     * @param ctx
     * @param requestBody
     */
    public async fetchAllCustomers(
        /* istanbul ignore next */
        ctx: IDistributedContext = {}
    ): Promise<Array<ICustomer>> {
        return await this._customersDao.fetchAllCustomers(ctx);
    }

    /**
     * Update customer in the database that matches a customer id
     * @param ctx
     * @param requestBody
     */
    public async updateCustomerById(
        /* istanbul ignore next */
        ctx: IDistributedContext = {},
        requestBody: IUpdateCustomerRequestBody
    ): Promise<ICustomer> {
        return await this._customersDao.updateCustomer(ctx, requestBody);
    }

    /**
     * Delete customer in the database that matches a customer id
     * @param ctx
     * @param requestBody
     */
    public async deleteCustomerById(
        /* istanbul ignore next */
        ctx: IDistributedContext = {},
        requestBody: IDeleteCustomerRequestBody
    ): Promise<ICustomer> {
        return await this._customersDao.deleteCustomerById(ctx, requestBody);
    }
}
