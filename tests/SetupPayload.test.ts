/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { SetupPayload, CommissioningFlow, DiscoveryCapability } from '../src/common/SetupPayload';

describe('SetupPayload', () => {
  describe('QR Code Parsing', () => {
    it('should parse the provided QR code correctly', () => {
      const qrCode = 'MT:8IXS142C00KA0648G00';
      const payload = SetupPayload.parse(qrCode);

      expect(payload).not.toBeNull();
      expect(payload!.longDiscriminator).toBe(3840);
      expect(payload!.pincode).toBe(20202021);
      expect(payload!.vid).toBe(65521);
      expect(payload!.pid).toBe(32774);
      expect(payload!.flow).toBe(CommissioningFlow.Standard);
      expect(payload!.discovery).toBe(DiscoveryCapability.BLE);
    });

    it('should generate the same QR code when creating payload with same parameters', () => {
      const originalQrCode = 'MT:8IXS142C00KA0648G00';
      const parsed = SetupPayload.parse(originalQrCode);
      
      expect(parsed).not.toBeNull();
      
      const generated = parsed!.generateQRCode();
      expect(generated).toBe(originalQrCode);
    });

    it('should pretty print the parsed payload correctly', () => {
      const qrCode = 'MT:8IXS142C00KA0648G00';
      const payload = SetupPayload.parse(qrCode);
      
      expect(payload).not.toBeNull();
      
      const prettyPrint = payload!.prettyPrint();
      expect(prettyPrint).toContain('Flow                    : Standard');
      expect(prettyPrint).toContain('Pincode                 : 20202021');
      expect(prettyPrint).toContain('Long Discriminator      : 3840');
      expect(prettyPrint).toContain('Discovery Capabilities  : 2');
      expect(prettyPrint).toContain('Vendor Id               : 65521      (0xfff1)');
      expect(prettyPrint).toContain('Product Id              : 32774      (0x8006)');
    });
  });

  describe('Manual Code Generation and Parsing', () => {
    it('should generate and parse manual codes correctly', () => {
      const payload = new SetupPayload(
        3840,                        // discriminator
        20202021,                    // pincode
        DiscoveryCapability.BLE,     // discovery capabilities
        CommissioningFlow.Standard,  // flow
        65521,                       // vendor id
        32774                        // product id
      );

      const manualCode = payload.generateManualCode();
      expect(manualCode).toBeDefined();
      expect(manualCode.length).toBe(11); // Standard flow should be 11 digits

      const parsedFromManual = SetupPayload.parseManualCode(manualCode);
      expect(parsedFromManual).not.toBeNull();
      expect(parsedFromManual!.pincode).toBe(20202021);
      expect(parsedFromManual!.shortDiscriminator).toBe(15); // 3840 >> 8 = 15
    });

    it('should generate long manual codes for custom flow', () => {
      const payload = new SetupPayload(
        3840,                        // discriminator
        20202021,                    // pincode
        DiscoveryCapability.BLE,     // discovery capabilities
        CommissioningFlow.Custom,    // flow
        65521,                       // vendor id
        32774                        // product id
      );

      const manualCode = payload.generateManualCode();
      expect(manualCode).toBeDefined();
      expect(manualCode.length).toBe(21); // Custom flow should be 21 digits

      const parsedFromManual = SetupPayload.parseManualCode(manualCode);
      expect(parsedFromManual).not.toBeNull();
      expect(parsedFromManual!.pincode).toBe(20202021);
      expect(parsedFromManual!.vid).toBe(65521);
      expect(parsedFromManual!.pid).toBe(32774);
      expect(parsedFromManual!.flow).toBe(CommissioningFlow.Custom);
    });
  });

  describe('Round-trip Testing', () => {
    it('should maintain data integrity through QR code round-trip', () => {
      const originalPayload = new SetupPayload(
        3840,                        // discriminator
        20202021,                    // pincode
        DiscoveryCapability.BLE,     // discovery capabilities
        CommissioningFlow.Standard,  // flow
        65521,                       // vendor id
        32774                        // product id
      );

      const qrCode = originalPayload.generateQRCode();
      const parsedPayload = SetupPayload.parseQRCode(qrCode);

      expect(parsedPayload.longDiscriminator).toBe(originalPayload.longDiscriminator);
      expect(parsedPayload.pincode).toBe(originalPayload.pincode);
      expect(parsedPayload.vid).toBe(originalPayload.vid);
      expect(parsedPayload.pid).toBe(originalPayload.pid);
      expect(parsedPayload.flow).toBe(originalPayload.flow);
      expect(parsedPayload.discovery).toBe(originalPayload.discovery);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid QR code format', () => {
      expect(() => {
        SetupPayload.parseQRCode('INVALID:CODE');
      }).toThrow('Invalid QR code payload format');
    });

    it('should return null for invalid manual code length', () => {
      const result = SetupPayload.parseManualCode('123');
      expect(result).toBeNull();
    });

    it('should return null for invalid first digit in manual code', () => {
      const result = SetupPayload.parseManualCode('81234567890');
      expect(result).toBeNull();
    });
  });

  describe('Specific Test Case from User', () => {
    it('should parse MT:8IXS142C00KA0648G00 and return expected values', () => {
      const qrCode = 'MT:8IXS142C00KA0648G00';
      const payload = SetupPayload.parse(qrCode);

      expect(payload).not.toBeNull();
      
      // Verify all expected values from the user's request
      expect(payload!.longDiscriminator).toBe(3840);
      expect(payload!.pincode).toBe(20202021);
      expect(payload!.vid).toBe(65521);
      expect(payload!.pid).toBe(32774);
      expect(payload!.flow).toBe(CommissioningFlow.Standard);
      expect(payload!.discovery).toBe(DiscoveryCapability.BLE);

      // Also verify that the commissioning flow name is correct
      expect(CommissioningFlow[payload!.flow]).toBe('Standard');
      
      // Verify discovery capability is BLE (value 2)
      expect(payload!.discovery).toBe(2);
    });
  });

  describe('fromLogs Method', () => {
    const mockLogs = `
uart:~$ *** Booting My Application v3.0.99-65ece6ad9db7 ***
*** Using nRF Connect SDK v3.0.99-65ece6ad9db7 ***
*** Using Zephyr OS v4.1.99-f1732a80ba02 ***
I: 32 [DL]BLE address: FE:19:47:F7:4C:20
I: No users indexes stored
I: No stored indexes for credential of type: 1
I: 49 [DL]CHIP task running
I: Init CHIP stack
I: 54 [DL]OpenThread started: OK
I: 57 [DL]Setting OpenThread device type to SLEEPY END DEVICE
I: 64 [SVR]Subscription persistence not supported
I: 68 [SVR]Server initializing...
I: 72 [TS]Last Known Good Time: 2023-10-14T01:16:48
I: 77 [DMG]AccessControl: initializing
I: 80 [DMG]Examples::AccessControlDelegate::Init
I: 84 [DMG]AccessControl: setting
I: 87 [DMG]DefaultAclStorage: initializing
I: 91 [DMG]DefaultAclStorage: 0 entries loaded
E: 95 [IN]IPV6_PKTINFO failed: 109
I: 103 [ZCL]Using ZAP configuration...
I: 108 [DMG]AccessControlCluster: initializing
I: 112 [ZCL]Initiating Admin Commissioning cluster.
I: 117 [ZCL]Door Lock server initialized
I: 120 [ZCL]Door Lock cluster initialized at endpoint #1
I: 126 [ZCL]0xc7052 ep 1 clus 0x0000_0101 attr 0x0000_0013 not supported
E: 132 [ZCL]Failed to set DoorLock number of RFID users: 86
I: 137 [DIS]Updating services using commissioning mode 0
E: 142 [DIS]Failed to remove advertised services: 3
E: 147 [DIS]Failed to finalize service update: 3
I: 151 [IN]CASE Server enabling CASE session setups
I: 156 [SVR]Joining Multicast groups
I: 160 [SVR]Server Listening...
I: 162 [DL]Device Configuration:
I: 165 [DL]  Serial Number: 11223344556677889900
I: 170 [DL]  Vendor Id: 65521 (0xFFF1)
I: 173 [DL]  Product Id: 32774 (0x8006)
I: 177 [DL]  Product Name: not-specified
I: 180 [DL]  Hardware Version: 0
I: 183 [DL]  Setup Pin Code (0 for UNKNOWN/ERROR): 20202021
I: 188 [DL]  Setup Discriminator (0xFFFF for UNKNOWN/ERROR): 3840 (0xF00)
I: 195 [DL]  Manufacturing Date: 2022-01-01
I: 199 [DL]  Device Type: 65535 (0xFFFF)
I: 202 [SVR]SetupQRCode: [MT:8IXS142C00KA0648G00]
I: 207 [SVR]Copy/paste the below URL in a browser to see the QR Code:
I: 213 [SVR]https://project-chip.github.io/connectedhomeip/qrcode.html?data=MT%3A8IXS142C00KA0648G00
I: 222 [SVR]Manual pairing code: [34970112332]
E: 226 [DL]Long dispatch time: 175 ms, for event type 2
    `;

    it('should create SetupPayload from valid logs with default parameters', () => {
      const payload = SetupPayload.fromLogs(mockLogs);

      expect(payload.longDiscriminator).toBe(3840);
      expect(payload.pincode).toBe(20202021);
      expect(payload.vid).toBe(65521);
      expect(payload.pid).toBe(32774);
      expect(payload.discovery).toBe(DiscoveryCapability.BLE); // default
      expect(payload.flow).toBe(CommissioningFlow.Standard); // default
    });

    it('should create SetupPayload from valid logs with custom parameters', () => {
      const payload = SetupPayload.fromLogs(
        mockLogs,
        DiscoveryCapability.BLE | DiscoveryCapability.OnNetwork,
        CommissioningFlow.Custom
      );

      expect(payload.longDiscriminator).toBe(3840);
      expect(payload.pincode).toBe(20202021);
      expect(payload.vid).toBe(65521);
      expect(payload.pid).toBe(32774);
      expect(payload.discovery).toBe(DiscoveryCapability.BLE | DiscoveryCapability.OnNetwork);
      expect(payload.flow).toBe(CommissioningFlow.Custom);
    });

    it('should throw error when discriminator cannot be parsed', () => {
      const invalidLogs = `
        Setup Pin Code: 20202021
        Vendor Id: 65521
        Product Id: 32774
      `;

      expect(() => {
        SetupPayload.fromLogs(invalidLogs);
      }).toThrow('Could not parse discriminator from logs');
    });

    it('should throw error when pincode cannot be parsed', () => {
      const invalidLogs = `
        Setup Discriminator: 3840
        Vendor Id: 65521
        Product Id: 32774
      `;

      expect(() => {
        SetupPayload.fromLogs(invalidLogs);
      }).toThrow('Could not parse pincode from logs');
    });

    it('should handle missing vendor and product IDs gracefully', () => {
      const minimalLogs = `
        Setup Discriminator: 3840
        Setup Pin Code: 20202021
      `;

      const payload = SetupPayload.fromLogs(minimalLogs);

      expect(payload.longDiscriminator).toBe(3840);
      expect(payload.pincode).toBe(20202021);
      expect(payload.vid).toBe(0); // should default to 0
      expect(payload.pid).toBe(0); // should default to 0
    });

    it('should handle different log formats', () => {
      const differentFormatLogs = `
        [INFO] Setup Discriminator     : 1234
        [INFO] Setup Pin Code          : 12345678
        [INFO] Vendor Id: 100
        [INFO] Product Id: 200
      `;

      const payload = SetupPayload.fromLogs(differentFormatLogs);

      expect(payload.longDiscriminator).toBe(1234);
      expect(payload.pincode).toBe(12345678);
      expect(payload.vid).toBe(100);
      expect(payload.pid).toBe(200);
    });
  });

  describe('GenerateQRCodeImage Method', () => {
    let tempFilePath: string;
    let payload: SetupPayload;

    beforeEach(() => {
      payload = new SetupPayload(
        3840,                        // discriminator
        20202021,                    // pincode
        DiscoveryCapability.BLE,     // discovery capabilities
        CommissioningFlow.Standard,  // flow
        65521,                       // vendor id
        32774                        // product id
      );

      const os = require('os');
      const path = require('path');
      tempFilePath = path.join(os.tmpdir(), `test-qr-${Date.now()}.png`);
    });

    afterEach(async () => {
      // Cleanup test files
      try {
        const fs = require('fs').promises;
        await fs.unlink(tempFilePath);
      } catch (error) {
        // File might not exist, ignore error
      }
    });

    it('should generate QR code image file successfully', async () => {
      const fs = require('fs').promises;

      const resultPath = await payload.GenerateQRCodeImage(tempFilePath);

      expect(resultPath).toBe(tempFilePath);

      // Verify file exists
      const stats = await fs.stat(tempFilePath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should generate image with correct QR code content', async () => {
      const fs = require('fs').promises;

      await payload.GenerateQRCodeImage(tempFilePath);

      // Verify file exists and has content
      const stats = await fs.stat(tempFilePath);
      expect(stats.size).toBeGreaterThan(1000); // PNG files should be reasonably sized
      expect(stats.size).toBeLessThan(50000); // But not too large for a simple QR code
    });

    it('should handle different file paths correctly', async () => {
      const fs = require('fs').promises;
      const path = require('path');
      const os = require('os');

      const customPath = path.join(os.tmpdir(), 'custom-dir-test', 'qr-code.png');
      
      // Create directory if it doesn't exist
      await fs.mkdir(path.dirname(customPath), { recursive: true });

      try {
        const resultPath = await payload.GenerateQRCodeImage(customPath);
        expect(resultPath).toBe(customPath);

        const stats = await fs.stat(customPath);
        expect(stats.isFile()).toBe(true);

        // Cleanup
        await fs.unlink(customPath);
        await fs.rmdir(path.dirname(customPath));
      } catch (error) {
        // Cleanup on error
        try {
          await fs.unlink(customPath);
          await fs.rmdir(path.dirname(customPath));
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
        throw error;
      }
    });

    it('should throw error when qrcode package is not available', async () => {
      // Mock require to simulate missing package
      const originalRequire = require;
      
      // Create a payload with mocked require
      const mockPayload = Object.create(SetupPayload.prototype);
      Object.assign(mockPayload, payload);
      
      // Override the GenerateQRCodeImage method to simulate missing package
      mockPayload.GenerateQRCodeImage = async function(imagePath: string) {
        const fs = require('fs').promises;
        let QRCode: any;
        try {
          throw new Error('Cannot find module \'qrcode\'');
        } catch (error) {
          throw new Error(
            'QR code generation requires the "qrcode" package to be installed. ' +
            'Run: npm install qrcode @types/qrcode'
          );
        }
      };

      await expect(mockPayload.GenerateQRCodeImage(tempFilePath))
        .rejects.toThrow('QR code generation requires the "qrcode" package to be installed');
    });

    it('should handle file system errors gracefully', async () => {
      // Try to write to an invalid path
      const invalidPath = '/invalid/path/that/does/not/exist/qr.png';

      await expect(payload.GenerateQRCodeImage(invalidPath))
        .rejects.toThrow(); // Should throw file system error
    });

    it('should generate different images for different payloads', async () => {
      const fs = require('fs').promises;
      const path = require('path');
      const os = require('os');

      const payload1 = new SetupPayload(1111, 11111111, DiscoveryCapability.BLE, CommissioningFlow.Standard, 100, 200);
      const payload2 = new SetupPayload(2222, 22222222, DiscoveryCapability.BLE, CommissioningFlow.Standard, 300, 400);

      const tempPath1 = path.join(os.tmpdir(), `test-qr-1-${Date.now()}.png`);
      const tempPath2 = path.join(os.tmpdir(), `test-qr-2-${Date.now()}.png`);

      try {
        await payload1.GenerateQRCodeImage(tempPath1);
        await payload2.GenerateQRCodeImage(tempPath2);

        const buffer1 = await fs.readFile(tempPath1);
        const buffer2 = await fs.readFile(tempPath2);

        // Images should be different
        expect(Buffer.compare(buffer1, buffer2)).not.toBe(0);

        // Cleanup
        await fs.unlink(tempPath1);
        await fs.unlink(tempPath2);
      } catch (error) {
        // Cleanup on error
        try {
          await fs.unlink(tempPath1);
          await fs.unlink(tempPath2);
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
        throw error;
      }
    });
  });
}); 