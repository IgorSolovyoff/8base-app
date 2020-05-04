import React from 'react';
import {Card, Text} from '@8base/boost';


import {OrderCard} from "./orderCard";

const Order = props => {
    const orderId = props.computedMatch.params.id;

    return (
        <Card padding="md" stretch>
            <Card.Header><Text weight="bold">Order Details</Text></Card.Header>
            <OrderCard id={orderId}/>
        </Card>
    );
};

export {Order};