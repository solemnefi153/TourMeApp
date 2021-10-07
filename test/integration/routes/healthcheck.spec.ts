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

import { StatusCodes } from '@hbo/hurley-http';
import * as supertest from 'supertest';

describe('/healthcheck', () => {
    const serviceUrl = process.env.TEST_ENDPOINT || 'localhost:3000';

    it('should report OK', () => {
        return supertest(serviceUrl)
            .get('/healthcheck')
            .expect(StatusCodes.SUCCESS);
    });
});
