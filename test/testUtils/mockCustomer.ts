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

import { ICustomer } from '../../src/interfaces/Customer';
import { v4 } from 'uuid';

const mockCustomerId = v4();
const mockFirstName = 'Bruce';
const mockLastName = 'Wayne';
const mockPhoneNumber = '800-000-0000';
const mockCreatedAt = new Date();

export const mockCustomer: ICustomer = {
    customerId: mockCustomerId,

    firstName: mockFirstName,
    lastName: mockLastName,
    phoneNumber: mockPhoneNumber,
    createdAt: mockCreatedAt,
};
