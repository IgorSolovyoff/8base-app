import React from 'react';
import {Button, Card, Paragraph, TableBuilder, Text} from '@8base/boost';
import {useMutation, useQuery, useSubscription} from 'react-apollo';
import gql from "graphql-tag";
import * as R from "ramda";
import {Redirect} from "react-router-dom"
import debounce from 'lodash.debounce';


const ORDER_TABLE_COLUMNS = [
    {name: 'name', title: 'name', sortEnable: false},
    {name: 'quantity', title: 'quantity'}
];

const ORDER_MUTATION = gql`
mutation OrderCommentUpdate($data: OrderUpdateInput!, $filter: OrderKeyFilter!) {
  orderUpdate(filter: $filter, data: $data)  {
    comment
  }
}
`;


const ORDER_SUBSCRIPTION = gql`
    subscription ordersUpdate {
      Orders {
        mutation
        node {
          id
          client {
            firstName
          }
        }
      }
    }
`;

export const OrderCard = (props) => {


    const ORDER_QUERY = gql`
        query Order {
          order(id: "${props.id}") {
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


    const {loading, data: orderItemData, refetch} = useQuery(ORDER_QUERY);
    const [orderUpdate] = useMutation(ORDER_MUTATION);

    // const debouncedRefetch = React.useMemo(
    //     () =>
    //         debounce(() => {
    //             console.log("refetch");
    //             refetch();
    //         }, 5000),
    //     [refetch],
    // );
    //
    // const onSubscriptionData = React.useCallback(() => {
    //     debouncedRefetch();
    // }, [debouncedRefetch]);

    const subscription = useSubscription(ORDER_SUBSCRIPTION);

    console.log(subscription);


    const renderCell = (column, order) => {

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

    const generateRandomComment = async () => {
        orderUpdate({
            variables: {
                data: {
                    comment: `${Math.random()}`
                },
                filter: {
                    id: orderItemData.order.id
                }

            }
        })
    };


    const {tableState, onChange} = props;


    if (!!orderItemData && orderItemData.order === null) {
        return <Redirect to="/orders"/>
    }


    const tableData = R.pathOr([], ['order', 'orderItems', 'items'], orderItemData);
    const total = R.pathOr(null, ['order', 'orderItems', 'count'], orderItemData);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

    return (
        <Card.Body>
            <Card.Section>
                <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                    weight="bold">Id:</Text> {R.pathOr('No Id', ['order', 'id'], orderItemData)}</Paragraph>
            </Card.Section>
            <Card.Section>
                <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">First
                    Name: </Text> {R.pathOr('No First Name', ['order', 'client', 'firstName'], orderItemData)}
                </Paragraph>
            </Card.Section>
            <Card.Section>
                <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                    weight="bold">Address: </Text> {R.pathOr('No Address', ['order', 'address'], orderItemData)}
                </Paragraph>
            </Card.Section>
            <Card.Section>
                <Paragraph color="PRIMARY_TEXT_COLOR"><Text weight="bold">Delivery
                    Dt: </Text> {R.pathOr('No Delivery Dt', ['order', 'deliveryDt'], orderItemData)}</Paragraph>
            </Card.Section>
            <Card.Section>
                <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                    weight="bold">Comment: </Text> {R.pathOr('No Comment', ['order', 'comment'], orderItemData)}
                </Paragraph>
            </Card.Section>
            <Card.Section>
                <Paragraph color="PRIMARY_TEXT_COLOR"><Text
                    weight="bold">Status: </Text> {R.pathOr('No Status', ['order', 'status'], orderItemData)}
                </Paragraph>
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
                    renderCell={renderCell}
                    withPagination
                />
            </Card.Section>
            <Card.Section>
                <p>Your comment: {!loading ? orderItemData.order.comment : "Loading..."}</p>
                <Button onClick={generateRandomComment}>Set Random comment</Button>
            </Card.Section>
        </Card.Body>
    )
};