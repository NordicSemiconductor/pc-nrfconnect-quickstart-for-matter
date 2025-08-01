/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

// TODO: Make these images part of the ecosystem data structure and replace with ecosystem specific images
import phoneImg from '../../../resources/phone.png';
import { useAppSelector } from '../../app/store';
import { getChoiceUnsafely } from '../../features/device/deviceSlice';
import { Back } from '../Back';
import Main from '../Main';
import { Next } from '../Next';
import { getQRCode } from './5xFamilyVerify/Verify';
import { getSelectedEcosystem } from './SelectEcosystem';

const PairingStep = () => {
    const ecosystem = getSelectedEcosystem();
    const previouslySelectedChoice = useAppSelector(getChoiceUnsafely);
    const qrCodePath = getQRCode();

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
                    {qrCodePath ? (
                        <img
                            src={`file://${qrCodePath}`}
                            alt="QR Code for Matter device commissioning"
                            style={{ maxWidth: 400 }}
                        />
                    ) : (
                        <div
                            style={{
                                maxWidth: 400,
                                minHeight: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #ccc',
                                borderRadius: 8,
                                fontSize: '1.1em',
                                color: '#666',
                            }}
                        >
                            QR Code will be generated after device verification
                        </div>
                    )}
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
