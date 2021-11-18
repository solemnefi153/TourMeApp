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

import * as sqlUtils from '../../../../src/db/utils/sqlUtils';

describe('SqlUtils', () => {
    describe('createPlaceHolderString', () => {
        it('should create placeholder string with columns', () => {
            const placeholder = sqlUtils.createPlaceholderString([
                'one',
                'two',
                'three',
            ]);
            expect(placeholder).toEqual('${one}, ${two}, ${three}');
        });

        it('should return empty string when column list is empty', () => {
            const placeholder = sqlUtils.createPlaceholderString([]);
            expect(placeholder).toEqual('');
        });

        it('should return placeholder string when requestBody is provided', () => {
            const placeholder = sqlUtils.createPlaceholderString(
                ['first_name', 'last_name', 'email'],
                {
                    firstName: 'mockFirstName',
                    lastName: 'mockLastName',
                } as object
            );
            expect(placeholder).toEqual(
                'first_name=${firstName}, last_name=${lastName}'
            );
        });
    });

    describe('camelizeKeys', () => {
        it('should camelize object keys', () => {
            const data = {
                age: 10,
                first_name: 'First',
                last_name: 'Last',
            };
            sqlUtils.camelizeKeys(data);
            expect(data).toStrictEqual({
                age: 10,
                firstName: 'First',
                lastName: 'Last',
            });
        });

        it('should return do nothing when object is empty', () => {
            const data = {};
            sqlUtils.camelizeKeys(data);
            expect(data).toStrictEqual({});
        });

        it('should return do nothing when object is undefined', () => {
            const data = undefined;
            sqlUtils.camelizeKeys(data);
            expect(data).toBeUndefined();
        });
    });

    describe('camelize', () => {
        it('should camelize snake case string', () => {
            expect(sqlUtils.camelize('first_name')).toEqual('firstName');
        });

        it('should not modify strings without underscore', () => {
            expect(sqlUtils.camelize('age')).toEqual('age');
            expect(sqlUtils.camelize('firstName')).toEqual('firstName');
        });
    });
});
