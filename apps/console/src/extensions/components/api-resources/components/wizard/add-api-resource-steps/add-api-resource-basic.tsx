/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { Field, FormField, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { ExtendedFeatureConfigInterface } from "../../../../../configs/models";
import { getAPIResourcesForIdenitifierValidation } from "../../../api";
import { APIResourcesConstants } from "../../../constants";
import { APIResourcesListInterface, BasicAPIResourceInterface } from "../../../models";

/**
 * Prop-types for the API resources page component.
 */
interface AddAPIResourceBasicInterface extends SBACInterface<ExtendedFeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * initial basic details
     */
    initalBasicDetails: BasicAPIResourceInterface;
    /**
     * Current identifier validation loading status.
     */
    isIdentifierValidationLoading: boolean;
    /**
     * Trigger submission
     */
    triggerSubmission: boolean;
    /**
     * Set current identifier validation loading status.
     */
    setIdentifierValidationLoading: (loading: boolean) => void;
    /**
     * Set display name.
     */
    setBasicDetails: (basicDetails: BasicAPIResourceInterface) => void;
    /**
     * callback function to invoke after basic details submission.
     */
    submitCallback?: () => void;
}

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const AddAPIResourceBasic: FunctionComponent<AddAPIResourceBasicInterface> = (
    props: AddAPIResourceBasicInterface
): ReactElement => {

    const {
        triggerSubmission,
        initalBasicDetails,
        setBasicDetails,
        submitCallback,
        isIdentifierValidationLoading,
        setIdentifierValidationLoading,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const identifierRef: MutableRefObject<FormField> = useRef<FormField>();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     */
    const submitBasicDetails = (values: Map<string, FormValue>): void => {
        setBasicDetails({
            displayName: values.get("displayName").toString(),
            identifier: values.get("identifier").toString()
        });

        submitCallback && submitCallback();
    };

    return (
        <Forms
            data-testid={ `${componentId}-form` }
            onSubmit={ submitBasicDetails }
            submitState={ triggerSubmission }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            ref={ identifierRef }
                            type="text"
                            name="identifier"
                            label={ t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.form." +
                                "fields.identifier.label") }
                            placeholder={ t("extensions:develop.apiResource.wizard.addApiResource.steps.basic." +
                                "form.fields.identifier.placeholder") }
                            requiredErrorMessage={ t("extensions:develop.apiResource.wizard.addApiResource.steps." +
                                "basic.form.fields.identifier.emptyValidate") }
                            required={ true }
                            tabIndex={ 1 }
                            value={ initalBasicDetails && initalBasicDetails.identifier }
                            validation={ async (value: string, validation: Validation) => {
                                
                                setIdentifierValidationLoading(true);

                                if (!APIResourcesConstants.checkValidPermissionIdentifier(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(t("extensions:develop.apiResource.wizard." +
                                        "addApiResource.steps.basic.form.fields.identifier.invalid"));
                                } else {
                                    const filter: string = "identifier eq " + value;

                                    const response: APIResourcesListInterface = 
                                        await getAPIResourcesForIdenitifierValidation(filter);
    
                                    if (response?.apiResources?.length > 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(t("extensions:develop.apiResource.wizard." +
                                            "addApiResource.steps.basic.form.fields.identifier.alreadyExistsError"));
                                    }
                                }

                                setIdentifierValidationLoading(false);
                            } }
                            data-testid={ `${componentId}-basic-form-identifier` }
                            loading={ isIdentifierValidationLoading }
                        />
                        <Hint className="mb-0">
                            <Trans 
                                i18nKey= { "extensions:develop.apiResource.wizard.addApiResource.steps.basic." +
                                    "form.fields.identifier.hint" }>
                                We recommend using a URI as the identifier, but you do not need to make the URI 
                                publicly available since Asgardeo will not access your API. 
                                Asgardeo will use this identifier value as the audience(aud) claim in the 
                                issued JWT tokens. <b>This field should be unique; once created, it is not editable.</b>
                            </Trans>
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field            
                            type="text"
                            name="displayName"
                            label={ t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.form.fields." + 
                                "name.label") }
                            placeholder={ t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.form." +
                                "fields.name.placeholder") }
                            required={ true }
                            tabIndex={ 2 }
                            requiredErrorMessage={ t("extensions:develop.apiResource.wizard.addApiResource.steps." + 
                                "basic.form.fields.name.emptyValidate") }
                            value={ initalBasicDetails?.displayName }
                            data-testid={ `${componentId}-basic-form-displayName` }
                        />
                        <Hint className="mb-0">
                            { t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.form.fields." +
                                "name.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the component.
 */
AddAPIResourceBasic.defaultProps = {
    "data-componentid": "add-api-resource-basic"
};
