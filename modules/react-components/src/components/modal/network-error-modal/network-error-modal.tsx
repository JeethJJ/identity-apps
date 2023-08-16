/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AppConstants } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Heading } from "../../typography";
import { ConfirmationModal } from "../confirmation-modal";

/**
 * Prop type of the `NetworkErrorModal` component.
 */
interface NetworkErrorModalPropTypes extends IdentifiableComponentInterface {
    heading: ReactNode;
    description: ReactNode;
    primaryActionText: ReactNode;
    primaryAction: () => void;
}

/**
 * This component listens to the `network_error_event` Event and pops up a modal
 * when this Event is dispatched.
 *
 * This is used to show an error message when an API call fails due to a `401` error
 * or a network-timeout error.
 *
 * @param props - The props passed into the component.
 *
 * @returns the component that pops up a modal when there is a network error.
 */
export const NetworkErrorModal: FunctionComponent<NetworkErrorModalPropTypes> = (
    props: NetworkErrorModalPropTypes
): ReactElement => {

    const {
        heading,
        description,
        primaryActionText,
        primaryAction,
        [ "data-componentid" ]: componentId
    } = props;

    const [ showModal, setShowModal ] = useState(false);

    /**
     * Show modal.
     */
    const showErrorModal = () => {
        setShowModal(true);
    };

    /**
     * Called on mount and unmount to add/remove the event listener.
     */
    useEffect(() => {
        addEventListener(AppConstants.NETWORK_ERROR_EVENT, showErrorModal);

        return () => {
            removeEventListener(AppConstants.NETWORK_ERROR_EVENT, showErrorModal);
        };
    }, []);

    return (
        <ConfirmationModal
            animated
            type="warning"
            textAlign="center"
            primaryAction={ primaryActionText }
            onPrimaryActionClick={ () => {
                primaryAction();
            } }
            data-componentid={ componentId }
            data-testid={ "network-error-modal" }
            open={ showModal }
        >
            <ConfirmationModal.Content>
                <Heading as="h3">{ heading }</Heading>
                <p>{ description }</p>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
NetworkErrorModal.defaultProps = {
    "data-componentid": "network-error-modal"
};
