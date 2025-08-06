/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { getSelectedEcosystem } from '../../features/flows/ecosystemConfig';
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
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <div
                        style={{
                            textAlign: 'left',
                            marginLeft: '40px',
                            fontSize: '1.2em',
                        }}
                    >
                        Follow the instructions below to setup your ecosystem:
                        <br />
                        <br />
                        <div className="guide">{ecosystem?.setupManual}</div>
                        <br />
                        Watch the video to see how to setup the{' '}
                        {ecosystem?.name} hub.
                        <br />
                    </div>
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
                    {ecosystem?.link ? (
                        <a
                            href={ecosystem.link}
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
