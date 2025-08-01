/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Temp File Cleanup on App Exit', () => {
    let originalProcessListeners: { [key: string]: Function[] };

    beforeAll(() => {
        // Store original process listeners
        originalProcessListeners = {
            exit: process.listeners('exit'),
            SIGINT: process.listeners('SIGINT'),
            SIGTERM: process.listeners('SIGTERM'),
            uncaughtException: process.listeners('uncaughtException'),
            unhandledRejection: process.listeners('unhandledRejection'),
        };
    });

    afterAll(() => {
        // Restore original process listeners
        process.removeAllListeners('exit');
        process.removeAllListeners('SIGINT');
        process.removeAllListeners('SIGTERM');
        process.removeAllListeners('uncaughtException');
        process.removeAllListeners('unhandledRejection');

        // Restore original listeners
        Object.entries(originalProcessListeners).forEach(([event, listeners]) => {
            listeners.forEach(listener => process.on(event as any, listener as any));
        });
    });

    it('should register cleanup handlers when TempFileManager is imported', () => {
        // Clear all existing listeners
        process.removeAllListeners('exit');
        process.removeAllListeners('SIGINT');
        process.removeAllListeners('SIGTERM');

        const initialListeners = {
            exit: process.listenerCount('exit'),
            SIGINT: process.listenerCount('SIGINT'),
            SIGTERM: process.listenerCount('SIGTERM'),
        };

        // Import the temp file manager (this should register cleanup handlers)
        require('../src/common/TempFileManager');

        const finalListeners = {
            exit: process.listenerCount('exit'),
            SIGINT: process.listenerCount('SIGINT'),
            SIGTERM: process.listenerCount('SIGTERM'),
        };

        // Should have more listeners after importing
        expect(finalListeners.exit).toBeGreaterThan(initialListeners.exit);
        expect(finalListeners.SIGINT).toBeGreaterThan(initialListeners.SIGINT);
        expect(finalListeners.SIGTERM).toBeGreaterThan(initialListeners.SIGTERM);
    });

    it('should cleanup temp files when process exit is triggered', async () => {
        // Create a test temp file
        const testFile = path.join(os.tmpdir(), 'matter-qr-test-exit.png');
        await fs.writeFile(testFile, 'test content');

        // Import and register the file with temp manager
        const { tempFileManager } = require('../src/common/TempFileManager');
        tempFileManager.registerTempFile(testFile);

        expect(tempFileManager.getTrackedFileCount()).toBeGreaterThan(0);

        // Verify file exists
        await expect(fs.access(testFile)).resolves.toBeUndefined();

        // Trigger cleanup manually (simulating app exit)
        await tempFileManager.cleanupAllFiles();

        // File should be cleaned up
        expect(tempFileManager.getTrackedFileCount()).toBe(0);
        await expect(fs.access(testFile)).rejects.toThrow();
    });

    it('should handle cleanup even when files are already deleted', async () => {
        const { tempFileManager } = require('../src/common/TempFileManager');
        
        // Register a non-existent file
        const nonExistentFile = path.join(os.tmpdir(), 'matter-qr-non-existent.png');
        tempFileManager.registerTempFile(nonExistentFile);

        expect(tempFileManager.getTrackedFileCount()).toBe(1);

        // Should not throw error when cleaning up non-existent file
        await expect(tempFileManager.cleanupAllFiles()).resolves.toBeUndefined();
        expect(tempFileManager.getTrackedFileCount()).toBe(0);
    });
}); 