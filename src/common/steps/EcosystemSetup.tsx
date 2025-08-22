/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import {
    ecosystemConfig,
    getSelectedEcosystem,
} from '../../features/flows/ecosystemConfig';
import { videoNote } from '../../features/flows/videoNote';
import { Back } from '../Back';
import Main from '../Main';
import { Next } from '../Next';

const EcosystemSetupStep = () => {
    const ecosystem = getSelectedEcosystem();

    return (
        <Main>
            <Main.Content
                heading={`Complete the requirements for the ${ecosystem?.name}`}
            >
                <div className="pairing-description">
                    Follow the instructions below to setup {ecosystem?.hubName}{' '}
                    for the {ecosystem?.name} ecosystem:
                </div>
                <div className="main-container">
                    <div className="guide">
                        {ecosystem.setupManual.map((guide, index) => (
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
                        <div className="video-container">
                            <video
                                src={ecosystem?.setupVideo}
                                className="video"
                                controls
                                autoPlay
                                loop
                                muted
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
                {videoNote(ecosystem)}
                <br />
                <div style={{ fontSize: '1.2em' }}>
                    Visit the{' '}
                    {ecosystem?.appManual ? (
                        <a
                            href={ecosystem.appManual}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontStyle: 'italic',
                                color: 'rgb(0, 169, 206)',
                            }}
                        >
                            {ecosystem.name}
                        </a>
                    ) : (
                        ecosystem?.name
                    )}{' '}
                    webpage to learn more about the application and Matter
                    support.
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
    name: 'Ecosystem Setup',
    component: EcosystemSetupStep,
});
