import React from 'react';
import {Field, Form} from '@8base/forms';
import {Button, Dialog, Grid, InputField, ModalContext, SelectField} from '@8base/boost';
import {graphql, Query} from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import {TOAST_SUCCESS_MESSAGE} from 'shared/constants';


const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';

class OrderCreateDialog extends React.Component {
    static contextType = ModalContext;

    onSubmit = async (data) => {
        await this.props.orderItemCreate({variables: {data}});

        this.context.closeModal(ORDER_CREATE_DIALOG_ID);
    };

    onClose = () => {
        this.context.closeModal(ORDER_CREATE_DIALOG_ID);
    };

    renderFormContent = ({handleSubmit, invalid, submitting, pristine}) => (
        <form onSubmit={handleSubmit}>
            <Dialog.Header title="New Order Item" onClose={this.onClose}/>
            <Dialog.Body scrollable>
                <Grid.Layout gap="sm" stretch>
                    <Grid.Box>
                        <Query query={sharedGraphQL.PRODUCTS_LIST_QUERY}>
                            {
                                ({data, loading}) => {
                                    return (
                                        <Field
                                            name="product"
                                            label="Product"
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
                        <Query query={sharedGraphQL.ORDERS_LIST_QUERY}>
                            {
                                ({data, loading}) => {
                                    return (
                                        <Field
                                            name="order"
                                            label="Order"
                                            placeholder="Select an order"
                                            component={SelectField}
                                            loading={loading}
                                            options={loading ? [] : (data.ordersList.items || []).map(order => ({
                                                value: order.id,
                                                label: `${order.address}`
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
                            name="quantity"
                            label="Quantity"
                            placeholder="Number"
                            component={InputField}
                            stretch
                            required
                        />
                    </Grid.Box>
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
                <Form type="CREATE" tableSchemaName="OrderItems" onSubmit={this.onSubmit}>
                    {this.renderFormContent}
                </Form>
            </Dialog>
        );
    }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDER_CREATE_MUTATION, {
    name: 'orderItemCreate',
    options: {
        refetchQueries: ['OrderItems'],
        context: {
            [TOAST_SUCCESS_MESSAGE]: 'Order successfully created'
        },
    },
})(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export {OrderCreateDialog};