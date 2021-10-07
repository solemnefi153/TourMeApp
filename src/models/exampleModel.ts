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

import { ICtx, ILogger } from '@hbo/hurley-api-logging';
import type { IMetricsClient } from '@hbo/hurley-api-metrics';
import { Timer } from '@hbo/hurley-timer';
import { Globals } from '../Globals';

const logger: ILogger = Globals.LoggerFactory.getLogger('models.ExampleModel');
const metrics: IMetricsClient = Globals.metrics.subMetrics('examplemodel');

export class ExampleModel {
    public constructor(
        private readonly _exampleModelValue1: string,
        private readonly _exampleModelValue2: number
    ) {
        this._exampleModelValue1 = _exampleModelValue1;
        this._exampleModelValue2 = _exampleModelValue2;
    }

    public static create(
        exampleModelValue1: string,
        exampleModelValue2: number
    ): ExampleModel {
        return new ExampleModel(exampleModelValue1, exampleModelValue2);
    }

    public async exampleBusinessLogic(ctx?: ICtx): Promise<string> {
        logger.info({ event: 'exampleBusinessLogicBeginProcessing', ctx });
        metrics.increment('example.processing');

        const asyncProcessTimer = Timer.createStarted();
        // TODO: Business-related logic goes here, and also access a DAO, etc, etc.
        const result = await Promise.resolve(
            `The answer for ${this._exampleModelValue2} is ${this._exampleModelValue1}`
        );
        const elapsedMillis = asyncProcessTimer.getElapsed().millis;

        metrics.increment('example.processed');
        metrics.timing('example.processed', elapsedMillis);
        logger.info({
            event: 'exampleBusinessLogicProcessed',
            ctx,
            message: `Finished processing in ${elapsedMillis} ms.`,
        });
        return result;
    }
}
