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

import jwt_decode from 'jwt-decode';
import request from 'request';

async function buildTokenForAutomatedTest(
    parameters: object
): Promise<unknown> {
    const tokensUri =
        'https://tokens.staging.hurley.hbo.com/devTools/buildTokenForAutomatedTest?testParameters=' +
        JSON.stringify(parameters);

    return new Promise((resolve, reject) => {
        request(
            { method: 'GET', url: tokensUri },
            (err, _response, responseBody) => {
                if (err) {
                    reject(err);
                }
                try {
                    resolve(JSON.parse(responseBody).encryptedToken);
                } catch (e) {
                    reject(e);
                }
            }
        );
    });
}

export function extractUserInfo(token: string): string {
    const decodedToken = jwt_decode(token) as any; // tslint:disable-line:no-any
    return JSON.stringify(decodedToken.payload?.tokenPropertyData);
}

export async function generateAdminToken(
    environment: string,
    userId: string,
    permissions: number[],
    accountId?: string,
    platformTenantCode?: string,
    productCode?: string
): Promise<unknown> {
    return buildTokenForAutomatedTest({
        additionalTokenPropertyData: {
            custSvcAgentRole: 'devToolsRole',
            custSvcAgentUserId: 'devToolsUserId',
            custSvcOrgId: 'devTools',
            hurleyAccountId: accountId || 'mockAccountId',
            overrideDescription: 'castle-integration-test',
            permissions,
            platformTenantCode: platformTenantCode || 'hboDirect',
            productCode: productCode || 'hboNow',
            userId,
        },
        clientId: '5a22792a-56cc-4794-b41b-2835e8434536',
        environment,
        testDescription: 'castle-integration-test',
    });
}

export async function generateRegistrationOnlyToken(
    environment: string,
    clientId: string,
    receiptData: object
): Promise<unknown> {
    return buildTokenForAutomatedTest({
        additionalTokenPropertyData: {
            overrideDescription: 'castle-integration-test',
            permissions: [9],
            receiptData,
        },
        clientId,
        environment,
        testDescription: 'castle-integration-test',
    });
}
