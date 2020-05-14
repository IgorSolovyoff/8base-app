import React from 'react';
import {Field, FieldArray, Form} from '@8base/forms';
import {
    Button,
    DateInputField,
    Dialog,
    Grid,
    Icon,
    InputField,
    ModalContext,
    SelectField
} from '@8base/boost';
import {graphql, Query} from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import {TOAST_SUCCESS_MESSAGE} from 'shared/constants';


const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';

const parse = value => (isNaN(parseInt(value)) ? "" : parseInt(value));

class OrderCreateDialog extends React.Component {
    static contextType = ModalContext;

    onSubmit = async (data) => {
        await this.props.orderCreate({variables: {data}});
        this.context.closeModal(ORDER_CREATE_DIALOG_ID);
    };

    onClose = () => {
        this.context.closeModal(ORDER_CREATE_DIALOG_ID);
    };

    renderFormContent = ({handleSubmit, invalid, submitting, pristine, form: {mutators: {push}}}) => (
        <form onSubmit={handleSubmit}>
            <Dialog.Header title="New Order" onClose={this.onClose}/>
            <Dialog.Body scrollable>
                <Grid.Layout gap="sm" stretch>
                    <Grid.Box>
                        <Query query={sharedGraphQL.CLIENTS_LIST_QUERY}>
                            {
                                ({data, loading}) => {
                                    return (
                                        <Field
                                            name="client.connect.id"
                                            label="Client"
                                            placeholder="Select a client"
                                            component={SelectField}
                                            loading={loading}
                                            options={loading ? [] : (data.clientsList.items || []).map(client => ({
                                                value: client.id,
                                                label: `${client.firstName}`
                                            }))}
                                            stretch
                                        />
                                    )
                                }
                            }
                        </Query>
                    </Grid.Box>
                    <Grid.Box>

                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            name="address"
                            label="Address"
                            placeholder="Type address"
                            component={InputField}
                            stretch
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            name="deliveryDt"
                            label="Delivery dt"
                            placeholder="Type address"
                            component={DateInputField}
                            withTime
                            stretch
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            name="comment"
                            label="Comment"
                            type="text"
                            placeholder="Leave a comment"
                            component={InputField}
                            stretch
                        />
                    </Grid.Box>
                    <Grid.Box>
                        <Field
                            name="status"
                            label="Status"
                            placeholder="Select a status"
                            component={ SelectField }
                            options={ [
                                { label: 'Opened', value: 'Opened' },
                                { label: 'Paid', value: 'Paid' },
                                { label: 'Ready to delivery', value: 'ReadyToDelivery' },
                                { label: 'Delivering', value: 'Delivering' },
                                { label: 'Closed', value: 'Closed' },
                                { label: 'Cancelled', value: 'Cancelled' },
                            ] }
                            stretch
                        />
                    </Grid.Box>
                    <FieldArray name="orderItems.create">
                        {({fields}) =>
                            fields.map((name, index) => (
                                <div key={name}>
                                    <Grid.Box style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: "10px"}}>
                                        <span style={{fontSize: "16px"}}>
                                            Product {index + 1}
                                        </span>
                                        <Button size="sm" squared onClick={() => fields.remove(index)}><Icon size="sm" name="Trashcan"/></Button>
                                    </Grid.Box>
                                    <Grid.Box>
                                        <Query query={sharedGraphQL.PRODUCTS_LIST_QUERY}>
                                            {
                                                ({data, loading}) => {
                                                    return (
                                                        <Field
                                                            name={`${name}.product.connect.id`}
                                                            label="Name"
                                                            placeholder="Select a product"
                                                            component={SelectField}
                                                            loading={loading}
                                                            options={loading ? [] : (data.productsList.items || []).map(product => ({
                                                                value: product.id,
                                                                label: `${product.name}`
                                                            }))}
                                                            stretch
                                                        />
                                                    )
                                                }
                                            }
                                        </Query>
                                    </Grid.Box>
                                    <Grid.Box>
                                        <Field
                                            type="number"
                                            name={`${name}.quantity`}
                                            label="Quantity"
                                            placeholder="Number"
                                            component={InputField}
                                            value={0}
                                            stretch
                                            required
                                            parse={parse}
                                        />
                                    </Grid.Box>
                                </div>
                            ))
                        }
                    </FieldArray>
                    <Button color={"primary"} type="button"
                            onClick={() => push('orderItems.create', undefined)}>Add a Product</Button>
                </Grid.Layout>
            </Dialog.Body>
            <Dialog.Footer>
                <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>Cancel</Button>
                <Button color="primary" type="submit" loading={submitting}>Create Order</Button>
            </Dialog.Footer>
        </form>
    );

    render() {
        return (
            <Dialog id={ORDER_CREATE_DIALOG_ID} size="sm">
                <Form type="CREATE" tableSchemaName="Order" onSubmit={this.onSubmit}>
                    {this.renderFormContent}
                </Form>
            </Dialog>
        );
    }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDER_CREATE_MUTATION, {
    name: 'orderCreate',
    options: {
        refetchQueries: ['Orders'],
        context: {
            [TOAST_SUCCESS_MESSAGE]: 'Order successfully created'
        },
    },
})(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export {OrderCreateDialog};