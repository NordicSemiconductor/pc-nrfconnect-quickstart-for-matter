/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useRef, useState } from 'react';
import { logger } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { getChoiceUnsafely } from '../../features/device/deviceSlice';
import { getSelectedEcosystem } from '../../features/flows/ecosystemConfig';
import {
    getSelectedPairingConfig,
    getSelectedPairingGuide,
} from '../../features/flows/pairingConfig';
import { videoNote } from '../../features/flows/videoNote';
import { Back } from '../Back';
import Link from '../Link';
import Main from '../Main';
import { Next } from '../Next';
import { SetupPayload } from '../SetupPayload';
import { tempFileManager } from '../TempFileManager';

import '../../app/App.scss';

const PairingStep = () => {
    const ecosystem = getSelectedEcosystem();
    const previouslySelectedChoice = useAppSelector(getChoiceUnsafely);
    const [qrCodePath, setQrCodePath] = useState<string>('');
    const [manualCode, setManualCode] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const generateQRCode = async (factoryData: string): Promise<string> => {
        try {
            logger.info(`Generating QR code for ${factoryData}`);
            const payload = await SetupPayload.fromCBORHex(factoryData);
            const qrCode = payload.generateQRCode();

            logger.info('QR Code:', qrCode);
            logger.info(payload.prettyPrint());

            logger.info('Generating QR code image...');
            return await payload.GenerateQRCodeImage(
                tempFileManager.createTempFilePath()
            );
        } catch (error) {
            logger.error(error);
            return '';
        }
    };

    const generateManualCode = async (factoryData: string): Promise<void> => {
        try {
            logger.info(`Generating pairing pin code for ${factoryData}`);
            const payload = await SetupPayload.fromCBORHex(factoryData);
            setManualCode(payload.generateManualCode());
        } catch (error) {
            logger.error(error);
        }
    };

    useEffect(() => {
        const factoryData =
            getSelectedPairingConfig(previouslySelectedChoice.name)
                ?.factoryData || '';
        if (factoryData) {
            generateQRCode(factoryData).then(setQrCodePath);
            generateManualCode(factoryData);
        }
    }, [previouslySelectedChoice.name]);

    return (
        <Main>
            <Main.Content
                heading={`Pair your ${previouslySelectedChoice.name} device with the ${ecosystem.name}`}
            >
                <div className="pairing-description">
                    Follow the instructions below to pair your{' '}
                    {previouslySelectedChoice.name} device with the{' '}
                    {ecosystem.name}:
                </div>
                <div className="main-container">
                    <div className="guide">
                        {getSelectedPairingGuide(
                            previouslySelectedChoice.name,
                            ecosystem.name
                        )?.guide.map((guide, index) => (
                            <div
                                key={
                                    typeof guide === 'string'
                                        ? guide.slice(0, 32)
                                        : index
                                }
                            >
                                <span className="guide-index">
                                    {index + 1}.
                                </span>{' '}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: guide,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="content-container">
                        {qrCodePath ? (
                            <div className="pairing-qr-container">
                                <img
                                    src={`file://${qrCodePath}`}
                                    alt="QR Code for Matter device commissioning"
                                    className="pairing-qr-image"
                                />
                                {manualCode ? (
                                    <div className="pairing-manual-code">
                                        <span className="pairing-manual-code-label">
                                            Setup code:
                                        </span>
                                        <br />
                                        <span className="pairing-manual-code-value">
                                            {manualCode}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="pairing-manual-code-error">
                                        Manual code cannot be read. Please try
                                        again.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="pairing-qr-error-placeholder">
                                QR Code cannot be read. Please try again.
                            </div>
                        )}
                        <div className="video-container">
                            <video
                                src={
                                    getSelectedPairingGuide(
                                        previouslySelectedChoice.name,
                                        ecosystem.name
                                    )?.video
                                }
                                className="video"
                                controls
                                autoPlay
                                loop
                                muted
                                ref={videoRef}
                            >
                                Your device does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
                <hr
                    style={{
                        margin: '32px 0',
                        border: 'none',
                        borderTop: '1px solid #e0e0e0',
                    }}
                />
                <div>
                    {videoNote(ecosystem)}
                    <br />
                    For more information, see the {ecosystem.name}{' '}
                    <Link
                        label="manual pairing guide"
                        href={ecosystem.pairingManual}
                        color="hover:tw-text-gray-700"
                    />
                    .
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
