import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query currentUser {
    user {
      id
    }
  }
`;


export const USER_SIGN_UP_MUTATION = gql`
  mutation userSignUp($user: UserCreateInput!) {
    userSignUp(user: $user) {
      id
      email
    }
  }
`;

export const USERS_LIST_QUERY = gql`
  query UsersList {
    usersList {
      items {
        id
        firstName
        lastName
      }
    }
  }
`;

export const PROPERTIES_LIST_QUERY = gql`
  query PropertiesList {
    propertiesList {
      items {
        id
        createdAt
        updatedAt
        pictures {
          items {
            id
            downloadUrl
            shareUrl
          }
        }
        bedrooms
        title
        description
        sqFootage
        bathrooms
        garage
        pool
      }
    }
  }
`;

export const CLIENTS_LIST_QUERY = gql`
  query Clients {
  clientsList {
    items {
      id
      firstName
      lastName
      email
      phone
      birthday
      orders {
        items {
          id
          address
        }
      }
    }
  }
}
`;

export const CLIENT_CREATE_MUTATION = gql`  
  mutation ClientCreate($data: ClientCreateInput!) {
  clientCreate(data: $data) {
    firstName,
    lastName,
    email,
    phone,
    birthday 
  }
}
`;

export const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`;

export const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
    }
  }
`;

export const ORDERS_LIST_QUERY = gql`
    query Orders {
      ordersList {
        items {
          id,
          client {
            firstName
          },
          address,
          deliveryDt,
          comment,
          status,
          orderItems {
            items {
              product {
                name,
                price
              }
              quantity
            }
          }
        }
      }
    }
`;

export const ORDER_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
    }
  }
`;

export const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;

export const ORDER_ITEMS_LIST_QUERY = gql`
  query OrderItems {
    orderItemsList {
      items {
        id
        product {
          name
          price
        }
        order {
          id
          address
        }
        quantity
      }
    }
  }
`;

export const ORDER_ITEM_CREATE_MUTATION = gql`
  mutation OrderItemCreate($data: OrderItemCreateInput!) {
    orderItemCreate(data: $data) {
      id
    }
  }
`;

export const ORDER_ITEMS_DELETE_MUTATION = gql`
  mutation OrderItemDelete($id: ID!) {
    orderItemDelete(data: { id: $id }) {
      success
    }
  }
`;

export const PRODUCTS_LIST_QUERY = gql`
    query Products {
      productsList {
        items {
          id
          picture {
            downloadUrl
          },
          name,
          description,
          price
        }
      }
    }
`;

export const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate($data: ProductCreateInput!) {
    productCreate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_DELETE_MUTATION = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(data: { id: $id }) {
      success
    }
  }
`;