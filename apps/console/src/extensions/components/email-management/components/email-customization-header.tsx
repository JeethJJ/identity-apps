/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Segment } from "semantic-ui-react";
import { EmailTemplateType } from "../models";

const FORM_ID: string = "email-customization-header-form";

interface EmailCustomizationHeaderProps extends IdentifiableComponentInterface {
    /**
     * Selected email template id.
     */
    selectedEmailTemplateId: string;

    /**
     * Selected email template description.
     */
    selectedEmailTemplateDescription: string;

    /**
     * Selected locale
     */
    selectedLocale: string;

    /**
     * Email templates list.
     */
    emailTemplatesList: EmailTemplateType[];

    /**
     * Callback to be called when the template is changed.
     * @param templateId - selected template id from the dropdown
     */
    onTemplateSelected: (templateId: string) => void;

    /**
     * Callback to be called when the locale is change
     * @param locale - selected locale for template
     */
    onLocaleChanged: (locale: string) => void;
}

/**
 * Email customization header.
 *
 * @param props - Props injected to the component.
 *
 * @returns Header component for Email Customization.
 */
const EmailCustomizationHeader: FunctionComponent<EmailCustomizationHeaderProps> = (
    props: EmailCustomizationHeaderProps
): ReactElement => {
    const {
        selectedEmailTemplateId,
        selectedEmailTemplateDescription,
        selectedLocale,
        emailTemplatesList,
        onTemplateSelected,
        onLocaleChanged,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const emailTemplateListOptions: { text: string, value: string }[] = useMemo(() => {
        return emailTemplatesList?.map((template: EmailTemplateType) => {
            return {
                text: template.displayName,
                value: template.id
            };
        });
    }, [ emailTemplatesList ]);

    const localeList: { text: string, value: string }[] = [
        { text: "en-US", value: "en-US" },
        { text: "fr-FR", value: "fr-FR" },
        { text: "es-ES", value: "es-ES" },
        { text: "pt-PT", value: "pt-PT" },
        { text: "de-DE", value: "de-DE" }
    ];

    return (
        <Segment
            className="mb-4 p-4"
            data-componentid={ componentId }
            padded={ "very" }
        >
            <Form
                id={ FORM_ID }
                uncontrolledForm={ true }
                onSubmit={ () => { return; } }
            >
                <Grid>
                    <Grid.Column
                        mobile={ 16 }
                        computer={ 8 }
                    >
                        <Field.Dropdown
                            ariaLabel="Email Template Dropdown"
                            name="selectedEmailTemplate"
                            label={ t("extensions:develop.emailTemplates.form.inputs.template.label") }
                            options={ emailTemplateListOptions }
                            required={ true }
                            data-componentid={ `${ componentId }-email-template-list` }
                            hint={ selectedEmailTemplateDescription ?? null }
                            placeholder={ t("extensions:develop.emailTemplates.form.inputs.template.placeholder") }
                            value={ selectedEmailTemplateId }
                            listen={ onTemplateSelected }
                        />
                    </Grid.Column>

                    <Grid.Column
                        mobile={ 16 }
                        computer={ 8 }
                    >
                        <Field.Dropdown
                            ariaLabel="Email Template Locale Dropdown"
                            name="selectedEmailTemplateLocale"
                            label={ t("extensions:develop.emailTemplates.form.inputs.locale.label") }
                            options={ localeList }
                            required={ true }
                            data-componentid={ `${ componentId }-email-template-locale` }
                            placeholder={ t("extensions:develop.emailTemplates.form.inputs.locale.placeholder") }
                            defaultValue={ selectedLocale }
                            value={ selectedLocale }
                            listen={ onLocaleChanged }
                        />
                    </Grid.Column>
                </Grid>
            </Form>
        </Segment>
    );
};

/**
 * Default props for the component.
 */
EmailCustomizationHeader.defaultProps = {
    "data-componentid": "email-customization-header"
};

export default EmailCustomizationHeader;
