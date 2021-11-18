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
// tslint:disable: no-any

import { IRequest } from '@hbo/hurley-loader';
import * as express from 'express';

export type AuthRequest = IRequest & { user?: any };

export type AuthRequestHandler = (
    request: AuthRequest,
    response: express.Response,
    next: express.NextFunction
) => void;
