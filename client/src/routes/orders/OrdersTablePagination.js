import React, {useEffect, useState} from 'react';
import * as R from 'ramda';
import {Query, useQuery} from 'react-apollo';
import {Button, Icon, TableBuilder} from '@8base/boost';

import * as sharedGraphQL from 'shared/graphql';
import {Link} from "react-router-dom";

const TABLE_COLUMNS = [
    {name: 'id', title: 'Id'},
    {name: 'client', title: 'Client'},
    {name: 'address', title: 'Address'},
    {name: 'deliveryDt', title: 'Delivery Dt'},
    {name: 'comment', title: 'Comment'},
    {name: 'status', title: 'Status'},
    {name: 'viewButton', title: 'Info'}
];


const TableState = (props) => {
    const [state, setState] = useState({
        tableState: {
            pagination: {
                page: 1,
                pageSize: 10,
                total: null,
            },
        },
        loading: props.async || false,
        data: [],
    });

    const [tableData, setTableData] = useState([]);

    const fetchData = useQuery(sharedGraphQL.ORDERS_LIST_QUERY);

    useEffect(() => {
        if (!!fetchData.data) {

            setTableData(fetchData.data.ordersList.items);

            const data = sliceData(tableData, state.tableState.pagination.page, state.tableState.pagination.pageSize);

            setState(({tableState}) => ({
                loading: false,
                data,
                tableState: {
                    ...tableState,
                    pagination: {
                        ...tableState.pagination,
                        total: tableData.length,
                    },
                },
            }));
        }

    }, [fetchData, tableData]);


    useEffect(() => {

        const data = sliceData(tableData, state.tableState.pagination.page, state.tableState.pagination.pageSize);

        setState(({tableState}) => ({
            loading: false,
            data,
            tableState: {
                ...tableState,
                pagination: {
                    ...tableState.pagination,
                    total: tableData.length,
                },
            },
        }));


    }, [state.tableState.pagination.page]);

    const sliceData = (data, page, pageSize) => {
        return data.slice((page - 1) * pageSize, page * pageSize);
    };


    const {children} = props;
    const {tableState, loading, data} = state;

    const setTableState = tableState => {
        setState({tableState});
    };

    return children({tableState, setTableState: setTableState, loading, data});
};


const OrdersTablePagination = () => {


    const renderCell = (column, order) => {

        let rendered = String(order[column.name]);

        switch (column.name) {
            case 'client': {
                rendered = R.pathOr('No First Name', ['client', 'firstName'], order);
                break;
            }

            case 'viewButton': {
                rendered = <Button squared size={"sm"}><Link style={{color: "inherit", textDecoration: "none"}} to={"/order/" + order.id}><Icon size={"sm"} name={"Search"}/></Link></Button>;
                break
            }


            default: {
                break;
            }
        }

        return rendered;
    };


    const renderContent = () => {
        return (
            <TableState async>
                {({tableState, setTableState, loading, data}) => (
                    <TableBuilder
                        columns={TABLE_COLUMNS}
                        data={data}
                        onChange={setTableState}
                        tableState={tableState}
                        loading={loading}
                        renderCell={renderCell}
                        withPagination
                    />
                )}
            </TableState>
        )
    };

    return <Query query={sharedGraphQL.ORDERS_LIST_QUERY}>{renderContent}</Query>;

};

export {OrdersTablePagination};
