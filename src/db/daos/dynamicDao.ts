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

import { IDistributedContext } from '@hbo/hurley-loader';
import { logErrorWithReducedStack } from '../../errors/logErrorWithReducedStack';
import { Globals, IGlobals } from '../../Globals';
import { camelizeKeys } from '../utils/sqlUtils';
import {
    DefaultQueryMetricNameGenerator,
    DefaultQueryOperationMetricNameGenerator,
    IPostgresTask,
    NoResultsError,
    PostgresClient,
    QueryOperationMetricType,
} from '@hbo/hurley-postgres';

import {
    IDynamicRequestParameters,
    IDynamicResponse
} from '../../interfaces/Dynamic';


const { LoggerFactory }: IGlobals = Globals;
const logger = LoggerFactory.getLogger('DynamicDao');

/**
 * @class DynamicDao, set of methods to write and read data from the databse dynamically.
 */
export class DynamicDao {
    private _postgresClient: PostgresClient;
    /**
     * @param postgresClient
     */
    constructor(postgresClient: PostgresClient) {
        this._postgresClient = postgresClient;
    }
    /**
     * Executes a dynamic request to the database
     * @param ctx
     * @param dynamicRequestBody
     */
    public async excecuteDynamicRequest(
        ctx: IDistributedContext,
        dynamicRequestBody: IDynamicRequestParameters
    ): Promise<IDynamicResponse> {
        try {

            let dynamicResponse: IDynamicResponse

            if (dynamicRequestBody.transaction) {
                dynamicResponse = await this._postgresClient.writeTaskInPrimaryInstance(
                    async (task: IPostgresTask) => {
                        return await this.excecuteDynamicRequestTask(
                            dynamicRequestBody,
                            task
                        );
                    },
                    new DefaultQueryMetricNameGenerator({
                        context: 'DynamicDao',
                        descriptor: 'excecuteDynamicRequest',
                    }),
                    ctx
                );
            }
            else {
                dynamicResponse = await this._postgresClient.readTaskInAnyInstance(
                    async (task: IPostgresTask) => {
                        return await this.excecuteDynamicRequestTask(
                            dynamicRequestBody,
                            task
                        );
                    },
                    new DefaultQueryMetricNameGenerator({
                        context: 'DynamicDao',
                        descriptor: 'excecuteDynamicRequest',
                    }),
                    ctx
                );
            }

            logger.info({
                ctx,
                event: 'DynamicsDao.createDynamic.success',
                ...dynamicRequestBody
            });

            return dynamicResponse;

        } catch (err) {
            logErrorWithReducedStack(
                logger,
                'DynamicDao.excecuteDynamicRequest.failed',
                err as Error,
                ctx
            );
            throw err;
        }
    }
    private async excecuteDynamicRequestTask(
        dynamicRequestBody: IDynamicRequestParameters,
        task: IPostgresTask
    ): Promise<IDynamicResponse> {
        let dbResponse: IDynamicResponse = { results: null }

        switch (dynamicRequestBody.resultType) {
            case 0: //"none"
            dbResponse.results = await task.none(
                    new DefaultQueryOperationMetricNameGenerator({
                        descriptor: 'DynamicDao',
                        operation: QueryOperationMetricType.get,
                    }),
                    dynamicRequestBody.queryPlaceholder,
                    dynamicRequestBody.queryParameters
                );
                break;
            case 1: //"one"
                dbResponse.results = await task.one(
                    new DefaultQueryOperationMetricNameGenerator({
                        descriptor: 'DynamicDao',
                        operation: QueryOperationMetricType.get,
                    }),
                    dynamicRequestBody.queryPlaceholder,
                    dynamicRequestBody.queryParameters
                );
                camelizeKeys(dbResponse.results);
                break;
            case 2: //"oneOrNone"
                dbResponse.results = await task.oneOrNone(
                    new DefaultQueryOperationMetricNameGenerator({
                        descriptor: 'DynamicDao',
                        operation: QueryOperationMetricType.get,
                    }),
                    dynamicRequestBody.queryPlaceholder,
                    dynamicRequestBody.queryParameters
                );

                if (dbResponse.results !== null) {
                    camelizeKeys(dbResponse.results);
                }
                break;
            case 3: //"manyOrNone"
                dbResponse.results = await task.manyOrNone(
                    new DefaultQueryOperationMetricNameGenerator({
                        descriptor: 'DynamicDao',
                        operation: QueryOperationMetricType.get,
                    }),
                    dynamicRequestBody.queryPlaceholder,
                    dynamicRequestBody.queryParameters
                );

                try {
                    if (dbResponse.results.length !== undefined) {
                        for (let i = 0; i < dbResponse.results.length; ++i) {
                            camelizeKeys(dbResponse.results[i]);
                        }
                    }
                } catch (err) {
                    //do nothing, just retun the result as is
                }
                break;
            case 4: // many
                dbResponse.results = await task.many(
                    new DefaultQueryOperationMetricNameGenerator({
                        descriptor: 'DynamicDao',
                        operation: QueryOperationMetricType.get,
                    }),
                    dynamicRequestBody.queryPlaceholder,
                    dynamicRequestBody.queryParameters
                );

                if (dbResponse.results.length == undefined || dbResponse.results.length < 0) {
                    throw new NoResultsError("No results return from query", "");
                }

                try {
                    for (let i = 0; i < dbResponse.results.length; ++i) {
                        camelizeKeys(dbResponse.results[i]);
                    }
                } catch (err) {
                    //do nothing, just retun the result as is

                }
                break;
            case 5: //"batch" 
                //TODO How does batch work and how to implement it?
                dbResponse.results = [] 
                break;
            default:
                throw new Error(`Invalid result type: ${dynamicRequestBody.resultType}`);
        }
        return dbResponse;
    }
}
