import React from 'react';
import {compose} from 'recompose';
import {Card, Paper, Paragraph, TableBuilder, Text} from '@8base/boost';
import {Query, withApollo} from 'react-apollo';
import gql from "graphql-tag";
import * as R from "ramda";


const CLIENT_TABLE_COLUMNS = [
    {name: 'id', title: 'Id', sortEnable: false},
    {name: 'deliveryDt', title: 'Delivery Dt'},
    {name: 'address', title: 'Address'},
    {name: 'comment', title: 'Comment'},
    {name: 'status', title: 'Status'},
    {name: 'orderItems', title: 'Order Items / Quantity'},
];


class ClientCard extends React.Component {
    CLIENT_QUERY = gql`
  query Client {
    client(id: "${this.props.id}") {
      id,
      firstName,
      lastName,
      phone,
      email,
      birthday,
      orders {
        items {
          id,
          deliveryDt,
          address,
          comment,
          status,
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
  }
}
`;

    renderCell = (column, order) => {

        let rendered = String(order[column.name]);

        switch (column.name) {
            case 'address': {
                rendered = R.pathOr('1', ['address'], order);
                break
            }
            case 'orderItems': {
                // Уверен, что есть более элегантное решение для вывода данных, но остальные мои способы не сработали

                if (order.orderItems.items.length !== 0) {
                    order.orderItems.items.map(element => (
                        rendered = element.product.name + " / " + element.quantity
                    ));
                } else {
                    rendered = "No products"
                }

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


        const tableData = R.pathOr([], ['client', 'orders', 'items'], data);
        const total = R.pathOr(null, ['orders', 'count'], data);
        const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

        return (
            <Card>
                <Card.Header><Text weight="bold"> {R.pathOr('First Name', ['client', 'firstName'], data)} {R.pathOr('Last Name', ['client', 'lastName'], data)}</Text></Card.Header>
                <Card.Body>
                    <Card.Section>
                        <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">ID:</Text> {R.path(['client', 'id'], data)}</Paragraph>
                    </Card.Section>
                    <Card.Section>
                        <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">First Name:</Text> {R.path(['client', 'firstName'], data)}</Paragraph>
                    </Card.Section>
                    <Card.Section>
                        <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">Last Name:</Text> {R.path(['client', 'lastName'], data)}</Paragraph>
                    </Card.Section>
                    <Card.Section>
                        <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">Phone:</Text> {R.path(['client', 'phone'], data)}</Paragraph>
                    </Card.Section>

                    <Paper padding="xl">
                        <TableBuilder
                            columns={CLIENT_TABLE_COLUMNS}
                            data={tableData}
                            loading={loading}
                            tableState={finalTableState}
                            onChange={onChange}
                            renderCell={this.renderCell}
                            withPagination
                        />
                    </Paper>
                </Card.Body>
            </Card>
        );
    };

    render() {
        return <Query query={this.CLIENT_QUERY}>{this.renderContent}</Query>
    }
}


ClientCard = compose(
    withApollo,
)(ClientCard);


export {ClientCard};