/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import Apps from '../../../common/steps/Apps';
import Develop from '../../../common/steps/develop';
import EcosystemRequirements from '../../../common/steps/EcosystemRequirements';
import EcosystemSetup from '../../../common/steps/EcosystemSetup';
import EnableAdvertising from '../../../common/steps/EnableAdvertising';
import Info from '../../../common/steps/Info';
import Interaction from '../../../common/steps/Interaction';
import Learn from '../../../common/steps/Learn';
import Pairing from '../../../common/steps/Pairing';
import Program from '../../../common/steps/program';
import Rename from '../../../common/steps/Rename';
import SelectEcosystem from '../../../common/steps/SelectEcosystem';
import Verify from '../../../common/steps/Thingy53Verify';
import { Choice } from '../../device/deviceSlice';
import { AdvertisingData } from '../pairingConfig';

const infoConfig = {
    title: 'Multi-protocol IoT prototyping platform',
    markdownContent:
        '![Thingy53](Thingy53.png)  \n&nbsp;  \nThe Nordic Thingy:53™ is an easy-to-use IoT prototyping platform. The Thingy:53 is built around the nRF5340 SoC, our flagship dual-core wireless SoC. The Bluetooth Low Energy (LE) radio allows updating firmware and communication over Bluetooth LE, and the radio also supports other protocols like Bluetooth mesh, Thread, Zigbee, and proprietary 2.4 GHz protocols. The Thread protocol compatibility also makes it a great choice when developing products for the new Matter ecosystem.\n&nbsp;  \n[Hardware documentation](https://docs.nordicsemi.com/bundle/ug_thingy53/page/UG/thingy53/intro/frontpage.html)',
};

const programConfig = [
    {
        name: 'Matter Weather Station',
        type: 'buttonless-dfu',
        description:
            'This weather station application demonstrates the usage of the Matter application layer to build a weather station device using the Nordic Thingy:53. Such a device lets you remotely gather different kinds of data using the device sensors, such as temperature, air pressure, and relative humidity. You can use this sample as a reference for creating your application. This device works as a Matter accessory device, meaning it can be paired and controlled remotely over a Matter network built on top of a low-power 802.15.4 Thread network.',
        documentation: {
            label: 'Matter Weather Station',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/matter_weather_station/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'matter_weather_station.signed.bin',
                link: {
                    label: 'Matter Weather Station',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/matter_weather_station/README.html',
                },
            },
        ],
    },
] as Choice[];

const verifyConfig = {
    settings: [
        {
            ref: 'Start prototyping',
            vComIndex: 0,
            mode: 'SHELL' as const,
        },
    ],
    commands: [
        {
            title: 'matter config',
            command: 'matter config',
            responseRegex:
                /(VendorId:[\s\S]*ProductId:[\s\S]*HardwareVersion:[\s\S]*PinCode:[\s\S]*Discriminator:[\s\S]*)Done/s,
        },
    ],
};

const interactConfig = [
    {
        name: 'Matter Weather Station',
        instruction:
            'Click the Temperature, Humidity or Pressure sensor icons to observe the device changing measured data.',
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
        label: 'Developing with Thingy:53',
        description:
            'Device-specific information about features, DFU solution, and development.',
        link: {
            label: 'Developing with Thingy:53',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/app_dev/device_guides/thingy53/index.html',
        },
    },
];

const developConfig = [
    {
        ref: 'Matter Weather Station',
        sampleSource: 'nrf/applications/matter_weather_station',
    },
];

const appsConfig = [
    'pc-nrfconnect-programmer',
    'pc-nrfconnect-serial-terminal',
    'pc-nrfconnect-dtm',
];

const advertisingData = {
    enablePairingImage: '../resources/devices/images/Thingy53_pairing.png',
    button: 'Middle Button',
} as AdvertisingData;

export default {
    // TODO: For now QS for Matter does not support changing USB name at runtime. Thingy has to use the bootloader name before and after the DFU.
    device: 'Bootloader Thingy:53',
    flow: [
        Info(infoConfig),
        Rename(),
        Program(programConfig),
        Verify(verifyConfig),
        SelectEcosystem(),
        EcosystemRequirements(),
        EcosystemSetup(),
        EnableAdvertising(advertisingData),
        Pairing(),
        Interaction(interactConfig),
        Learn(learnConfig),
        Develop(developConfig),
        Apps(appsConfig),
    ],
};
