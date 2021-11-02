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
 // tslint:disable no-console
// tslint:disable non-literal-fs-path

import * as fs from 'fs';
import * as path from 'path';

exports.up = (db: any, callback: any) => {
    const filePath = path.join(
        __dirname,
        '/sqls/20211012000000-initial-schema-up.sql',
    );
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return callback(err);
        }
        console.log(`Loaded migration SQL from ${filePath}:`);
        console.log(data);
        
        db.runSql(data, (err2: any) => {
            if (err2) {
                return callback(err2);
            }
            return callback();
        });
    });
};

exports.down = (db: any, callback: any) => {
    console.log('down not supported!');
};
