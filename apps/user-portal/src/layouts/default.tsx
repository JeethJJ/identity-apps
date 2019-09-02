/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from "react";
import { Container, Divider, Header } from "semantic-ui-react";
import { Header as AppHeader } from "../components";

interface Props extends React.ComponentProps<any> {
    pageTitle: string;
    pageTitleTextAlign?: "left" | "center" | "right" | "justified";
}

export const DefaultPageLayout = (props: Props) => (
    <>
        <AppHeader />
        <Container style={{ marginTop: "7em" }}>
            { (props.pageTitle || props.pageDescription) &&
            <>
                <Divider className="x2" hidden />
                <Header as="h1" textAlign={props.pageTitleTextAlign}>
                    { props.pageTitle &&
                    <>{ props.pageTitle }</>
                    }
                    { props.pageDescription &&
                    <Header.Subheader>{ props.pageDescription }</Header.Subheader>
                    }
                </Header>
                <Divider className="x2" hidden />
            </>
            }
            { props.children }
        </Container>
    </>
);
