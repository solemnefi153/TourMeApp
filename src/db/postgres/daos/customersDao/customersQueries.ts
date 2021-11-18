/**
 * Copyright (c) 2020 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

import { format } from 'util';
import { IUpdateCustomerRequestBody } from '../../../../interfaces/Customer';
import { camelize, createPlaceholderString } from '../../../utils/sqlUtils';

export enum DbTableName {
    CUSTOMERS = 'customers',
}

/**
 * customers Table Columns
 */
export enum CustomersTableColumnName {
    CUSTOMER_ID = 'customer_id',
    FIRST_NAME = 'first_name',
    LAST_NAME = 'last_name',
    PHONE_NUMBER = 'phone_number',
    CREATED_AT = 'created_at',
}

/**
 * Columns for queries
 */

export const customerInsertColumns = [
    CustomersTableColumnName.FIRST_NAME,
    CustomersTableColumnName.LAST_NAME,
    CustomersTableColumnName.PHONE_NUMBER,
];

export const customerFetchColumns = [
    CustomersTableColumnName.CUSTOMER_ID,
    CustomersTableColumnName.FIRST_NAME,
    CustomersTableColumnName.LAST_NAME,
    CustomersTableColumnName.PHONE_NUMBER,
    CustomersTableColumnName.CREATED_AT,
];

export const customerUpdateColumns = [
    CustomersTableColumnName.FIRST_NAME,
    CustomersTableColumnName.LAST_NAME,
    CustomersTableColumnName.PHONE_NUMBER,
];

export const customerDeleleteColumns = [CustomersTableColumnName.CUSTOMER_ID];

/**
 * Queries
 */

export const CREATE_CUSTOMER_SQL = format(
    'INSERT INTO ' + DbTableName.CUSTOMERS + ' (%s) VALUES (%s) RETURNING %s ',
    customerInsertColumns.join(', '),
    createPlaceholderString(customerInsertColumns.map((col) => camelize(col))),
    customerFetchColumns.join(', ')
);

export const FETCH_ALL_CUSTOMERS_SQL = format(
    'SELECT %s FROM ' + DbTableName.CUSTOMERS,
    customerFetchColumns.join(', ')
);

export const FETCH_CUSTOMER_BY_ID_SQL = format(
    'SELECT %s FROM ' + DbTableName.CUSTOMERS + ` WHERE customer_id = %s`,
    customerFetchColumns.join(', '),
    createPlaceholderString(['customerId'])
);

export const DELTE_CUSTOMER_BY_ID_SQL = format(
    'DELETE FROM ' +
        DbTableName.CUSTOMERS +
        '  WHERE customer_id = %s RETURNING %s',
    createPlaceholderString(['customerId']),
    customerFetchColumns.join(', ')
);

export function generateUpdateCustomerSqlStatement(
    cols: string[],
    body: IUpdateCustomerRequestBody
): string {
    return format(
        'UPDATE ' +
            DbTableName.CUSTOMERS +
            ' SET %s WHERE customer_id = %s RETURNING %s',
        createPlaceholderString(cols, body),
        createPlaceholderString(['customerId']),
        customerFetchColumns.join(', ')
    );
}
