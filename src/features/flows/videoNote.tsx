/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { EcosystemConfig } from './ecosystemConfig';

export const videoNote = (ecosystem: EcosystemConfig): React.ReactNode => (
    <div>
        <i>
            <p>
                <b>Note:</b> The video has been recorded with version{' '}
                {ecosystem?.ecosystemVersion} of the {ecosystem?.name}{' '}
                application. Please note that the user interface may look
                slightly different if you are using another version on your
                device.
                <br />
                <b>Tip:</b> You can <b>double-click</b> the video or press the{' '}
                <b>fullscreen button</b>
                <span style={{ margin: '0 4px', verticalAlign: 'middle' }}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        style={{ display: 'inline', verticalAlign: 'middle' }}
                    >
                        <rect
                            x="1"
                            y="1"
                            width="5"
                            height="2"
                            rx="1"
                            fill="#888"
                        />
                        <rect
                            x="1"
                            y="1"
                            width="2"
                            height="5"
                            rx="1"
                            fill="#888"
                        />
                        <rect
                            x="10"
                            y="1"
                            width="5"
                            height="2"
                            rx="1"
                            fill="#888"
                        />
                        <rect
                            x="13"
                            y="1"
                            width="2"
                            height="5"
                            rx="1"
                            fill="#888"
                        />
                        <rect
                            x="1"
                            y="13"
                            width="5"
                            height="2"
                            rx="1"
                            fill="#888"
                        />
                        <rect
                            x="1"
                            y="10"
                            width="2"
                            height="5"
                            rx="1"
                            fill="#888"
                        />
                        <rect
                            x="10"
                            y="13"
                            width="5"
                            height="2"
                            rx="1"
                            fill="#888"
                        />
                        <rect
                            x="13"
                            y="10"
                            width="2"
                            height="5"
                            rx="1"
                            fill="#888"
                        />
                    </svg>
                </span>
                to enter fullscreen mode.
            </p>
        </i>
    </div>
);
