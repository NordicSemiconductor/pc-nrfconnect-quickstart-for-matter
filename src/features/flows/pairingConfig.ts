/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import path from 'path';

/**
 * This file contains the pairing configuration for the Matter devices.
 */

interface PairingEcosystem {
    name: string;
    guide: string[];
    video: string;
}

export interface PairingConfig {
    name: string;
    factoryData: string;
    autoAdvertise: boolean;
    pairingGuide: PairingEcosystem[];
}

export interface AdvertisingData {
    enablePairingImage: string;
    button: string;
}

const appleHomeGuideStartBase = [
    'Open the <b>Apple Home</b> app',
    'Tap <b>+</b>',
    'Tap <b>Add Accessory</b>',
    'Scan the QR code or tap on <b>More options... </b> then <b>Matter Accessory</b>, and enter the setup code',
    'Tap <b>Add to Home</b>',
    'Tap <b>Add Anyway</b> since this sample is not certified',
    'Select a location for the device, and tap <b>Continue</b>',
    'Name the device, and tap <b>Continue</b>',
];

const appleHomeGuideEndBase = [
    'Tap <b>Done</b>',
    'The device will be visible in your selected room',
];

const smartThingsGuideStartBase = [
    'Open the <b>SmartThings</b> app',
    'Tap <b>+</b>',
    'Tap <b>Scan QR code</b>',
    'Scan the QR code',
    'Wait for the device to be added',
    'Tap <b>Continue</b> while the prompt about the device not being certified appears',
    'Wait for the device to be added',
    'Select a location for the device, set the name and tap <b>Done</b>',
];

const smartThingsGuideEndBase = [
    'Wait for plugins to be installed',
    'The device will be visible in your selected room',
];

const amazonAlexaGuideStartBase = [
    'Open the <b>Amazon Alexa</b> app',
    'Tap <b>+</b>',
    'Tap <b>Device</b> on the list',
    'Tap a tile with the Matter logo',
    'Confirm that the device have a Matter logo by tapping <b>YES</b>',
    'Tap <b>Try Numeric Code Instead</b> and enter the setup code, or tap <b>Scan QR Code</b> and scan the QR code from this page',
    'Tap <b>Connect</b> to start the pairing process',
    'Wait for the device to be added',
    'Once device is connected, tap <b>Next</b>',
];

const amazonAlexaGuideEndBase = [
    'Create a unique name for the device and tap <b>Update name</b>, or skip this step by tapping <b>Skip</b>',
    'Add the device to a group and tap <b>Add To Group</b> or skip this step by tapping <b>Skip</b>',
    'Tap <b>Continue</b>',
    'Tap <b>Done</b>',
    'The device will be visible in your selected room',
];

const googleHomeGuideStartBase = [
    'Open the <b>Google Home</b> app',
    'Go to the <b>Devices</b> page',
    'Tap <b>+ Add</b>',
    'Tap <b>Matter-enabled device</b>',
    'Tap <b>Scan the QR code</b> and scan the QR code from this page or tap <b>Set up without QR code</b> and enter the setup code',
    "Read <b> Google's Privacy Policy</b> and tap <b>Agree</b> to continue",
    "Tap <b>I'm ready</b> to start pairing process",
    'Wait for the device to be added',
    'Once device is connected, tap <b>Done</b>',
    'Select a location for the device, set the name and tap <b>Next</b>',
    'Create a unique name for the device and tap <b>Next</b>',
];

const googleHomeGuideEndBase = [
    'The device will be visible in your selected room',
    'Tap on the <b>not-specified(2)</b> device tile to open detailed view',
    'Tap on the <b>Gear</b> icon to access settings',
    'Tap on the <b>Name</b> field and change it to <b>Humidity Sensor</b>',
    'Navigate back to the <b>Devices</b> page',
    'Tap on the <b>not-specified</b> device tile to open detailed view',
    'Tap on the <b>Gear</b> icon to access settings',
    'Tap on the <b>Name</b> field and change it to <b>Pressure Sensor</b>',
    'Navigate back to the <b>Devices</b> page',
    'Tap on the <b>Test Thingy:53</b> device tile to open detailed view',
    'Tap on the <b>Gear</b> icon to access settings',
    'Tap on the <b>Name</b> field and change it to <b>Temperature Sensor</b>',
    'Navigate back to the <b>Devices</b> page',
];

export const pairingConfig: PairingConfig[] = [
    {
        name: 'Matter Door Lock',
        factoryData: path.resolve(
            __dirname,
            '../resources/devices/factory_data/lock.hex'
        ),
        autoAdvertise: false,
        pairingGuide: [
            {
                name: 'Apple Home',
                guide: [
                    ...appleHomeGuideStartBase,
                    'Tap <b>Continue</b>',
                    'Remember the personal code and tap <b>Continue</b>',
                    'If you have guests saved on your Home app, select them to allow them to access the device and tap <b>Continue</b>',
                    ...appleHomeGuideEndBase,
                ],
                video: '../resources/ecosystems/Apple/adding_device/apple_pairing_lock.mp4',
            },
            {
                name: 'SmartThings',
                guide: [
                    ...smartThingsGuideStartBase,
                    ...smartThingsGuideEndBase,
                ],
                video: '../resources/ecosystems/SmartThings/adding_device/smartthings_lock.mp4',
            },
            {
                name: 'Amazon Alexa',
                guide: [
                    ...amazonAlexaGuideStartBase,
                    ...amazonAlexaGuideEndBase,
                ],
                video: '../resources/ecosystems/Amazon/adding_device/alexa_lock.mp4',
            },
            {
                name: 'Google Home',
                guide: [
                    ...googleHomeGuideStartBase,
                    'Set a new passcode and tap <b>Continue</b>, or skip this step by tapping <b>Skip</b>',
                    'Tap <b>Done</b>',
                    ...googleHomeGuideEndBase,
                ],
                video: '../resources/ecosystems/Google/adding_device/google_lock.mp4',
            },
        ],
    },
    {
        name: 'Matter Light Bulb',
        factoryData: path.resolve(
            __dirname,
            '../resources/devices/factory_data/light_bulb.hex'
        ),
        autoAdvertise: true,
        pairingGuide: [
            {
                name: 'Apple Home',
                guide: [...appleHomeGuideStartBase, ...appleHomeGuideEndBase],
                video: '../resources/ecosystems/Apple/adding_device/apple_pairing_bulb.mp4',
            },
            {
                name: 'SmartThings',
                guide: [
                    ...smartThingsGuideStartBase,
                    ...smartThingsGuideEndBase,
                ],
                video: '../resources/ecosystems/SmartThings/adding_device/smartthings_bulb.mp4',
            },
            {
                name: 'Amazon Alexa',
                guide: [
                    ...amazonAlexaGuideStartBase,
                    ...amazonAlexaGuideEndBase,
                ],
                video: '../resources/ecosystems/Amazon/adding_device/alexa_bulb.mp4',
            },
            {
                name: 'Google Home',
                guide: [...googleHomeGuideStartBase, ...googleHomeGuideEndBase],
                video: '../resources/ecosystems/Google/adding_device/google_bulb.mp4',
            },
        ],
    },
    {
        name: 'Matter Weather Station',
        factoryData: path.resolve(
            __dirname,
            '../resources/devices/factory_data/weather_station.hex'
        ),
        autoAdvertise: false,
        pairingGuide: [
            {
                name: 'Apple Home',
                guide: [
                    ...appleHomeGuideStartBase,
                    'Customize name or remove sensors as needed',
                    ...appleHomeGuideEndBase,
                ],
                video: '../resources/ecosystems/Apple/adding_device/apple_pairing_ws.mp4',
            },
            {
                name: 'SmartThings',
                guide: [
                    ...smartThingsGuideStartBase,
                    ...smartThingsGuideEndBase,
                ],
                video: '../resources/ecosystems/SmartThings/adding_device/smartthings_ws.mp4',
            },
            {
                name: 'Amazon Alexa',
                guide: [
                    ...amazonAlexaGuideStartBase,
                    'This device includes three sensors. Select a sensor tile, then follow the next two steps for each sensor individually.',
                    ...amazonAlexaGuideEndBase,
                ],
                video: '../resources/ecosystems/Amazon/adding_device/alexa_ws.mp4',
            },
            {
                name: 'Google Home',
                guide: [...googleHomeGuideStartBase, ...googleHomeGuideEndBase],
                video: '../resources/ecosystems/Google/adding_device/google_ws.mp4',
            },
        ],
    },
];

export const getSelectedPairingGuide = (
    sampleName: string,
    ecosystemName: string
): PairingEcosystem | undefined => {
    const config = pairingConfig.find(cfg => cfg.name === sampleName);
    if (config) {
        const guide = config.pairingGuide.find(
            guideEntry => guideEntry.name === ecosystemName
        );
        if (guide) return guide;
    }
    return undefined;
};

export const getSelectedPairingConfig = (
    name: string
): PairingConfig | undefined =>
    pairingConfig.find(config => config.name === name);
