/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { logger } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { Back } from '../Back';
import { RadioSelect } from '../listSelect/RadioSelect';
import Main from '../Main';
import { Next } from '../Next';

interface EcosystemProps {
    name: string;
    description: string;
    link: string;
}

interface SelectEcosystemStepProps {
    ecosystems: EcosystemProps[];
}

let selectedEcosystem: EcosystemProps | undefined;

export const setSelectedEcosystem = (ecosystem: EcosystemProps | undefined) => {
    selectedEcosystem = ecosystem;
};

export const getSelectedEcosystem = () => selectedEcosystem;

const SelectEcosystemStep = ({ ecosystems }: SelectEcosystemStepProps) => {
    const previouslySelectedChoice = undefined;
    const [selected, setSelected] = React.useState<EcosystemProps | undefined>(
        previouslySelectedChoice
    );

    const isSelected = (name: string) => {
        const result = selected?.name === name;
        // Debug log to see if ecosystem is selected

        logger.debug(`isSelected("${name}"):`, result, 'selected:', selected);
        return result;
    };

    return (
        <Main>
            <Main.Content heading="Select an ecosystem you want to work with">
                <RadioSelect
                    items={ecosystems.map(ecosystem => ({
                        id: ecosystem.name,
                        selected: isSelected(ecosystem.name),
                        onClick: () => {},
                        content: (
                            <span className="tw-text-lg tw-font-semibold">
                                {ecosystem.description}
                            </span>
                        ),
                    }))}
                    onSelect={item => {
                        const found = ecosystems.find(
                            ecosystem => ecosystem.name === item.id
                        );
                        if (found) {
                            setSelected(found);
                        }
                    }}
                />
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next
                    disabled={!selected}
                    onClick={next => {
                        if (!selected) return;

                        // dispatch(setChoice(selected));
                        setSelectedEcosystem(selected);
                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};

export default (ecosystems: EcosystemProps[]) => ({
    name: 'Select Ecosystem',
    component: () => SelectEcosystemStep({ ecosystems }),
});
