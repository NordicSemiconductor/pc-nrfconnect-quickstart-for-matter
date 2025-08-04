/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

export const formatResponse = (response: string, responseRegex: RegExp) => {
    const [, match] = response.match(responseRegex) ?? [];

    if (!match) {
        throw new Error(
            `No match found for regex "${responseRegex}" in response "${response}"`);
    }

    return match;
};
