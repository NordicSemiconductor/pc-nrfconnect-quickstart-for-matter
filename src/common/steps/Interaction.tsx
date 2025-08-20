/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useRef } from 'react';

import { useAppSelector } from '../../app/store';
import { getChoiceUnsafely } from '../../features/device/deviceSlice';
import { getSelectedControllingGuide } from '../../features/flows/controllingConfig';
import { getSelectedEcosystem } from '../../features/flows/ecosystemConfig';
import { videoNote } from '../../features/flows/videoNote';
import { Back } from '../Back';
import Link from '../Link';
import Main from '../Main';
import { Next } from '../Next';

interface InteractionProps {
    name: string;
    instruction: string;
    dkImage?: string;
    dkExtraData?: string;
}

interface InteractionStepProps {
    interactions: InteractionProps[];
}

const InteractionStep = ({ interactions }: InteractionStepProps) => {
    const ecosystem = getSelectedEcosystem();
    const previouslySelectedChoice = useAppSelector(getChoiceUnsafely);
    const interaction = interactions.find(
        i => i.name === previouslySelectedChoice.name
    );
    const videoRef = useRef<HTMLVideoElement | null>(null);

    return (
        <Main>
            <Main.Content
                heading={`Interact with your ${previouslySelectedChoice.name} device using the ${ecosystem?.name} app`}
            >
                <div style={{ fontSize: '1.2em' }}>
                    {interaction?.instruction}
                </div>
                <div>
                    <i>
                        <p>
                            <br />
                            <b>Note:</b> The guide uses{' '}
                            <b>
                                {
                                    getSelectedControllingGuide(
                                        previouslySelectedChoice.name,
                                        ecosystem.name
                                    )?.videoDeviceName
                                }
                            </b>{' '}
                            name of the device, but if you have changed it after
                            pairing, use the corresponding name.
                            <br />
                        </p>
                    </i>
                </div>
                <div className="main-container">
                    <div className="controlling-content">
                        <div className="guide">
                            {getSelectedControllingGuide(
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
                        <img
                            src={interaction?.dkImage}
                            alt="DK visualization"
                            style={{
                                maxWidth: '650px',
                                marginTop: '20px',
                            }}
                        />
                    </div>
                    <div
                        className="video-container"
                        style={{ marginLeft: '350px' }}
                    >
                        <video
                            src={
                                getSelectedControllingGuide(
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

export default (interactions: InteractionProps[]) => ({
    name: 'Interaction',
    component: () => InteractionStep({ interactions }),
});
