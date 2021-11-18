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

import { IOopType } from '../../../src/serviceTypes';

describe('userId', () => {
    const FAKE_GENERATED_UUID = 'mock-uuid';

    beforeEach(() => {
        jest.mock('uuid', () => {
            const v4 = () => {
                return FAKE_GENERATED_UUID;
            };
            return { v4 };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('getHurleyAccountId', () => {
        [
            {
                expectedId: FAKE_GENERATED_UUID,
                name: 'generate new uuidv4',
                params: {
                    email: 'foobarbar12321+98789@gmail.com',
                },
            },
            {
                expectedId: 'hbomaxtestapi1234512345123_255155123',
                name: 'generate the hbomax loadtest user id',
                params: {
                    email:
                        'loadTestWarnerMedia+1234512345123+255155123@gmail.com',
                },
            },
        ].forEach((testCase) => {
            it(`should ${testCase.name}`, () => {
                // module under test
                const {
                    getHurleyAccountId,
                }: IOopType = require('../../../src/util/userId');
                const hurleyAccountId = getHurleyAccountId(testCase.params);
                expect(hurleyAccountId).toEqual(testCase.expectedId);
            });
        });

        it('should throw if load test email is too long', () => {
            const {
                getHurleyAccountId,
            }: IOopType = require('../../../src/util/userId');
            expect(() => {
                getHurleyAccountId({
                    email:
                        'loadTestWarnerMedia+12321+987823423423423421@gmail.com',
                });
            }).toThrow('load test email length too long');
        });
    });
});
