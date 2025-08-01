/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable no-bitwise, no-plusplus */

/**
 * Matter Setup Payload Parser and Generator
 * 
 * This module provides functionality to parse and generate Matter setup payloads
 * for both QR codes and manual setup codes.
 * 
 * @example Parse a QR code
 * ```typescript
 * const payload = SetupPayload.parse('MT:8IXS142C00KA0648G00');
 * console.log(payload.discriminator); // 3840
 * console.log(payload.pincode); // 20202021
 * ```
 * 
 * @example Generate a QR code
 * ```typescript
 * const payload = new SetupPayload(3840, 20202021, 2, CommissioningFlow.Standard, 65521, 32774);
 * const qrCode = payload.generateQRCode();
 * const manualCode = payload.generateManualCode();
 * ```
 */

// Base38 alphabet for encoding
const BASE38_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-.';

/**
 * Commissioning flow types
 */
export enum CommissioningFlow {
  Standard = 0,
  UserIntent = 1,
  Custom = 2,
}

/**
 * Discovery capability bitmask values
 */
export enum DiscoveryCapability {
  SoftAP = 1 << 0,     // 0x01
  BLE = 1 << 1,        // 0x02
  OnNetwork = 1 << 2,  // 0x04
}



/**
 * Base38 encoding utilities (matching Python implementation)
 */
class Base38 {
  private static readonly RADIX = 38;
  private static readonly BASE38_CHARS_NEEDED_IN_CHUNK = [2, 4, 5];
  private static readonly MAX_BYTES_IN_CHUNK = 3;
  private static readonly MAX_ENCODED_BYTES_IN_CHUNK = 5;

  /**
   * Encode bytes to Base38 string using chunked approach (matches Python implementation)
   */
  static encode(bytes: Uint8Array): string {
    const totalBytes = bytes.length;
    let qrcode = '';

    for (let i = 0; i < totalBytes; i += Base38.MAX_BYTES_IN_CHUNK) {
      let bytesInChunk: number;
      if ((i + Base38.MAX_BYTES_IN_CHUNK) > totalBytes) {
        bytesInChunk = totalBytes - i;
      } else {
        bytesInChunk = Base38.MAX_BYTES_IN_CHUNK;
      }

      let value = 0;
      for (let j = i; j < i + bytesInChunk; j++) {
        value = value + (bytes[j] << (8 * (j - i)));
      }

      let base38CharsNeeded = Base38.BASE38_CHARS_NEEDED_IN_CHUNK[bytesInChunk - 1];
      while (base38CharsNeeded > 0) {
        qrcode += BASE38_ALPHABET[Math.floor(value % Base38.RADIX)];
        value = Math.floor(value / Base38.RADIX);
        base38CharsNeeded -= 1;
      }
    }

    return qrcode;
  }

  /**
   * Decode Base38 string to bytes using chunked approach (matches Python implementation)
   */
  static decode(qrcode: string): Uint8Array {
    const totalChars = qrcode.length;
    const decodedBytes: number[] = [];

    for (let i = 0; i < totalChars; i += Base38.MAX_ENCODED_BYTES_IN_CHUNK) {
      let charsInChunk: number;
      if ((i + Base38.MAX_ENCODED_BYTES_IN_CHUNK) > totalChars) {
        charsInChunk = totalChars - i;
      } else {
        charsInChunk = Base38.MAX_ENCODED_BYTES_IN_CHUNK;
      }

      let value = 0;
      for (let j = i + charsInChunk - 1; j >= i; j--) {
        const charIndex = BASE38_ALPHABET.indexOf(qrcode[j]);
        if (charIndex === -1) {
          throw new Error(`Invalid Base38 character: ${qrcode[j]}`);
        }
        value = value * Base38.RADIX + charIndex;
      }

      const bytesInChunk = Base38.BASE38_CHARS_NEEDED_IN_CHUNK.indexOf(charsInChunk) + 1;
      for (let k = 0; k < bytesInChunk; k++) {
        decodedBytes.push(value & 0xFF);
        value = value >> 8;
      }
    }

    return new Uint8Array(decodedBytes);
  }
}

/**
 * Setup Payload class for Matter commissioning
 */
export class SetupPayload {
  public longDiscriminator: number;
  public shortDiscriminator: number;
  public pincode: number;
  public discovery: number;
  public flow: CommissioningFlow;
  public vid: number;
  public pid: number;

  constructor(
    discriminator: number,
    pincode: number,
    discovery: number = 4,
    flow: CommissioningFlow = CommissioningFlow.Standard,
    vid: number = 0,
    pid: number = 0
  ) {
    this.longDiscriminator = discriminator;
    this.shortDiscriminator = discriminator >> 8;
    this.pincode = pincode;
    this.discovery = discovery;
    this.flow = flow;
    this.vid = vid;
    this.pid = pid;
  }

  /**
   * Pretty print the setup information
   */
  prettyPrint(): string {
    const flowName = CommissioningFlow[this.flow];
    let result = `Flow                    : ${flowName}\n`;
    result += `Pincode                 : ${this.pincode}\n`;
    result += `Short Discriminator     : ${this.shortDiscriminator}\n`;
    if (this.longDiscriminator) {
      result += `Long Discriminator      : ${this.longDiscriminator}\n`;
    }
    if (this.discovery) {
      result += `Discovery Capabilities  : ${this.discovery}\n`;
    }
    if (this.vid !== null && this.pid !== null) {
      result += `Vendor Id               : ${this.vid}      (0x${this.vid.toString(16).padStart(4, '0')})\n`;
      result += `Product Id              : ${this.pid}      (0x${this.pid.toString(16).padStart(4, '0')})\n`;
    }
    return result;
  }

  /**
   * Generate QR code payload
   */
  generateQRCode(): string {
    // Build bit string according to Python qrcode_format structure
    let bitString = '';

    // Padding (4 bits)
    bitString += '0000';

    // Pincode (27 bits)
    bitString += this.pincode.toString(2).padStart(27, '0');

    // Discriminator (12 bits)
    bitString += this.longDiscriminator.toString(2).padStart(12, '0');

    // Discovery capabilities (8 bits)
    bitString += this.discovery.toString(2).padStart(8, '0');

    // Commissioning flow (2 bits)
    bitString += this.flow.toString(2).padStart(2, '0');

    // Product ID (16 bits)
    bitString += this.pid.toString(2).padStart(16, '0');

    // Vendor ID (16 bits)
    bitString += this.vid.toString(2).padStart(16, '0');

    // Version (3 bits)
    bitString += '000';

    // Convert bit string to bytes (MSB first)
    const bytes = new Uint8Array(Math.ceil(bitString.length / 8));
    for (let i = 0; i < bytes.length; i++) {
      const start = i * 8;
      const end = Math.min(start + 8, bitString.length);
      const byteBits = bitString.slice(start, end).padEnd(8, '0');
      bytes[i] = parseInt(byteBits, 2);
    }

    // Reverse bytes for Base38 encoding (matching Python [::-1])
    const reversedBytes = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      reversedBytes[i] = bytes[bytes.length - 1 - i];
    }

    // Base38 encode and add MT: prefix
    const encoded = Base38.encode(reversedBytes);
    return `MT:${encoded}`;
  }

  /**
   * Generate manual setup code
   */
  generateManualCode(): string {
    const version = 0;
    const vidPidPresent = this.flow !== CommissioningFlow.Standard ? 1 : 0;
    const discriminator = this.shortDiscriminator;
    const pincodeLsb = this.pincode & 0x3fff;  // 14 LSBs
    const pincodeMsb = this.pincode >> 14;     // 13 MSBs
    const vid = this.flow !== CommissioningFlow.Standard ? this.vid : 0;
    const pid = this.flow !== CommissioningFlow.Standard ? this.pid : 0;

    // Pack into chunks
    const chunk1Bits = (version << 3) | (vidPidPresent << 2) | (discriminator & 0x03);
    const chunk1 = chunk1Bits.toString().padStart(1, '0');

    const chunk2Bits = (pincodeLsb << 2) | ((discriminator >> 2) & 0x03);
    const chunk2 = chunk2Bits.toString().padStart(5, '0');

    const chunk3 = pincodeMsb.toString().padStart(4, '0');

    let payload = chunk1 + chunk2 + chunk3;

    if (this.flow !== CommissioningFlow.Standard) {
      const chunk4 = vid.toString().padStart(5, '0');
      const chunk5 = pid.toString().padStart(5, '0');
      payload += chunk4 + chunk5;
    }

    // Add Verhoeff check digit
    const checkDigit = this.calculateVerhoeffCheckDigit(payload);
    return payload + checkDigit;
  }

  /**
   * Parse QR code payload
   */
  static parseQRCode(payload: string): SetupPayload {
    if (!payload.startsWith('MT:')) {
      throw new Error('Invalid QR code payload format');
    }

    const encoded = payload.slice(3);
    const decoded = Base38.decode(encoded);

    // Reverse bytes to match the encoding order (Python does [::-1])
    const reversedBytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      reversedBytes[i] = decoded[decoded.length - 1 - i];
    }

    // Convert bytes to a continuous bit string for easier parsing (MSB first)
    let bitString = '';
    for (let i = 0; i < reversedBytes.length; i++) {
      // Convert each byte to 8-bit binary string, MSB first
      bitString += reversedBytes[i].toString(2).padStart(8, '0');
    }

    // Parse fields according to Python qrcode_format
    let bitPos = 0;

    // Skip padding (4 bits)
    bitPos += 4;

    // Extract pincode (27 bits)
    const pincode = parseInt(bitString.substr(bitPos, 27), 2);
    bitPos += 27;

    // Extract discriminator (12 bits)
    const discriminator = parseInt(bitString.substr(bitPos, 12), 2);
    bitPos += 12;

    // Extract discovery (8 bits)
    const discovery = parseInt(bitString.substr(bitPos, 8), 2);
    bitPos += 8;

    // Extract flow (2 bits)
    const flow = parseInt(bitString.substr(bitPos, 2), 2);
    bitPos += 2;

    // Extract PID (16 bits)
    const pid = parseInt(bitString.substr(bitPos, 16), 2);
    bitPos += 16;

    // Extract VID (16 bits)
    const vid = parseInt(bitString.substr(bitPos, 16), 2);

    return new SetupPayload(discriminator, pincode, discovery, flow, vid, pid);
  }

  /**
   * Parse manual setup code
   */
  static parseManualCode(payload: string): SetupPayload | null {
    const payloadLen = payload.length;
    if (payloadLen !== 11 && payloadLen !== 21) {
      console.error('Invalid length');
      return null;
    }

    // Check if first digit is valid (should be <= 7 for version 1)
    if (parseInt(payload[0], 10) > 7) {
      console.error('Incorrect first digit');
      return null;
    }

    // Verify check digit
    const calculatedCheckDigit = SetupPayload.calculateVerhoeffCheckDigit(payload.slice(0, -1));
    if (calculatedCheckDigit !== payload.slice(-1)) {
      console.error('Check digit mismatch');
      return null;
    }

    // Check if it's a long code (vid_pid_present bit)
    const isLong = (parseInt(payload[0], 10) & (1 << 2)) !== 0;

    // Parse chunks
    const chunk1 = parseInt(payload.slice(0, 1), 10);
    const chunk2 = parseInt(payload.slice(1, 6), 10);
    const chunk3 = parseInt(payload.slice(6, 10), 10);
    const chunk4 = isLong ? parseInt(payload.slice(10, 15), 10) : 0;
    const chunk5 = isLong ? parseInt(payload.slice(15, 20), 10) : 0;

    // Extract fields
    const version = (chunk1 >> 3) & 0x01;
    const vidPidPresent = (chunk1 >> 2) & 0x01;
    const discriminatorLsb = chunk1 & 0x03;
    
    const pincodeLsb = (chunk2 >> 2) & 0x3fff;
    const discriminatorMsb = chunk2 & 0x03;
    
    const pincodeMsb = chunk3;

    const discriminator = (discriminatorMsb << 2) | discriminatorLsb;
    const pincode = (pincodeMsb << 14) | pincodeLsb;
    const vid = vidPidPresent ? chunk4 : 0;
    const pid = vidPidPresent ? chunk5 : 0;
    const flow = vidPidPresent ? CommissioningFlow.Custom : CommissioningFlow.Standard;

    const setupPayload = new SetupPayload(discriminator << 8, pincode, 0, flow, vid, pid);
    setupPayload.shortDiscriminator = discriminator;
    setupPayload.longDiscriminator = discriminator << 8;

    return setupPayload;
  }

  /**
   * Parse either QR code or manual code
   */
  static parse(payload: string): SetupPayload | null {
    if (payload.startsWith('MT:')) {
      return SetupPayload.parseQRCode(payload);
    } else {
      return SetupPayload.parseManualCode(payload);
    }
  }

  /**
   * Create SetupPayload from device logs
   * @param logs - Device output logs containing setup information
   * @param discovery - Discovery capabilities (default: BLE)
   * @param flow - Commissioning flow (default: Standard)
   * @returns New SetupPayload instance
   * @throws Error if required values cannot be parsed from logs
   */
  static fromLogs(
    logs: string, 
    discovery: number = DiscoveryCapability.BLE, 
    flow: CommissioningFlow = CommissioningFlow.Standard
  ): SetupPayload {
    const discriminator = parseInt(logs.match(/Setup Discriminator.*?:\s*(\d+)/)?.[1] || '0');
    const pincode = parseInt(logs.match(/Setup Pin Code.*?:\s*(\d+)/)?.[1] || '0');
    const vendorId = parseInt(logs.match(/Vendor Id:\s*(\d+)/)?.[1] || '0');
    const productId = parseInt(logs.match(/Product Id:\s*(\d+)/)?.[1] || '0');

    if (discriminator === 0) {
      throw new Error('Could not parse discriminator from logs');
    }
    if (pincode === 0) {
      throw new Error('Could not parse pincode from logs');
    }

    return new SetupPayload(discriminator, pincode, discovery, flow, vendorId, productId);
  }


 /**
   * Calculate Verhoeff check digit (simplified implementation)
   */
  private static calculateVerhoeffCheckDigit(payload: string): string {
    // Simplified check digit calculation
    // For production use, consider implementing the full Verhoeff algorithm
    let sum = 0;
    for (let i = 0; i < payload.length; i++) {
      sum += parseInt(payload[i], 10) * (i + 1);
    }
    return (sum % 10).toString();
  }

  private calculateVerhoeffCheckDigit(payload: string): string {
    return SetupPayload.calculateVerhoeffCheckDigit(payload);
  }

  async GenerateQRCodeImage(imagePath: string): Promise<string> {
    const fs = require('fs').promises;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let QRCode: any;
    try {
      // eslint-disable-next-line global-require
      QRCode = require('qrcode');
    } catch (error) {
      throw new Error(
          'QR code generation requires the "qrcode" package to be installed. ' +
          'Run: npm install qrcode @types/qrcode');
    }

    const qrOptions = {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M' as const,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      };

    const qrCode = this.generateQRCode();
    const qrCodeBuffer = await QRCode.toBuffer(qrCode, qrOptions);
    await fs.writeFile(imagePath, qrCodeBuffer);

    return imagePath;
  }
}



export default SetupPayload; 