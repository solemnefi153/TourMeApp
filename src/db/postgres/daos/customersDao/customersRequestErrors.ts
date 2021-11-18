/*
 * Copyright (c) 2021 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */
export const customerAlreadyExistError = () => {
    return 'Customer already exist in the database';
};

export const customerWithIdWasNotFoundError = (customerId: string) => {
    return `'Customer not found using fetchParam: ${customerId}`;
};