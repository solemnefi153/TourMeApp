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

import { ILogger } from '@hbo/hurley-api-logging';
import { IDistributedContext } from '@hbo/hurley-loader';

export function logErrorWithReducedStack(
    logger: ILogger,
    eventName: string,
    err: Error,
    ctx: IDistributedContext | undefined,
    addFields?: object
): void {
    const errorMessage = err.message || err.toString();
    let errorStack;
    if (err.stack) {
        errorStack = err.stack.split('\n');
    }
    logger.error({
        ctx,
        errStack: errorStack,
        error: errorMessage,
        event: eventName,
        ...addFields,
    });
}

export function logWarnWithReducedStack(
    logger: ILogger,
    eventName: string,
    err: Error,
    ctx: IDistributedContext | undefined,
    addFields?: object
): void {
    const errorMessage = err.message || err.toString();
    let errorStack;
    if (err.stack) {
        errorStack = err.stack.split('\n');
    }
    logger.warn({
        ctx,
        errStack: errorStack,
        error: errorMessage,
        event: eventName,
        ...addFields,
    });
}
