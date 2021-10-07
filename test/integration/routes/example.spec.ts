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

describe('/example', () => {
    const serviceUrl = process.env.TEST_ENDPOINT || 'localhost:3000';

    it('should accept valid posts', () => {
        return supertest(serviceUrl)
            .post('/example/16?exampleQueryParam=prefixed-with-this')
            .send({ exampleBodyValue: 42 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(StatusCodes.ACCEPTED)
            .then((res) => {
                expect(res.text).toEqual('"The answer for 16 is 42"');
            });
    });

    describe('examples of what schema can check for', () => {
        it('should reject invalid query parameter that doesnt match pattern', () => {
            return supertest(serviceUrl)
                .post('/example/16?exampleQueryParam=trying-to-start-with-this')
                .send({ exampleBodyValue: 41 })
                .expect(StatusCodes.BAD_REQUEST);
        });

        it('should reject invalid body parameter type', () => {
            return supertest(serviceUrl)
                .post('/example/16?exampleQueryParam=prefixed-with-this')
                .send({ exampleBodyValue: '72' })
                .expect(StatusCodes.BAD_REQUEST);
        });

        it('should reject out of range body parameter type', () => {
            return supertest(serviceUrl)
                .post('/example/16?exampleQueryParam=prefixed-with-this')
                .send({ exampleBodyValue: 43 })
                .expect(StatusCodes.BAD_REQUEST);
        });

        it('should reject invalid path parameter schema', () => {
            return supertest(serviceUrl)
                .post('/example/sixteen?exampleQueryParam=prefixed-with-this')
                .send({ exampleBodyValue: 16 })
                .expect(StatusCodes.BAD_REQUEST);
        });

        it('should reject for missing required parameters', () => {
            return supertest(serviceUrl)
                .post('/example/sixteen')
                .send({ exampleBodyValue: 16 })
                .expect(StatusCodes.BAD_REQUEST);
        });
    });
});
