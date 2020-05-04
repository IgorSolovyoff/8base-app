import React from 'react';
import { compose } from 'recompose';
import * as R from 'ramda';
import {Table, Dropdown, Icon, Menu, withModal, Tag} from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import {Link} from "react-router-dom";
import {OrderCreateDialog} from "./OrderCreateDialog";
import {OrderDeleteDialog} from "./OrderDeleteDialog";


let OrdersTable = ({ orders, openModal, closeModal }) => (
    <Table>
        <Table.Header columns="repeat(5, 1fr) 60px">
            <Table.HeaderCell>id</Table.HeaderCell>
            <Table.HeaderCell>Products</Table.HeaderCell>
            <Table.HeaderCell>Order</Table.HeaderCell>
            <Table.HeaderCell>quantity</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            <Table.HeaderCell />
        </Table.Header>

        <Table.Body loading={ orders.loading } data={ R.pathOr([], ['orderItemsList', 'items'], orders) } action="Create Order" onActionClick={() => openModal(OrderCreateDialog.id)}>
            {
                (order) => (
                    <Table.BodyRow columns="repeat(5, 1fr) 60px" key={ order.id }>
                        <Table.BodyCell>
                            { R.pathOr('No id', ['id'], order) }
                        </Table.BodyCell>
                        <Table.BodyCell>
                            <Tag>{ R.pathOr('No Products', ['product', 'name'], order) }</Tag>
                        </Table.BodyCell>
                        <Table.BodyCell>
                            <Tag>{ R.pathOr('No Order', ['order', 'address'], order) }</Tag>
                        </Table.BodyCell>
                        <Table.BodyCell>
                            { R.pathOr(0, ['quantity'], order) }
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {/*Вывод общей цены и округление до 2х знаков после запятой*/}
                            {Math.floor(+order.product.price * +order.quantity * 100) / 100}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            <Dropdown defaultOpen={ false }>
                                <Dropdown.Head>
                                    <Icon name="More" color="LIGHT_GRAY2" />
                                </Dropdown.Head>
                                <Dropdown.Body pin="right">
                                    {
                                        ({ closeDropdown }) => (
                                            <Menu>
                                                <Menu.Item><Link style={{color: "inherit", textDecoration: "none"}} to={"/order/" + order.order.id}>View</Link></Menu.Item>
                                                <Menu.Item onClick={ () => {openModal(OrderDeleteDialog.id, {id: order.id}); closeDropdown(); }}>Delete</Menu.Item>
                                            </Menu>
                                        )
                                    }
                                </Dropdown.Body>
                            </Dropdown>
                        </Table.BodyCell>
                    </Table.BodyRow>
                )
            }
        </Table.Body>
    </Table>
);

OrdersTable = compose(
    withModal,
    graphql(sharedGraphQL.ORDER_ITEMS_LIST_QUERY, { name: 'orders' }),
)(OrdersTable);

export { OrdersTable };
