/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DARK_THEME } from "./dark-theme";
import { LIGHT_THEME } from "./light-theme";
import { ThemeSwatchUIConfigsInterface } from "../../components";
import { DynamicBrandingPreferenceThemeInterface, PredefinedThemes } from "../../models";

export const THEMES: DynamicBrandingPreferenceThemeInterface = {
    [ PredefinedThemes.LIGHT ]: LIGHT_THEME,
    [ PredefinedThemes.DARK ]: DARK_THEME
};

export const THEME_SWATCH_UI_CONFIGS: {
    [ key in PredefinedThemes]: ThemeSwatchUIConfigsInterface
} = {
    [ PredefinedThemes.LIGHT ]: {
        colors: {
            headerBackground: "#f8f8fa",
            headerBorderColor: "#e9e9e9",
            pageBackground: LIGHT_THEME.colors.background.body.main,
            primary: LIGHT_THEME.colors.primary,
            secondary: LIGHT_THEME.colors.secondary
        },
        displayName: "Light",
        type: PredefinedThemes.LIGHT
    },
    [ PredefinedThemes.DARK ]: {
        colors: {
            headerBackground: "#121016",
            headerBorderColor: "#3c3c3c",
            pageBackground: DARK_THEME.colors.background.body.main,
            primary: DARK_THEME.colors.primary,
            secondary: DARK_THEME.colors.secondary
        },
        displayName: "Dark",
        type: PredefinedThemes.DARK
    }
};
