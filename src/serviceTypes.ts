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

import { PostgresClient } from '@hbo/hurley-postgres';

/**
 * Use to replace type: any
 * see: https://wiki.hbo.com/x/cZBHBg
 */
export interface IOopType {
    // tslint:disable-next-line:no-any
    [key: string]: any;
}

/**
 * @interface IServerData stores the databaseClient initiated and passed to the routes
 */
export interface IServerData {
    databaseClient: PostgresClient;
    // signatureKey: string;
    // credentialsSignature : string;
    // chameleonSignature : string;
}
