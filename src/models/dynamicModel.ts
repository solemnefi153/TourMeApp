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
 import { PostgresClient } from '@hbo/hurley-postgres';
 import { DynamicDao } from '../db/daos/dynamicDao';
 
 import { Globals, IGlobals } from '../Globals';
 import {
    IDynamicRequestParameters,
    IDynamicResponse
 } from '../interfaces/Dynamic';
 
 import { IServerData } from '../serviceTypes';
 
 const { LoggerFactory }: IGlobals = Globals;
 const logger = LoggerFactory.getLogger('customersModel');
 
 export class DynamicModel {
     private _databaseClient: PostgresClient;
     private _dynamicDao: DynamicDao;
 
     /**
      * @param serverData
      */
     constructor(serverData: IServerData) {
         this._databaseClient = serverData.databaseClient;
         this._dynamicDao = new DynamicDao(this._databaseClient);
     }
 
     /**
      * Performs a dynamic request to the database
      * @param ctx
      * @param params
      */
     public async excecuteDynamicRequest(
         ctx: IDistributedContext,
         dynamicRequestBody: IDynamicRequestParameters
     ): Promise<IDynamicResponse> {

        return await this._dynamicDao.excecuteDynamicRequest(ctx, dynamicRequestBody);
     }

 }
 