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

import { AuthRequestHandler } from '../util/authUser';

/**
 * An interface for an Customer creation request
 * @interface ICreateCustomerRequestBody
 */
export interface ICreateCustomerRequestBody {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

/**
 * An interface for an Customer fethc request by id
 * @interface IGetCustomerByIdRequestBody
 */
export interface IGetCustomerByIdRequestBody {
    customerId: string;
}

/**
 * An interface for an Customer update request by id
 * @interface IUpdateCustomerRequestBody
 */
export interface IUpdateCustomerRequestBody {
    customerId: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

/**
 * An interface for an Customer delete request by id
 * @interface IDeleteCustomerRequestBody
 */
export interface IDeleteCustomerRequestBody {
    customerId: string;
}

/**
 * An interface for an Customer
 * @interface ICustomer
 */
export interface ICustomer {
    customerId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: Date;
}

/**
 * CustomersController response type.
 */
export interface ICustomersControllerResponse {
    createCustomer: AuthRequestHandler;
    fetchCustomerById: AuthRequestHandler;
    fetchAllCustomers: AuthRequestHandler;
    updateCustomer: AuthRequestHandler;
    deleteCustomerById: AuthRequestHandler;
}
