import React from 'react';
import {Field, Form} from '@8base/forms';
import {Button, DateInputField, Dialog, Grid, InputField, ModalContext, SelectField} from '@8base/boost';
import {graphql, Query} from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import {TOAST_SUCCESS_MESSAGE} from 'shared/constants';


const CLIENT_EDIT_DIALOG_ID = 'CLIENT_EDIT_DIALOG_ID';


class ClientEditDialog extends React.Component {
    static contextType = ModalContext;

    createOnSubmit = (id) => async (data) => {
        await this.props.clientUpdate({variables: {data: {...data, id}}});

        this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
    };

    onClose = () => {
        this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
    };

    renderFormContent = ({handleSubmit, invalid, submitting, pristine}) => (
        <form onSubmit={handleSubmit}>
            <Dialog.Header title="Edit Client" onClose={this.onClose}/>
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
                            stretch
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Query query={sharedGraphQL.ORDERS_LIST_QUERY}>
                            {
                                ({data, loading}) => {
                                    return (
                                    <Field
                                        name="orders"
                                        label="Orders"
                                        placeholder="Select a user"
                                        component={SelectField}
                                        loading={loading}
                                        options={loading ? [] : (data.ordersList.items || []).map(order => ({ value: order.id, label: `${order.address}` }))}
                                        stretch
                                        multiple
                                    />
                                )}
                            }
                        </Query>
                    </Grid.Box>
                </Grid.Layout>
            </Dialog.Body>
            <Dialog.Footer>
                <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>Cancel</Button>
                <Button color="primary" type="submit" disabled={pristine || invalid} loading={submitting}>Update Client</Button>
            </Dialog.Footer>
        </form>
    );

    renderForm = ({args}) => {
        return (
            <Form type="UPDATE" tableSchemaName="Clients" onSubmit={this.createOnSubmit(args.initialValues.id)}
                  initialValues={args.initialValues} formatRelationToIds>
                {this.renderFormContent}
            </Form>
        );
    };

    render() {
        return (
            <Dialog id={CLIENT_EDIT_DIALOG_ID} size="sm">
                {this.renderForm}
            </Dialog>
        );
    }
}

ClientEditDialog = graphql(sharedGraphQL.CLIENT_UPDATE_MUTATION, {
    name: 'clientUpdate',
    options: {
        refetchQueries: ['Clients'],
        context: {
            [TOAST_SUCCESS_MESSAGE]: 'Client successfully updated'
        },
    },
})(ClientEditDialog);

ClientEditDialog.id = CLIENT_EDIT_DIALOG_ID;

export {ClientEditDialog};