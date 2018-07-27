import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { Section, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { Table, SortDirection } from '@red-hat-insights/insights-frontend-components/components/Table';
import { Button } from '@patternfly/react-core';

class Entity extends Component {

    constructor (props) {
        super(props);
        this.state = {
            cols: ['Animal', '# Legs', '# Eyes', 'Name'],
            rows: [
                { cells: ['Dog', 4, 2, 'Bert'] },
                { cells: ['Cat', 3, 2, 'Tripple leg'] },
                { cells: ['Octopus', 8, 'None', 'Octodad'] },
                { cells: ['Camel', 4, 2, 'Camie'] },
                { cells: ['Dog', 4, 1, 'Oneye'] },
                { cells: ['Cat', 4, 2, 'Wierdo'] },
                { cells: ['Elephant', 4, 2, 'Smalie'] },
                { cells: ['Porcupine', 4, 2, 'Pointy'] },
                { cells: ['Horse', 4, 2, 'MoonMoon'] },
                { cells: ['Mouse', 4, 2, 'Jerry'] },
                { cells: ['Spider', 7, 8, 'Tom'] }
            ],
            sortBy: {},
            itemsPerPage: 10,
            page: 1
        };
        this.onSortChange = this.onSortChange.bind(this);
        this.toggleCol = this.toggleCol.bind(this);
        this.limitRows = this.limitRows.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);
    }

    toggleCol(_event, key, selected) {
        let { rows, page, itemsPerPage } = this.state;
        const firstIndex = page === 1 ? 0 : page * itemsPerPage - itemsPerPage;
        rows[firstIndex + key].selected = selected;
        this.setState({
            ...this.state,
            rows
        });
    }

    onSortChange(_event, key, direction) {
        const sortedRows = sortBy(this.state.rows, [e => e.cells[key]]);
        this.setState({
            ...this.state,
            rows: SortDirection.up === direction ? sortedRows : sortedRows.reverse(),
            sortBy: {
                index: key,
                direction
            }
        });
    }

    limitRows() {
        const { page, itemsPerPage } = this.state;
        const numberOfItems = this.state.rows.length;
        const lastPage = Math.ceil(numberOfItems / itemsPerPage);
        const lastIndex = page === lastPage ? numberOfItems : page * itemsPerPage;
        const firstIndex = page === 1 ? 0 : page * itemsPerPage - itemsPerPage;
        return this.state.rows.slice(firstIndex, lastIndex);
    }

    setPage(page) {
        this.setState({
            ...this.state,
            page
        });
    }

    setPerPage(amount) {
        this.setState({
            ...this.state,
            itemsPerPage: amount
        });
    }

    render() {
        const rows = this.limitRows();
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title={`Inventory ID: ${this.props.match.params.id}`}/>
                </PageHeader>
                <Section type='content'>
                    <Table
                        onItemSelect={this.toggleCol}
                        hasCheckbox={true}
                        header={this.state.cols}
                        sortBy={this.state.sortBy}
                        rows={rows}
                        onSort={this.onSortChange}
                        footer={
                            <Pagination
                                numberOfItems={this.state.rows.length}
                                onPerPageSelect={this.setPerPage}
                                page={this.state.page}
                                onSetPage={this.setPage}
                                itemsPerPage={this.state.itemsPerPage}
                            />
                        }
                    />
                </Section>
                <Section type="button-group">
                    <div className="ins-back-button">
                        <Link to='/inventory'>
                            <Button variant='primary'>Back</Button>
                        </Link></div>
                </Section>
            </React.Fragment>
        );
    }
}

Entity.contextTypes = {
    store: PropTypes.object
};

Entity.propTypes = {
    match: PropTypes.object.isRequired
};

export default withRouter(Entity);
