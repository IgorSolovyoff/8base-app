import React from 'react';
import { withAuth } from '@8base/react-sdk';

import { client } from '../../../../shared/api';
import * as gql from '../../../../shared/graphql';

class CallbackContainer extends React.Component {
  async handleAuthentication({ idToken, email }) {

    client.setIdToken(idToken);

    try {
      await client.request(gql.CURRENT_USER_QUERY);
    } catch {

      await client.request(gql.USER_SIGN_UP_MUTATION, {
        user: { email: email },
        authProfileId: process.env.REACT_APP_AUTH_PROFILE_ID,
      });
    }
  }

  async componentDidMount() {
    const { auth, history } = this.props;
    const authResult = await auth.authClient.getAuthorizedData();
    await this.handleAuthentication(authResult);
    auth.authClient.setState({ token: authResult.idToken });
    history.replace('/');
  }

  render() {
    return <h2>Loading...</h2>;
  }
}
CallbackContainer = withAuth(CallbackContainer);

export { CallbackContainer };