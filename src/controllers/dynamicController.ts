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
    IDynamicRequestParameters,
    IDynamicControllerResponse
} from '../interfaces/Dynamic';
import { DynamicModel } from '../models/dynamicModel';
import { IServerData } from '../serviceTypes';
import tryCatchController from './tryCatchController';
import {  BadRequestError  } from '../errors/requestErrors';
//TODO put this file in a kubernetees config 
const config = require('../db/queries/dynamic-queries.config.json')

export function dynamicController(
    serverData: IServerData
): IDynamicControllerResponse {
    const dynamicModel = new DynamicModel(serverData);

    return {
        executeDynamicRequest: tryCatchController((req) => {
            const queryName = req.params.queryName;
            const queryParameters = req.body.queryParameters;
            let missingParameters : Array<string> = [];
            
            config.queries[queryName].queryParameters.forEach((queryParameterName : string) => {
                if (!(queryParameterName in queryParameters)){
                    missingParameters.push(queryParameterName)
                }
            });
         
            if(missingParameters.length > 0){
                const errorMessage = `Missing the following query parameters: ${missingParameters.join(", ")} `
                throw new BadRequestError(errorMessage)
            }

            const dynamicRequestBody: IDynamicRequestParameters = {
                queryPlaceholder: config.queries[queryName].queryPlaceholder,
                queryParameters: queryParameters,
                transaction: config.queries[queryName].transaction,
                resultType: config.queries[queryName].resultType
            };


            if (req.ctx === undefined) {
                req.ctx = {};
            }

            return dynamicModel.excecuteDynamicRequest(
                req.ctx,
                dynamicRequestBody
            );
        })
    };
}
