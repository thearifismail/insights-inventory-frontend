import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './inventory.scss';

import { PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import { SimpleTableFilter } from '@red-hat-insights/insights-frontend-components/components/SimpleTableFilter';
import { Dropdown, DropdownItem } from '@red-hat-insights/insights-frontend-components/components/Dropdown';
import { Card, Level, CardBody, Grid, GridItem, CardHeader, LevelItem } from '@patternfly/react-core';
import { BellIcon, CubesIcon, MemoryIcon, HddIcon, FolderIcon, ClockIcon, BugIcon } from '@patternfly/react-icons';

class Inventory extends Component {

    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
            cards: [
                { icon: BellIcon, content: 'one' },
                { icon: CubesIcon, content: 'two' },
                { icon: MemoryIcon, content: 'oone' },
                { icon: HddIcon, content: 'ttwo' },
                { icon: FolderIcon, content: 'ddd' },
                { icon: ClockIcon, content: 'mewtwo' },
                { icon: BugIcon, content: 'tre' }
            ],
            span: 2
        };
        this.onSpanToggle = this.onSpanToggle.bind(this);
        this.onSpanSelect = this.onSpanSelect.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
    }

    onSearch(value) {
        const filteredCards  = this.state.cards.filter(oneCard =>oneCard.content.indexOf(value) !== -1);
        this.setState({
            ...this.state,
            filteredCards
        });
    }

    onSpanToggle() {
        this.setState({
            ...this.state,
            collapsed: !this.state.collapsed
        });
    }

    onSpanSelect(event) {
        this.setState({
            ...this.state,
            collapsed: !this.state.collapsed,
            span: parseInt(event.target.getAttribute('value'), 10)
        });
    }

    onCardClick(event) {
        const value = event.currentTarget.getAttribute('value');
        this.props.history.push(`/inventory/entity/${value}`);
    }

    render() {
        const cards = this.state.filteredCards || this.state.cards;
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Inventory'/>
                </PageHeader>
                <Section type='content'>
                    <Level gutter="sm">
                        <LevelItem>
                            <Dropdown
                                title={`Grid span - ${this.state.span}`}
                                isCollapsed={this.state.collapsed}
                                onToggle={this.onSpanToggle}
                                onSelect={this.onSpanSelect}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((oneSpan, key) => (
                                    <DropdownItem key={key} value={oneSpan}>{oneSpan}</DropdownItem>
                                ))}
                            </Dropdown>
                        </LevelItem>
                        <LevelItem>
                            <SimpleTableFilter onFilterChange={this.onSearch} buttonTitle=""/>
                        </LevelItem>
                    </Level>
                    <Grid gutter="sm">
                        {cards.map((oneCard, key) => (
                            <GridItem span={this.state.span} key={key}>
                                <Card onClick={this.onCardClick} value={key}>
                                    <CardHeader><oneCard.icon /></CardHeader>
                                    <CardBody>{oneCard.content}</CardBody>
                                </Card>
                            </GridItem>
                        ))}
                    </Grid>

                </Section>
            </React.Fragment>
        );
    }
}

Inventory.contextTypes = {
    store: PropTypes.object,
    history: PropTypes.object
};

export default withRouter(Inventory);
