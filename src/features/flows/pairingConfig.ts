/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import path from 'path';

/**
 * This file contains the pairing configuration for the Matter devices.
 */

export interface PairingConfig {
    name: string;
    factoryData: string;
    autoAdvertise: boolean;
}

export interface AdvertisingData {
    enablePairingImage: string;
    button: string;
}

export const pairingConfig: PairingConfig[] = [
    {
        name: 'Matter Door Lock',
        factoryData: path.resolve(
            __dirname,
            '../resources/devices/factory_data/lock.hex'
        ),
        autoAdvertise: false,
    },
    {
        name: 'Matter Light Bulb',
        factoryData: path.resolve(
            __dirname,
            '../resources/devices/factory_data/light_bulb.hex'
        ),
        autoAdvertise: true,
    },
    {
        name: 'Matter Weather Station',
        factoryData: path.resolve(
            __dirname,
            '../resources/devices/factory_data/weather_station.hex'
        ),
        autoAdvertise: false,
    },
];

export const getSelectedPairingConfig = (
    name: string
): PairingConfig | undefined =>
    pairingConfig.find(config => config.name === name);
