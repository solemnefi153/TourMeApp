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

import {
    getMaxLoadTestUserId,
    isMaxLoadTestEmail,
} from '@hbo/hurley-test-util';
import { v4 } from 'uuid'; // tslint:disable-next-line:no-var-requires
import { BadRequestError } from '../errors/requestErrors';

/**
 * Generate UUID and set it as hurleyAccountId for all the requests. For load test users,
 * IDs are created with specific email pattern. We need to create a hurleyAccountId for load test
 * that's recogizable.  So the logic is to take the suffix of the email, and put that
 * to an userId pattern for load test. DRE team has been using `hbomaxtest` prefix for their
 * loadtest user ids.  We'll use `hbomaxtestapi` prefix so that i) DRE can identify all the load
 * test users, and ii) also identify which ones are created via the API calls.
 * @param requestParams
 */
export function getHurleyAccountId(requestParams: { email?: string }): string {
    let hurleyAccountId: string;
    try {
        if (requestParams.email && isMaxLoadTestEmail(requestParams.email)) {
            hurleyAccountId = getMaxLoadTestUserId(requestParams.email);
        } else {
            hurleyAccountId = v4();
        }
        return hurleyAccountId;
    } catch (err) {
        // rethrow it as BadRequestError so that Castle returns 400
        throw new BadRequestError(err.message);
    }
}
