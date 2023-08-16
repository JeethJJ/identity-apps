/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Table, TableFooterProps } from "semantic-ui-react";

/**
 * Proptypes for the Data Table Footer component.
 */
export interface DataTableFooterPropsInterface extends TableFooterProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Data Table Footer component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the Data Table Footer component
 */
export const DataTableFooter: FunctionComponent<PropsWithChildren<DataTableFooterPropsInterface>> = (
    props: PropsWithChildren<DataTableFooterPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames("data-table-footer", className);

    return (
        <Table.Footer
            className={ classes }
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
        </Table.Footer>
    );
};

/**
 * Default props for the component.
 */
DataTableFooter.defaultProps = {
    "data-componentid": "data-table-footer",
    "data-testid": "data-table-footer"
};
