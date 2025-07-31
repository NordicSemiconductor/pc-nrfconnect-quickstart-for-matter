/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

// TODO: Pass the path to qr code image, as a part of some pairingConfig structure depending on the selected sample.
import qrCodeImg from '../../../resources/devices/images/lock_factory_data.png';
// TODO: Make these images part of the ecosystem data structure and replace with ecosystem specific images
import phoneImg from '../../../resources/phone.png';
import { useAppSelector } from '../../app/store';
import { getChoiceUnsafely } from '../../features/device/deviceSlice';
import { Back } from '../Back';
import Main from '../Main';
import { Next } from '../Next';
import { getSelectedEcosystem } from './SelectEcosystem';

// interface PairingStepProps {
//     name: string;
//     qrCodeImage: string;
// }

const PairingStep = () => {
    const ecosystem = getSelectedEcosystem();
    const previouslySelectedChoice = useAppSelector(getChoiceUnsafely);

    // TODO: For now pairingProps are not used, but they should be used to get qrCodeImg path instead of hardcoded one.

    return (
        <Main>
            <Main.Content
                heading={`Pair your ${previouslySelectedChoice.name} device with the ${ecosystem?.name}`}
            >
                <div style={{ fontSize: '1.2em' }}>
                    Open the {ecosystem?.name} app and scan the QR code.
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 24,
                        gap: 32,
                    }}
                >
                    <img
                        src={phoneImg}
                        alt="Phone adding Matter accessory"
                        style={{ width: 400 }}
                    />
                    <img
                        src={qrCodeImg}
                        alt="QR Code"
                        style={{ maxWidth: 400 }}
                    />
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next
                    onClick={next => {
                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};

export default () => ({
    name: 'Pairing',
    component: () => PairingStep(),
});
