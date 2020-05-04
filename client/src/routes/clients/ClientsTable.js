import React from 'react';
import {compose} from 'recompose';
import * as R from 'ramda';
import {Dropdown, Icon, Menu, Table, Tag, withModal} from '@8base/boost';
import {graphql} from 'react-apollo';
import {Link} from "react-router-dom";

import * as sharedGraphQL from 'shared/graphql';

import {ClientCreateDialog} from "./ClientCreateDialog";
import {ClientDeleteDialog} from "./ClientDeleteDialog";
import {ClientEditDialog} from "./ClientEditDialog";


let ClientsTable = ({clients, openModal, closeModal}) => (
    <Table>
        <Table.Header columns="repeat(6, 1fr) 60px">
            <Table.HeaderCell>First Name</Table.HeaderCell>
            <Table.HeaderCell>Last Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Birthday</Table.HeaderCell>
            <Table.HeaderCell>Orders</Table.HeaderCell>
            <Table.HeaderCell/>
        </Table.Header>

        <Table.Body loading={clients.loading} data={R.pathOr([], ['clientsList', 'items'], clients)}
                    action="Create Client" onActionClick={() => openModal(ClientCreateDialog.id)}>
            {
                (client) => (
                    <Table.BodyRow columns="repeat(6, 1fr) 60px" key={client.id}>
                        <Table.BodyCell>
                            {R.pathOr('No first name', ['firstName'], client)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No last name', ['lastName'], client)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No email', ['email'], client)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No phone', ['phone'], client)}
                        </Table.BodyCell>
                        <Table.BodyCell>
                            {R.pathOr('No date', ['birthday'], client)}
                        </Table.BodyCell>
                        <Table.BodyCell style={{flexDirection: "column"}}>
                            {client.orders.items.map(element => (
                                <div key={element.id} style={{width: "100px", margin: "5px auto 5px 0"}}>
                                    <Tag>{element.address}</Tag>
                                </div>
                            ))}
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
                                                <Menu.Item><Link style={{textDecoration: "none", color: "inherit"}}
                                                                 to={"/client/" + client.id}>View</Link></Menu.Item>
                                                <Menu.Item onClick={() => {
                                                    openModal(ClientEditDialog.id, {  initialValues: client });
                                                    closeDropdown();
                                                }}>Edit</Menu.Item>
                                                <Menu.Item onClick={() => {
                                                    openModal(ClientDeleteDialog.id, {id: client.id});
                                                    closeDropdown();
                                                }}>Delete </Menu.Item>
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

ClientsTable = compose(
    withModal,
    graphql(sharedGraphQL.CLIENTS_LIST_QUERY, {name: 'clients'}),
)(ClientsTable);

export {ClientsTable};
