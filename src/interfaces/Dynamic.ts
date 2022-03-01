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

export enum DynamicResultTypes {
    NONE,
    ONE,
    ONE_OR_NONE,
    MANY_OR_NONE,
    MANY,
    BATCH
}


/**
 * An interface for an Dynamic request
 * @interface IDynamicRequestParameters
 */
export interface IDynamicRequestParameters {
    queryPlaceholder: string;
    queryParameters: object;
    transaction: boolean;
    resultType: DynamicResultTypes;
}

/**
 * An interface for an Dynamic request response
 * @interface IDynamicResponse
 */
export interface IDynamicResponse {
    results: any
}

/**
 * Dynamic Controller response type.
 */
export interface IDynamicControllerResponse {
    executeDynamicRequest: AuthRequestHandler;
}
