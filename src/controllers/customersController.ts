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
    ICreateCustomerRequestBody,
    IGetCustomerByIdRequestBody,
    IUpdateCustomerRequestBody,
    IDeleteCustomerRequestBody,
    ICustomersControllerResponse,
} from '../interfaces/Customer';
import { CustomersModel } from '../models/customersModel';
import { IServerData } from '../serviceTypes';
import tryCatchController from './tryCatchController';

export function customersController(
    serverData: IServerData
): ICustomersControllerResponse {
    const customersModel = new CustomersModel(serverData);

    return {
        createCustomer: tryCatchController((req) => {
            const createCustomerRequestBody: ICreateCustomerRequestBody = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
            };

            if (req.ctx === undefined) {
                req.ctx = {};
            }

            return customersModel.createCustomer(
                req.ctx,
                createCustomerRequestBody
            );
        }),

        fetchCustomerById: tryCatchController((req) => {
            const getCustomerByIdRequestBody: IGetCustomerByIdRequestBody = {
                customerId: req.params.customerId as string,
            };

            if (req.ctx === undefined) {
                req.ctx = {};
            }

            return customersModel.fetchCustomerById(
                req.ctx,
                getCustomerByIdRequestBody
            );
        }),

        fetchAllCustomers: tryCatchController((req) => {
            if (req.ctx === undefined) {
                req.ctx = {};
            }
            return customersModel.fetchAllCustomers(req.ctx);
        }),

        updateCustomer: tryCatchController((req) => {
            const getCustomerByIdRequestBody: IUpdateCustomerRequestBody = {
                customerId: req.params.customerId,
            };

            if (req.body.lastName !== undefined) {
                getCustomerByIdRequestBody.firstName = req.body.firstName;
            }

            if (req.body.firstName !== undefined) {
                getCustomerByIdRequestBody.firstName = req.body.firstName;
            }

            if (req.body.phoneNumber !== undefined) {
                getCustomerByIdRequestBody.phoneNumber = req.body.phoneNumber;
            }

            if (req.ctx === undefined) {
                req.ctx = {};
            }

            return customersModel.updateCustomerById(
                req.ctx,
                getCustomerByIdRequestBody
            );
        }),

        deleteCustomerById: tryCatchController((req) => {
            const deleteCustomerByIdRequestBody: IDeleteCustomerRequestBody = {
                customerId: req.params.customerId,
            };

            if (req.ctx === undefined) {
                req.ctx = {};
            }

            return customersModel.deleteCustomerById(
                req.ctx,
                deleteCustomerByIdRequestBody
            );
        }),
    };
}
