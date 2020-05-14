import React from 'react';
import {compose} from 'recompose';
import * as R from 'ramda';
import {Dropdown, Icon, Menu, Table, Tag, withModal} from '@8base/boost';
import {graphql} from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import {Link} from "react-router-dom";
import {OrderCreateDialog} from "./OrderCreateDialog";
import {OrderDeleteDialog} from "./OrderDeleteDialog";
import {OrderTotal} from "./OrderTotal";



let OrdersTable = ({ordersList, openModal, closeModal}) => (
    <Table>
        <Table.Header columns="repeat(8, 1fr) 60px">
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Client</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Delivery Dt</Table.HeaderCell>
            <Table.HeaderCell>Comment</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Product / Quantity</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            <Table.HeaderCell/>
        </Table.Header>

        <Table.Body loading={ordersList.loading} data={R.pathOr([], ['ordersList', 'items'], ordersList)}
                    action="Create Order" onActionClick={() => openModal(OrderCreateDialog.id)}>
            {
                (order) => (
                    <Table.BodyRow columns="repeat(8, 1fr) 60px" key={order.id}>
                        <Table.BodyCell>
                            {R.pathOr('No id', ['id'], order)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No Client', ['client', 'firstName'], order)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            <div style={{width: "250px"}}>
                                <Tag>{R.pathOr('No address', ['address'], order)}</Tag>
                            </div>
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No delivery dt', ['deliveryDt'], order)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No comment', ['comment'], order)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No status', ['status'], order)}
                        </Table.BodyCell>
                        <Table.BodyCell style={{flexDirection: "column"}}>
                            {order.orderItems.items.length !== 0 ?  (
                                order.orderItems.items.map((element, index) => (
                                    <div key={index} style={{width: "200px", margin: "5px auto 5px 0"}}>
                                        <Tag>{element.product.name + " / " + element.quantity}</Tag>
                                    </div>
                                ))) : "No order items"
                            }
                        </Table.BodyCell>
                        <Table.BodyCell>
                            <div style={{width: "100px", margin: "5px auto 5px 0"}}>
                                {order.orderItems.items.length !== 0 ? (
                                        <OrderTotal id={order.id}/>
                                    )
                                    : "0"
                                }
                            </div>
                        </Table.BodyCell>
                        <Table.BodyCell>
                            <Dropdown defaultOpen={false}>
                                <Dropdown.Head>
                                    <Icon name="More" color="LIGHT_GRAY2"/>
                                </Dropdown.Head>
                                <Dropdown.Body pin="right">
                                    {
                                        ({closeDropdown}) => (
                                            <Menu>
                                                <Menu.Item><Link style={{color: "inherit", textDecoration: "none"}}
                                                                 to={"/order/" + order.id}>View</Link></Menu.Item>
                                                <Menu.Item onClick={() => {
                                                    openModal(OrderDeleteDialog.id, {id: order.id});
                                                    closeDropdown();
                                                }}>Delete</Menu.Item>
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
    graphql(sharedGraphQL.ORDERS_LIST_QUERY, {name: 'ordersList'}),
)(OrdersTable);

export {OrdersTable};
