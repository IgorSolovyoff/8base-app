import React from 'react';
import {compose} from 'recompose';
import {Query, withApollo} from 'react-apollo';
import gql from "graphql-tag";

class OrderTotal extends React.Component {
    ORDER_QUERY = gql`
    query Order {
      order(id: "${this.props.id}") {
        orderItems {
          items {
            product {
              price
            }
            quantity
          }
        }
      }
    }
   `;

    renderContent = ({data}) => {
        if (data) {
            let total = 0;

            data.order.orderItems.items.map(order => {
               return  total = total + (+order.product.price * +order.quantity)
            });
            return <div>{Math.floor(total*100)/100}</div>
        } else return <div>...</div>

    };

    render() {
        return <Query query={this.ORDER_QUERY}>{this.renderContent}</Query>
    }
}


OrderTotal = compose(
    withApollo,
)(OrderTotal);


export {OrderTotal};