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
import { utils } from 'pg-promise';
import { IOopType } from '../../serviceTypes';

/**
 * convert all keys of an object from snake_case to camelCase
 * @param data Data object ot be camelized
 */
export function camelizeKeys(data: IOopType | undefined): void {
    if (!data) {
        return;
    }

    for (const prop of Object.getOwnPropertyNames(data)) {
        const camel = camelize(prop);
        if (!(camel in data)) {
            data[camel] = data[prop];
            delete data[prop];
        }
    }
}

/**
 * Convert a string from snake_case to camelCase
 * @param str String in snake case
 */
export function camelize(str: string): string {
    return utils.camelize(str);
}

/**
 * Create placeholder string for a list of columns
 * @param columns list of columns
 * @param requestBody object of type object
 */
export function createPlaceholderString(
    columns: string[],
    requestBody?: object
): string {
    if (!requestBody) {
        return columns.map((column: string) => `\${${column}}`).join(', ');
    }
    return columns
        .filter(
            (column: string) =>
                Object.keys(requestBody).indexOf(camelize(column)) > -1
        )
        .map((column: string) => `${column}=\${${camelize(column)}}`)
        .join(', ');
}
