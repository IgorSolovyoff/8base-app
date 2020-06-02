import React from 'react';
import {useMutation, useSubscription, useQuery} from "react-apollo";
import {gql} from "@8base/react-sdk";
import {Button} from "@8base/boost";


const ORDER_QUERY = gql`
    query Order {
      order(id:"ckawq3mme004607jw59el1mzd") {
        comment
      }
    }
`;

const ORDER_MUTATION = gql`
mutation OrderCommentUpdate($data: OrderUpdateInput!, $filter: OrderKeyFilter!) {
  orderUpdate(filter: $filter, data: $data)  {
    comment
  }
}
`;

const ORDERS_UPDATE_SUBSCRIPTION = gql`
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


export const OrderChanged = () => {

    const { loading, data: orderData } = useQuery(ORDER_QUERY);

    const [orderUpdate] = useMutation(ORDER_MUTATION);

    const generateRandomComment = () => {
        orderUpdate({
            variables: {
                data: {
                    comment: `${Math.random()}`
                },
                filter: {
                    id: "ckawq3mme004607jw59el1mzd"
                }

            }
        })
    };

    const subscription = useSubscription(ORDERS_UPDATE_SUBSCRIPTION);
    console.log(subscription);


    return (
        <div>
            <p>
                <Button onClick={generateRandomComment}>Set Random comment</Button>
            </p>
            <p>
                Generated comment: {!loading ? <span>{orderData.order.comment}</span> : <span>Loading....</span>}
            </p>
        </div>
    );
};

