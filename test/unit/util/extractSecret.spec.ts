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

describe('extractSecrets', () => {
    describe('loadSecretWithVersionFile', () => {
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetModules();
        });
        it('retrieves the secret with version', async () => {
            const vaultSecretsLibrary = jest
                .fn()
                .mockName('mockSecrets#getItemWithRetry')
                .mockResolvedValue({
                    data: {
                        admin: 'testing',
                    },
                });

            const createVaultSecretStorageInstanceMock = jest
                .fn()
                .mockName('mockSecrets#createVaultSecretStorageInstance')
                .mockResolvedValue({
                    getItemWithRetry: vaultSecretsLibrary,
                });

            const usingVaultConfig = jest
                .fn()
                .mockName('mockSecrets#using')
                .mockReturnValue({
                    createVaultSecretStorageInstance: createVaultSecretStorageInstanceMock,
                });

            jest.mock('@hbo/hurley-secret', () => ({
                using: usingVaultConfig,
            }));

            const extractSecret = require('../../../src/util/extractSecret');
            const secret = await extractSecret.loadSecretWithVersionFile(
                extractSecret.defaultBasePath,
                'testfile',
                1
            );
            expect(secret.admin).toEqual('testing');
            expect(vaultSecretsLibrary).toHaveBeenCalledWith({
                item: `secret/hurley/chameleon/${process.env.NODE_ENV}/testfile/v1`,
                ttl: 5000,
            });
        });
        it('retrieves the secret without the version', async () => {
            const vaultSecretsLibrary = jest
                .fn()
                .mockName('mockSecrets#getItemWithRetry')
                .mockResolvedValue({
                    data: {
                        admin: 'testing',
                    },
                });

            const createVaultSecretStorageInstanceMock = jest
                .fn()
                .mockName('mockSecrets#createVaultSecretStorageInstance')
                .mockResolvedValue({
                    getItemWithRetry: vaultSecretsLibrary,
                });

            const usingVaultConfig = jest
                .fn()
                .mockName('mockSecrets#using')
                .mockReturnValue({
                    createVaultSecretStorageInstance: createVaultSecretStorageInstanceMock,
                });

            jest.mock('@hbo/hurley-secret', () => ({
                using: usingVaultConfig,
            }));

            const extractSecret = require('../../../src/util/extractSecret');
            const secret = await extractSecret.loadSecretWithVersionFile(
                extractSecret.defaultBasePath,
                'testfile'
            );
            expect(secret.admin).toEqual('testing');
            expect(vaultSecretsLibrary).toHaveBeenCalledWith({
                item: `secret/hurley/chameleon/${process.env.NODE_ENV}/testfile`,
                ttl: 5000,
            });
        });
        it('fails when the file is not available and rethrows the error', async () => {
            const vaultSecretsLibrary = jest
                .fn()
                .mockName('mockSecrets#getItemWithRetry')
                .mockRejectedValue(new Error('file not found'));

            const createVaultSecretStorageInstanceMock = jest
                .fn()
                .mockName('mockSecrets#createVaultSecretStorageInstance')
                .mockResolvedValue({
                    getItemWithRetry: vaultSecretsLibrary,
                });

            const usingVaultConfig = jest
                .fn()
                .mockName('mockSecrets#using')
                .mockReturnValue({
                    createVaultSecretStorageInstance: createVaultSecretStorageInstanceMock,
                });

            jest.mock('@hbo/hurley-secret', () => ({
                using: usingVaultConfig,
            }));

            const extractSecret = require('../../../src/util/extractSecret');

            try {
                await extractSecret.loadSecretWithVersionFile(
                    extractSecret.defaultBasePath,
                    'testfile',
                    1
                );
            } catch (e) {
                expect(vaultSecretsLibrary).toHaveBeenCalledWith({
                    item: `secret/hurley/chameleon/${process.env.NODE_ENV}/testfile/v1`,
                    ttl: 5000,
                });
                expect(e.message).toEqual('file not found');
            }
        });
    });
});
