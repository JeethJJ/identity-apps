/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { I18nModuleConstants } from "../../constants";
import { LocaleMeta } from "../../models";

export const meta: LocaleMeta = {
    code: "en-US",
    flag: "us",
    name: "English (United States)",
    namespaces: [
        I18nModuleConstants.COMMON_NAMESPACE,
        I18nModuleConstants.CONSOLE_PORTAL_NAMESPACE,
        I18nModuleConstants.MY_ACCOUNT_NAMESPACE,
        I18nModuleConstants.EXTENSIONS_NAMESPACE
    ]
};
