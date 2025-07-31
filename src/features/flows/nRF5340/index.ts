/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// import path from 'path';

import Verify from '../../../common/steps/5xFamilyVerify';
import Apps from '../../../common/steps/Apps';
import Develop from '../../../common/steps/develop';
import EcosystemRequirements from '../../../common/steps/EcosystemRequirements';
import Info from '../../../common/steps/Info';
import Interaction from '../../../common/steps/Interaction';
import Learn from '../../../common/steps/Learn';
import Pairing from '../../../common/steps/Pairing';
import Program from '../../../common/steps/program';
import Rename from '../../../common/steps/Rename';
import SelectEcosystem from '../../../common/steps/SelectEcosystem';
import { Choice } from '../../device/deviceSlice';

const infoConfig = {
    title: 'Dual-core Bluetooth 5.4 SoC',
    markdownContent:
        '![nRF5340 DK](5340DK.png)  \n&nbsp;  \nThe nRF5340 DK supports development with an extensive range of wireless protocols. It supports Bluetooth® Low Energy with features such as high-throughput 2 Mbps, Advertising Extensions, and Long Range. Mesh protocols (like Bluetooth Mesh, Thread, and Zigbee) can run concurrently with Bluetooth Low Energy, enabling smartphones to provision, commission, configure, and control mesh nodes, which is a prerequisite for [Matter](https://www.nordicsemi.com/Products/Technologies/Matter) applications. The DK also supports NFC, ANT, 802.15.4, and 2.4-GHz proprietary protocols.  \n&nbsp;  \n&nbsp;  \n![nRF5340 DK Technologies](5340DKTech.png)  \n&nbsp;  \nThe nRF5340 DK is bundled with an NFC antenna that quickly enables testing of nRF5340’s NFC-A tag functionality. The board comes with the SEGGER J-Link debugger, enabling full-blown programming and debugging of both the nRF5340 SoC and external targets.  \n&nbsp;  \n[Hardware documentation](https://docs.nordicsemi.com/bundle/ug_nrf5340_dk/page/UG/dk/intro.html)',
};

const programConfig = [
    {
        name: 'Matter Door Lock',
        type: 'jlink',
        description:
            'This door lock sample demonstrates the usage of the Matter application layer to build a door lock device with one basic bolt. You can use this sample as a reference for creating your application. This device works as a Matter accessory device, meaning it can be paired and controlled remotely over a Matter network built on top of a low-power 802.15.4 Thread network.',
        documentation: {
            label: 'Matter Door Lock',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/matter/lock/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf5340dk_lock.hex',
                link: {
                    label: 'Matter Door Lock',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/matter/lock/README.html',
                },
            },
            {
                core: 'Network',
                file: 'nrf5340dk_lock_CPUNET.hex',
            },
        ],
    },
    {
        name: 'Matter Light Bulb',
        type: 'jlink',
        description:
            'This light bulb sample demonstrates the usage of the Matter application layer to build a white dimmable light bulb device. You can use this sample as a reference for creating your application. This device works as a Matter accessory device, meaning it can be paired and controlled remotely over a Matter network built on top of a low-power 802.15.4 Thread network.',
        documentation: {
            label: 'Matter Light Bulb',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/matter/light_bulb/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf5340dk_light_bulb.hex',
                link: {
                    label: 'Matter Light Bulb',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/matter/light_bulb/README.html',
                },
            },
            {
                core: 'Network',
                file: 'nrf5340dk_light_bulb_CPUNET.hex',
            },
        ],
    },
] as Choice[];

const verifyConfig = [
    {
        ref: 'Matter Door Lock',
        config: {
            vComIndex: 1,
            regex: /(Using nRF Connect SDK[\s\S]*Init CHIP stack[\s\S]*Device Configuration:[\s\S]*Setup Discriminator \(0xFFFF for UNKNOWN\/ERROR\): 3840 \(0xF00\))/,
        },
    },
    {
        ref: 'Matter Light Bulb',
        config: {
            vComIndex: 1,
            regex: /(Using nRF Connect SDK[\s\S]*Init CHIP stack[\s\S]*Device Configuration:[\s\S]*Setup Discriminator \(0xFFFF for UNKNOWN\/ERROR\): 3840 \(0xF00\))/,
        },
    },
];

const ecosystemsConfig = [
    {
        name: 'Apple Home',
        description: 'Work with Apple Home',
        link: 'https://www.apple.com/home-app/',
    },
    {
        name: 'Google Home',
        description: 'Work with Google Home',
        link: 'https://home.google.com/welcome/',
    },
    {
        name: 'Amazon Alexa',
        description: 'Work with Amazon Alexa',
        link: 'https://www.amazon.com/Alexa-App/b?ie=UTF8&node=18354642011',
    },
    {
        name: 'SmartThings',
        description: 'Work with SmartThings',
        link: 'https://www.samsung.com/uk/smartthings/app/',
    },
];

// TODO: Uncomment when pairing section is implemented
// const lockFactoryDataImagePath = path.resolve(
//     __dirname,
//     '../../../resources/devices/images/lock_factory_data.png'
// );
// const lightBulbFactoryDataImagePath = path.resolve(
//     __dirname,
//     '../../../resources/devices/images/light_bulb_factory_data.png'
// );

// const pairingConfig = [
//     {
//         name: 'Matter Door Lock',
//         qrCodePng: lockFactoryDataImagePath,
//     },
//     {
//         name: 'Matter Light Bulb',
//         qrCodePng: lightBulbFactoryDataImagePath,
//     },
// ];

const interactConfig = [
    {
        name: 'Matter Door Lock',
        instruction:
            'Click the Matter Door Lock icon to change the device state and watch the LED2 on the board that corresponds to the lock state.',
    },
    {
        name: 'Matter Light Bulb',
        instruction:
            'Click the Matter Light Bulb icon to change the device state and watch the LED2 on the board that corresponds to the light bulb state.',
    },
];

const learnConfig = [
    {
        label: 'Developer Academy',
        description:
            'Get the know-how to build wireless products using Nordic Semiconductor solutions.',
        link: {
            label: 'Nordic Developer Academy',
            href: 'https://academy.nordicsemi.com/',
        },
    },
    {
        label: 'nRF Connect SDK and Zephyr',
        description:
            'Learn about the application development in the nRF Connect SDK and Zephyr.',
        link: {
            label: 'Application development',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/app_dev.html',
        },
    },
    {
        label: 'Developing with nRF53 Series',
        description:
            'Device-specific information about features, DFU solution, and development.',
        link: {
            label: 'Developing with nRF53 Series',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/app_dev/device_guides/nrf53/index.html',
        },
    },
];

const developConfig = [
    {
        ref: 'Matter Door Lock',
        sampleSource: 'nrf/samples/matter/lock',
    },
    {
        ref: 'Matter Light Bulb',
        sampleSource: 'nrf/samples/matter/light_bulb',
    },
];

const appsConfig = [
    'pc-nrfconnect-programmer',
    'pc-nrfconnect-serial-terminal',
    'pc-nrfconnect-dtm',
];

export default {
    device: 'nRF5340 DK',
    flow: [
        Info(infoConfig),
        Rename(),
        Program(programConfig),
        Verify(verifyConfig),
        SelectEcosystem(ecosystemsConfig),
        EcosystemRequirements(),
        Pairing(),
        Interaction(interactConfig),
        Learn(learnConfig),
        Develop(developConfig),
        Apps(appsConfig),
    ],
};
