import React from 'react';
import {Field, Form} from '@8base/forms';
import {Button, Dialog, Grid, InputField, ModalContext} from '@8base/boost';
import {graphql} from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import {TOAST_SUCCESS_MESSAGE} from 'shared/constants';
import {FileInputField} from "../../shared/components";


const PRODUCT_EDIT_DIALOG_ID = 'PRODUCT_EDIT_DIALOG_ID';


class ProductEditDialog extends React.Component {
    static contextType = ModalContext;

    createOnSubmit = (id) => async (data) => {
        await this.props.productUpdate({variables: {data: {...data, id}}});

        this.context.closeModal(PRODUCT_EDIT_DIALOG_ID);
    };

    onClose = () => {
        this.context.closeModal(PRODUCT_EDIT_DIALOG_ID);
    };

    renderFormContent = ({ handleSubmit, invalid, submitting, pristine}) => {
        return (
            <form onSubmit={handleSubmit}>
                <Dialog.Header title="Edit Product" onClose={this.onClose}/>
                <Dialog.Body scrollable>
                    <Grid.Layout gap="sm" stretch>
                        <Grid.Layout gap="sm" stretch>
                            <Grid.Box>
                                <img style={{margin: "auto", width: "150px", height: "150px", maxWidth: "100%"}} width="150px" height="150px" src={this.context.state.PRODUCT_EDIT_DIALOG_ID.args.initialValues.picture.downloadUrl} alt=""/>
                                <Field name="picture" label="Picture" component={FileInputField} maxFiles={1}/>
                            </Grid.Box>
                            <Grid.Box>
                                <Field component={InputField} name="name" label="Name"/>
                            </Grid.Box>
                            <Grid.Box>
                                <Field component={InputField} name="description" label="Description"/>
                            </Grid.Box>
                            <Grid.Box>
                                <Field component={InputField} name="price" label="Price"/>
                            </Grid.Box>
                        </Grid.Layout>
                    </Grid.Layout>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button color="neutral" variant="outlined" disabled={submitting}
                            onClick={this.onClose}>Cancel</Button>
                    <Button color="primary" type="submit" disabled={pristine || invalid} loading={submitting}>Update
                        Product</Button>
                </Dialog.Footer>
            </form>
        )
    };

    renderForm = ({args}) => {
        return (
            <Form type="UPDATE" tableSchemaName="Products" onSubmit={this.createOnSubmit(args.initialValues.id)}
                  initialValues={args.initialValues} formatRelationToIds>
                {this.renderFormContent}
            </Form>
        );
    };

    render() {
        return (
            <Dialog id={PRODUCT_EDIT_DIALOG_ID} size="sm">
                {this.renderForm}
            </Dialog>
        );
    }
}

ProductEditDialog = graphql(sharedGraphQL.PRODUCT_UPDATE_MUTATION, {
    name: 'productUpdate',
    options: {
        refetchQueries: ['Products'],
        context: {
            [TOAST_SUCCESS_MESSAGE]: 'Product successfully updated'
        },
    },
})(ProductEditDialog);

ProductEditDialog.id = PRODUCT_EDIT_DIALOG_ID;

export {ProductEditDialog};