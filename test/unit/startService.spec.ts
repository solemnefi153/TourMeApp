/**
 * Copyright (c) 2019 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

describe('startService', () => {
    const acConfig = {
        accessControlMaxAge: 'someValue',
        aws: {
            postgres: {
                credentialPrefix: {
                    migrate: 'ddl',
                    read: 'ro',
                    write: 'rw',
                },
                primary: {
                    database: 'unittest',
                },
                secretsVersion: 1,
                vaultFilePath: 'unittest/vault/path',
            },
        },
        logging: {
            level: 'debug',
        },
        meta: {
            env: 'development',
        },
        requestSignatures: {
            chameleon: {
                fileName: 'signature',
                path: 'secret/hurley/chameleon/unittest',
                version: 1,
            },
            credentials: {
                fileName: 'signature',
                path: 'secret/hurley/credentials/unittest',
                version: 1,
            },
        },
    };
    const config = {
        getConfig: jest.fn().mockName('mockedConfig').mockReturnValue(acConfig),
    };

    const addCORS = { key: 'CORS' };

    class FakeService {
        public callback: any;
        constructor(public arg1: any) {
            this.callback = arg1.onAppInit;
        }

        public use(): FakeService {
            return this;
        }

        public start(): Promise<any> {
            const callback = this.callback;
            return Promise.resolve().then(callback);
        }
    }
    let service: FakeService | null;

    const hurleyService = jest
        .fn()
        .mockName('mockedHurleySvc')
        .mockImplementation((arg1: any) => {
            service = new FakeService(arg1);
            jest.spyOn(service, 'use').mockReturnValue(service);
            jest.spyOn(service, 'callback');
            return service;
        });

    jest.mock('@hbo/hurley-loader', () => ({
        HurleyService: hurleyService,
        loadSchemaWithUri: jest.fn(),
    }));
    const stubbedLogger = jest.fn().mockName('mockedLogger#error');

    const logger = {
        getLogger: jest
            .fn()
            .mockName('mockedLoggerFactory')
            .mockReturnValue({ error: stubbedLogger }),
    };
    const metricsClient = {
        key: 'metricsClient',
        subMetrics: jest.fn(),
    };
    const serviceName = 'testService';

    const mockAuthCheck = {
        Authentication: {
            initialize: jest.fn(),
        },
        Secrets: {
            create: jest.fn(),
            implementations: {},
            keys: {},
        },
        TokenGenerator: jest.fn().mockImplementation(),
    };
    jest.mock('../../src/Globals', () => ({
        Globals: {
            serviceName,
            LoggerFactory: logger,
            Config: config,
            metrics: metricsClient,
            AuthCheck: mockAuthCheck,
        },
    }));

    const hurleyHttp = {
        addCORSHeader: jest
            .fn()
            .mockName('mockedHurleyHTTP')
            .mockReturnValue(addCORS),
    };
    jest.mock('@hbo/hurley-http', () => hurleyHttp);

    jest.mock('@hbo/hurley-postgres');

    const compressionResult = { key: 'compressionResult' };
    const compression = jest
        .fn()
        .mockName('mockedCompression')
        .mockReturnValue(compressionResult);
    jest.mock('compression', () => compression);

    const extractSecret = {
        loadSecretWithVersionFile: jest.fn(),
    };
    jest.mock('../../src/util/extractSecret', () => extractSecret);

    const startServiceModule = require('../../src/startService');

    beforeEach(() => {
        service = null;
        extractSecret.loadSecretWithVersionFile = jest
            .fn()
            .mockReturnValue({ v1: 'mockSecret' });
        jest.clearAllMocks();
    });

    it('initializes the service with correct arguments', (done) => {
        startServiceModule.startService().then(() => {
            expect(hurleyService).toHaveBeenCalledTimes(1);
            expect(service).toBeDefined();
            expect(service!.arg1).toBeDefined();
            const {
                serviceName: resultName,
                useFirst,
                onAppInit,
            } = service!.arg1;
            expect(resultName).toEqual(serviceName);
            expect(useFirst).toEqual([addCORS]);
            expect(typeof onAppInit).toBe('function');
            done();
        });
    });

    it('initializes the other things with the expected params', (done) => {
        startServiceModule.startService().then(() => {
            expect(logger.getLogger).toHaveBeenCalledWith('loader'); // startService#LOGGER_NAME
            expect(compression).toHaveBeenCalledWith({ level: 6 }); // startService#COMPRESSION_LEVEL
            expect(hurleyHttp.addCORSHeader).toHaveBeenCalledWith(
                acConfig.accessControlMaxAge
            );
            done();
        });
    });

    it('calls the callback', (done) => {
        startServiceModule.startService().then(() => {
            if (service) {
                expect(service.callback).toHaveBeenCalledTimes(1);
            } else {
                fail('service is null!');
            }
            done();
        });
    });

    describe('when the service fails to start', () => {
        const error = new Error('This is a test');

        beforeEach(() => {
            jest.spyOn(FakeService.prototype, 'start').mockReturnValue(
                Promise.reject(error)
            );
        });

        it('throws the original error', (done) => {
            startServiceModule.startService().catch((err: any) => {
                expect(err).toBe(error);
                done();
            });
        });
    });
});
