import React from 'react';
import {Card} from '@8base/boost';


import {ClientCard} from "./ClientCard";

const Client = props => {
    const clientId = props.computedMatch.params.id;

    return (
        <Card padding="md" stretch>

            <Card.Body padding="none" stretch>
                <ClientCard id={clientId}/>
            </Card.Body>
        </Card>
    )
};

export {Client};
