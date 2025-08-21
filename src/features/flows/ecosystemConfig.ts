/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

export interface EcosystemConfig {
    name: string;
    description: string;
    appManual: string;
    pairingManual: string;
    hubManual: string;
    hubImage: string;
    hubName: string;
    appImage: string;
    appSystemSupport: string;
    setupVideo: string;
    setupManual: string;
    ecosystemVersion: string;
}

let selectedEcosystem: EcosystemConfig;

export const ecosystemConfig: EcosystemConfig[] = [
    {
        name: 'Apple Home',
        description: 'Work with Apple Home',
        appManual: 'https://www.apple.com/home-app/',
        pairingManual: 'https://support.apple.com/en-us/104998',
        hubManual: 'https://support.apple.com/en-us/102557',
        hubImage: '../resources/ecosystems/Apple/apple_hub.png',
        hubName: 'Apple HomePod Mini',
        appImage: '../resources/ecosystems/Apple/apple_home_app.png',
        appSystemSupport: 'only iOS system',
        setupVideo: '../resources/ecosystems/Apple/apple_hub.mp4',
        // TODO: Add setup manual
        setupManual: '',
        ecosystemVersion: '18.6',
    },
    {
        name: 'Google Home',
        description: 'Work with Google Home',
        appManual: 'https://home.google.com/welcome/',
        pairingManual:
            'https://support.google.com/googlenest/answer/9159862?hl=en',
        hubManual: 'https://home.google.com/get-inspired/matter-and-thread/',
        hubImage: '../resources/ecosystems/Google/google_hub.png',
        hubName: 'Google Nest Hub 2nd Gen',
        appImage: '../resources/ecosystems/Google/google_home_app.png',
        appSystemSupport: 'Android and iOS systems',
        setupVideo: '../resources/ecosystems/Google/google_hub.mp4',
        // TODO: Add setup manual
        setupManual: '',
        ecosystemVersion: '3.38.53.1',
    },
    {
        name: 'Amazon Alexa',
        description: 'Work with Amazon Alexa',
        appManual: 'https://www.amazon.com/Alexa-App/b?ie=UTF8&node=18354642011',
        pairingManual:
            'https://www.amazon.com/gp/help/customer/display.html?nodeId=G3RKPNRKF33ECTW7',
        hubManual: 'https://developer.amazon.com/en-US/docs/alexa/smarthome/matter-support.html#compatible-echos',
        hubImage: '../resources/ecosystems/Amazon/amazon_hub.png',
        hubName: 'Amazon Echo 4th Gen',
        appImage: '../resources/ecosystems/Amazon/alexa_app.png',
        appSystemSupport: 'Android and iOS systems',
        setupVideo: '../resources/ecosystems/Amazon/alexa_hub.mp4',
        // TODO: Add setup manual
        setupManual: '',
        ecosystemVersion: '2025.16',
    },
    {
        name: 'SmartThings',
        description: 'Work with SmartThings',
        appManual: 'https://www.samsung.com/uk/smartthings/app/',
        pairingManual:
            'https://support.smartthings.com/hc/en-us/articles/360052390111-Devices-in-SmartThings',
        hubManual: 'https://partners.smartthings.com/matter',
        hubImage: '../resources/ecosystems/SmartThings/smartthings_hub.png',
        hubName: 'Aeotec Smart Home Hub',
        appImage: '../resources/ecosystems/SmartThings/smartthings_app.png',
        appSystemSupport: 'Android and iOS systems',
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
