/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { getSelectedEcosystem } from '../../features/flows/ecosystemConfig';
import { Back } from '../Back';
import Main from '../Main';
import { Next } from '../Next';

const EcosystemRequirementsStep = () => {
    const ecosystem = getSelectedEcosystem();

    return (
        <Main>
            <Main.Content
                heading={`Complete the requirements for the ${ecosystem?.name}`}
            >
                <div style={{ padding: '20px 0', fontSize: '1.2em' }}>
                    You are going to need the following devices and tools to use
                    this ecosystem:
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '30px 0',
                        alignItems: 'flex-start',
                    }}
                >
                    <div className="ecosystem-hub-image">
                        <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
                            Home Hub with Thread Border Router support
                        </div>
                        <img
                            src={ecosystem?.hubImage}
                            alt="Home Hub"
                            style={{
                                display: 'block',
                                margin: '20px auto 0 0',
                                maxWidth: '400px',
                            }}
                        />
                        <div style={{ fontSize: '1.2em', marginTop: '30px' }}>
                            <i>
                                <p>
                                    <br />
                                    <b>Note:</b> This guide uses{' '}
                                    <b>{ecosystem?.hubName}</b> device, but you
                                    can use any other Home Hub compatible with{' '}
                                    {ecosystem?.name} that supports Matter and
                                    Thread Border Router.
                                    <br />
                                </p>
                            </i>
                            <br />
                            <br />
                            Visit the{' '}
                            {ecosystem?.hubManual ? (
                                <a
                                    href={ecosystem.hubManual}
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
                            webpage to learn more about the Matter and supported
                            Home Hub devices.
                        </div>
                    </div>
                    <div
                        style={{
                            textAlign: 'right',
                            marginRight: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
                            Smartphone with {ecosystem?.name} application
                            installed
                        </div>
                        <img
                            src={ecosystem?.appImage}
                            alt="Smartphone"
                            className="ecosystem-app-image"
                        />
                        <div
                            style={{
                                fontSize: '1.2em',
                                marginTop: '30px',
                                textAlign: 'left',
                            }}
                        >
                            The {ecosystem?.name} app supports{' '}
                            <b>{ecosystem?.appSystemSupport}</b>.
                            <br />
                            <br />
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
                            webpage to learn more about the application.
                        </div>
                    </div>
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
    name: 'Ecosystem Requirements',
    component: EcosystemRequirementsStep,
});
