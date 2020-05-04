import React from 'react';
import {Field, Form} from '@8base/forms';
import {Button, DateInputField, Dialog, Grid, InputField, ModalContext} from '@8base/boost';
import {graphql} from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import {TOAST_SUCCESS_MESSAGE} from 'shared/constants';


const CLIENT_CREATE_DIALOG_ID = 'CLIENT_CREATE_DIALOG_ID';

class ClientCreateDialog extends React.Component {
    static contextType = ModalContext;

    onSubmit = async (data) => {
        await this.props.clientCreate({variables: {data}});

        this.context.closeModal(CLIENT_CREATE_DIALOG_ID);
    };

    onClose = () => {
        this.context.closeModal(CLIENT_CREATE_DIALOG_ID);
    };

    renderFormContent = ({handleSubmit, invalid, submitting, pristine}) => (
        <form onSubmit={handleSubmit}>
            <Dialog.Header title="New Client" onClose={this.onClose}/>
            <Dialog.Body scrollable>
                <Grid.Layout gap="sm" stretch>
                    <Grid.Box>
                        <Field
                            type="text"
                            name="firstName"
                            label="First Name"
                            placeholder="Tony"
                            component={InputField}
                            stretch="true"
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            type="text"
                            name="lastName"
                            label="Last Name"
                            placeholder="Stark"
                            component={InputField}
                            stretch="true"
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="ironman@avengers.com"
                            component={InputField}
                            stretch="true"
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            type="phone"
                            name="phone"
                            label="Phone"
                            placeholder="+7 999 99 99 99"
                            component={InputField}
                            stretch="true"
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            name="birthday"
                            label="Birthday"
                            placeholder="Pick a date"
                            component={DateInputField}
                            stretch="true"
                        />
                    </Grid.Box>
                </Grid.Layout>
            </Dialog.Body>
            <Dialog.Footer>
                <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>Cancel</Button>
                <Button color="primary" type="submit" loading={submitting}>Create Client</Button>
            </Dialog.Footer>
        </form>
    );

    render() {
        return (
            <Dialog id={CLIENT_CREATE_DIALOG_ID} size="sm">
                <Form type="CREATE" tableSchemaName="Clients" onSubmit={this.onSubmit}>
                    {this.renderFormContent}
                </Form>
            </Dialog>
        );
    }
}

ClientCreateDialog = graphql(sharedGraphQL.CLIENT_CREATE_MUTATION, {
    name: 'clientCreate',
    options: {
        refetchQueries: ['Clients'],
        context: {
            [TOAST_SUCCESS_MESSAGE]: 'Client successfully created'
        },
    },
})(ClientCreateDialog);

ClientCreateDialog.id = CLIENT_CREATE_DIALOG_ID;

export {ClientCreateDialog};