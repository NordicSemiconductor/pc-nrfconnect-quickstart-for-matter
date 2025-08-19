/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../../app/store';
import { ResourcesWithdDownloadAndGuide } from '../../Resource';
import Choose from './Choose';
import CLI from './CLI';
import { DevelopState, getDevelopState } from './developSlice';
import MatterDev from './MatterDev';
import OpenVsCode, { SampleWithRef } from './OpenVsCode';
import VsCodeOpened from './VsCodeOpened';

const DevelopStep = ({
    samples,
    matterResources,
}: {
    samples: SampleWithRef[];
    matterResources: ResourcesWithdDownloadAndGuide[];
}) => {
    const developState = useAppSelector(getDevelopState);

    return (
        <>
            {developState === DevelopState.PREPARE_FOR_MATTER_DEV && (
                <MatterDev resources={matterResources} />
            )}
            {developState === DevelopState.CHOOSE && <Choose />}
            {developState === DevelopState.OPEN_VS_CODE && (
                <OpenVsCode samples={samples} />
            )}
            {developState === DevelopState.VS_CODE_OPENED && <VsCodeOpened />}
            {developState === DevelopState.CLI && <CLI />}
        </>
    );
};

export default (
    samples: SampleWithRef[],
    matterResources: ResourcesWithdDownloadAndGuide[]
) => ({
    name: 'Develop',
    component: () => DevelopStep({ samples, matterResources }),
});
