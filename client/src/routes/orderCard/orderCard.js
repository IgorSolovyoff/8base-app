import React from 'react';
import {compose} from 'recompose';
import {Card, Paragraph, TableBuilder, Text} from '@8base/boost';
import {Query, withApollo} from 'react-apollo';
import gql from "graphql-tag";
import * as R from "ramda";


const ORDER_TABLE_COLUMNS = [
    {name: 'name', title: 'name', sortEnable: false},
    {name: 'quantity', title: 'quantity'}
];


class OrderCard extends React.Component {
    ORDER_QUERY = gql`
        query Order {
          order(id: "${this.props.id}") {
            id,
            client {
              firstName
            }
            address
            deliveryDt
            comment
            status
            orderItems {
              items {
                product {
                  name
                }
                quantity
              }
            }
          }
        }
      `;
    renderCell = (column, order) => {

        let rendered = String(order[column.name]);

        switch (column.name) {
            case 'name': {
                rendered = R.pathOr('No First Name', ['product', 'name'], order);
                break;
            }

            default: {
                break;
            }
        }

        return rendered;
    };

    renderContent = ({data, loading}) => {
        const {tableState, onChange} = this.props;


        const tableData = R.pathOr([], ['order', 'orderItems', 'items'], data);
        const total = R.pathOr(null, ['order', 'orderItems', 'count'], data);
        const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

        return (
            <Card.Body>
                <Card.Section>
                    <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                        weight="bold">Id:</Text> {R.pathOr('No Id', ['order', 'id'], data)}</Paragraph>
                </Card.Section>
                <Card.Section>
                    <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">First
                        Name: </Text> {R.pathOr('No First Name', ['order', 'client', 'firstName'], data)}</Paragraph>
                </Card.Section>
                <Card.Section>
                    <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                        weight="bold">Address: </Text> {R.pathOr('No Address', ['order', 'address'], data)}</Paragraph>
                </Card.Section>
                <Card.Section>
                    <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">Delivery
                        Dt: </Text> {R.pathOr('No Delivery Dt', ['order', 'deliveryDt'], data)}</Paragraph>
                </Card.Section>
                <Card.Section>
                    <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                        weight="bold">Comment: </Text> {R.pathOr('No Comment', ['order', 'comment'], data)}</Paragraph>
                </Card.Section>
                <Card.Section>
                    <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                        weight="bold">Status: </Text> {R.pathOr('No Status', ['order', 'status'], data)}</Paragraph>
                </Card.Section>
                <Card.Section>
                    <Text weight="bold">Order items:</Text>
                    <br/>
                    <br/>
                    <TableBuilder
                        columns={ORDER_TABLE_COLUMNS}
                        data={tableData}
                        loading={loading}
                        tableState={finalTableState}
                        onChange={onChange}
                        renderCell={this.renderCell}
                        withPagination
                    />
                </Card.Section>
            </Card.Body>
        );
    };

    render() {
        return <Query query={this.ORDER_QUERY}>{this.renderContent}</Query>
    }
}


OrderCard = compose(
    withApollo,
)(OrderCard);


export {OrderCard};