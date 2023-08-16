/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Heading, InfoCard, Popup, Text } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Label } from "semantic-ui-react";
import { applicationConfig } from "../../../../../../extensions";
import { 
    IdentityProviderManagementConstants
} from "../../../../../identity-providers/constants/identity-provider-management-constants";
import { AuthenticatorMeta } from "../../../../../identity-providers/meta/authenticator-meta";
import {
    AuthenticatorCategories,
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface
} from "../../../../../identity-providers/models/identity-provider";
import { AuthenticationStepInterface } from "../../../../models";
import { SignInMethodUtils } from "../../../../utils/sign-in-method-utils";

/**
 * Proptypes for the authenticators component.
 */
interface AuthenticatorsPropsInterface extends TestableComponentInterface {
    /**
     * List of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Configured authentication steps.
     */
    authenticationSteps: AuthenticationStepInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Current step.
     */
    currentStep: number;
    /**
     * Default name for authenticators with no name.
     */
    defaultName?: string;
    /**
     * Heading for the authenticators section.
     */
    heading?: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback triggered when authenticators are selected.
     */
    onAuthenticatorSelect: (selectedAuthenticators: GenericAuthenticatorInterface[]) => void;
    /**
     * Already selected set of authenticators.
     */
    selected: GenericAuthenticatorInterface[];
    /**
     * Show/Hide authenticator labels in UI.
     */
    showLabels?: boolean;
    attributeStepId: number;
    refreshAuthenticators: () => Promise<void>;
    subjectStepId: number;
}

/**
 * Component to render the list of authenticators.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const Authenticators: FunctionComponent<AuthenticatorsPropsInterface> = (
    props: AuthenticatorsPropsInterface
): ReactElement => {
    const {
        authenticators,
        authenticationSteps,
        currentStep,
        defaultName,
        heading,
        onAuthenticatorSelect,
        selected,
        showLabels,
        // refreshAuthenticators,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ selectedAuthenticators, setSelectedAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);

    const authenticatorCardClasses: string = classNames("authenticator", {
        "with-labels": showLabels
    });

    /**
     * Updates the internal selected authenticators state when the prop changes.
     */
    useEffect(() => {
        if (!selected) {
            return;
        }

        setSelectedAuthenticators(selected);
    }, [ selected ]);

    const isFactorEnabled = (authenticator: GenericAuthenticatorInterface): boolean => {
        if (authenticator.category === AuthenticatorCategories.SECOND_FACTOR) {
            // If there is only one step in the flow, second factor authenticators shouldn't be allowed.
            if (currentStep === 0) {
                return false;
            }

            return SignInMethodUtils.isSecondFactorAdditionValid(
                authenticator.defaultAuthenticator.authenticatorId,
                currentStep,
                authenticationSteps
            );
        }

        if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
            // If there is only one step in the flow, backup code authenticator shouldn't be allowed.
            if (currentStep === 0) {
                return false;
            }

            // If there exist 2FAs in the current step backup code authenticator should be enabled.
            // Otherwise, it should be disabled.
            return SignInMethodUtils.countTwoFactorAuthenticatorsInCurrentStep(
                currentStep,
                authenticationSteps
            ) > 0;
        }

        if ([
            IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID,
            IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ].includes(authenticator.id)) {
            return SignInMethodUtils.isFirstFactorValid(currentStep, authenticationSteps);
        }

        return true;
    };

    /**
     * Resolve popup content.
     *
     * @param authenticator - Authenticator.
     *
     * @returns React element.
     */
    const resolvePopupContent = (authenticator: GenericAuthenticatorInterface): ReactElement => {
        const InfoLabel: JSX.Element = (
            <Label attached="top">
                <Icon name="info circle" /> Info
            </Label>
        );

        if (authenticator.category === AuthenticatorCategories.SECOND_FACTOR) {
            return (
                <>
                    { currentStep === 0 ? (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { applicationConfig.signInMethod.authenticatorSelection.messages
                                    .secondFactorDisabledInFirstStep ??
                                    t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                        ".secondFactorDisabledInFirstStep"
                                    ) }
                            </Text>
                        </Fragment>
                    ) : (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { applicationConfig.signInMethod.authenticatorSelection.messages
                                    .secondFactorDisabled ?? (
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.authenticationFlow.sections" +
                                                ".stepBased.secondFactorDisabled"
                                        }
                                    >
                                            The second-factor authenticators can only be used if{ " " }
                                        <Code withBackground>Username & Password</Code>,{ " " }
                                        <Code withBackground>Social Login</Code>,
                                        <Code withBackground>Security Key/Biometrics</Code>
                                            or any other handlers that can handle these factors are
                                            present in a previous step.
                                    </Trans>
                                ) }
                            </Text>
                        </Fragment>
                    ) }
                </>
            );
        } else if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
            return (
                <>
                    { currentStep === 0 ? (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { t(
                                    "console:develop.features.applications.edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                    ".backupCodesDisabledInFirstStep"
                                ) }
                            </Text>
                        </Fragment>
                    ) : (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { t(
                                    "console:develop.features.applications.edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                    ".backupCodesDisabled"
                                ) }
                            </Text>
                        </Fragment>
                    ) }
                </>
            );
        } else if (authenticator.category === AuthenticatorCategories.SOCIAL) {
            return (
                <Fragment>
                    { InfoLabel }
                    <Text>
                        { t(
                            "console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased.authenticatorDisabled"
                        ) }
                    </Text>
                </Fragment>
            );
        } else if ([
            IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID,
            IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ].includes(authenticator.id)) {
            return (
                <Fragment>
                    { InfoLabel }
                    <Text>
                        {
                            t(
                                "console:develop.features.applications.edit.sections" +
                                ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                ".firstFactorDisabled"
                            )
                        }
                    </Text>
                </Fragment>
            );
        }
    };

    /**
     * Handles authenticator select.
     *
     * @param selectedAuthenticator - Selected Authenticator.
     */
    const handleAuthenticatorSelect = (selectedAuthenticator: GenericAuthenticatorInterface): void => {
        if (!selectedAuthenticator.isEnabled) {
            return;
        }

        if (selectedAuthenticators.some((authenticator: GenericAuthenticatorInterface) =>
            authenticator.id === selectedAuthenticator.id)) {
            const filtered: GenericAuthenticatorInterface[] = selectedAuthenticators
                .filter((authenticator: GenericAuthenticatorInterface) => {
                    return authenticator.id !== selectedAuthenticator.id;
                });

            onAuthenticatorSelect(filtered);
            setSelectedAuthenticators(filtered);

            return;
        }

        onAuthenticatorSelect([ ...selectedAuthenticators, selectedAuthenticator ]);
        setSelectedAuthenticators([ ...selectedAuthenticators, selectedAuthenticator ]);
    };

    /**
     * Resolve Authenticator labels.
     *
     * @param authenticator - Authenticator.
     *
     * @returns Authenticator labels.
     */
    const resolveAuthenticatorLabels = (authenticator: FederatedAuthenticatorInterface): string[] => {
        if (!authenticator) {
            return [];
        }

        return AuthenticatorMeta.getAuthenticatorLabels(authenticator.authenticatorId) ?? [];
    };

    return (
        <Fragment data-testid={ testId }>
            { heading && <Heading as="h6">{ heading }</Heading> }
            { authenticators.map((authenticator: GenericAuthenticatorInterface, index: number) => (
                authenticator.id === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID ?
                    null :
                    (<Popup
                        hoverable
                        hideOnScroll
                        position="top center"
                        key={ index }
                        on="hover"
                        disabled={ isFactorEnabled(authenticator) }
                        content={ resolvePopupContent(authenticator) }
                        trigger={
                            (<InfoCard
                                showTooltips
                                imageSize="micro"
                                className={ authenticatorCardClasses }
                                header={
                                    authenticator.displayName ||
                                    defaultName
                                }
                                disabled={ !isFactorEnabled(authenticator) }
                                selected={
                                    isFactorEnabled(authenticator) &&
                                    Array.isArray(selectedAuthenticators) &&
                                    selectedAuthenticators.some((evalAuthenticator: GenericAuthenticatorInterface) => {
                                        return evalAuthenticator.id === authenticator.id;
                                    })
                                }
                                subHeader={ authenticator.categoryDisplayName }
                                description={ authenticator.description }
                                image={ authenticator.image }
                                tags={ showLabels && resolveAuthenticatorLabels(authenticator?.defaultAuthenticator) }
                                onClick={ () => {
                                    isFactorEnabled(authenticator) && handleAuthenticatorSelect(authenticator);
                                } }
                                imageOptions={ {
                                    floated: false,
                                    inline: true
                                } }
                                data-testid={ `${ testId }-authenticator-${ authenticator.name }` }
                                showCardAction={ false }
                                showSetupGuideButton={ false }
                            />)
                        }
                    />)
            )) }
        </Fragment>
    );
};

/**
 * Default props for the authenticators component.
 */
Authenticators.defaultProps = {
    "data-testid": "authenticators",
    defaultName: "Unknown",
    showLabels: true
};
