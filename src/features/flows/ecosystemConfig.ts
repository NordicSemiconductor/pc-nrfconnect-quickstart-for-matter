/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

export interface EcosystemConfig {
    name: string;
    description: string;
    link: string;
    pairingManual: string;
    setupVideo: string;
    setupManual: string;
    ecosystemVersion: string;
}

let selectedEcosystem: EcosystemConfig;

export const ecosystemConfig: EcosystemConfig[] = [
    {
        name: 'Apple Home',
        description: 'Work with Apple Home',
        link: 'https://www.apple.com/home-app/',
        pairingManual: 'https://support.apple.com/en-us/104998',
        setupVideo: '../resources/ecosystems/Apple/apple_hub.mp4',
        // TODO: Add setup manual
        setupManual: '',
        ecosystemVersion: '18.6',
    },
    {
        name: 'Google Home',
        description: 'Work with Google Home',
        link: 'https://home.google.com/welcome/',
        pairingManual:
            'https://support.google.com/googlenest/answer/9159862?hl=en',
        setupVideo: '../resources/ecosystems/Google/google_hub.mp4',
        // TODO: Add setup manual
        setupManual: '',
        ecosystemVersion: '3.38.53.1',
    },
    {
        name: 'Amazon Alexa',
        description: 'Work with Amazon Alexa',
        link: 'https://www.amazon.com/Alexa-App/b?ie=UTF8&node=18354642011',
        pairingManual:
            'https://www.amazon.com/gp/help/customer/display.html?nodeId=G3RKPNRKF33ECTW7',
        setupVideo: '../resources/ecosystems/Amazon/alexa_hub.mp4',
        // TODO: Add setup manual
        setupManual: '',
        ecosystemVersion: '2025.16',
    },
    {
        name: 'SmartThings',
        description: 'Work with SmartThings',
        link: 'https://www.samsung.com/uk/smartthings/app/',
        pairingManual:
            'https://support.smartthings.com/hc/en-us/articles/360052390111-Devices-in-SmartThings',
        setupVideo: '../resources/ecosystems/SmartThings/smartthings_hub.mp4',
        // TODO: Add setup manual
        setupManual: '',
        ecosystemVersion: '1.8.34.21',
    },
];

export const getSelectedEcosystem = (): EcosystemConfig => selectedEcosystem;

export const setSelectedEcosystem = (ecosystem: EcosystemConfig) => {
    selectedEcosystem = ecosystem;
};
