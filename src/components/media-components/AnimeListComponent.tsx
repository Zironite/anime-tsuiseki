import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap'
import AnimeCollectionComponent from './AnimeCollectionComponent'
import { GQLMediaListStatus } from '../../graphql/graphqlTypes'

interface Props {
    profileId: string
}
interface State {
    
}

class AnimeListComponent extends Component<RouteComponentProps<Props>, State> {
    state = {}

    render() {
        return (
            <Tabs defaultActiveKey="watching" id="anime-list-component-tabs">
                <Tab eventKey="watching" title="Watching">
                    <AnimeCollectionComponent pageSize={10} status={GQLMediaListStatus.CURRENT} />
                </Tab>
                <Tab eventKey="completed" title="Completed">
                    <AnimeCollectionComponent pageSize={10} status={GQLMediaListStatus.COMPLETED} />
                </Tab>
                <Tab eventKey="planning" title="Planning">
                    <AnimeCollectionComponent pageSize={10} status={GQLMediaListStatus.PLANNING} />
                </Tab>
                <Tab eventKey="paused" title="Paused">
                    <AnimeCollectionComponent pageSize={10} status={GQLMediaListStatus.PAUSED} />
                </Tab>
                <Tab eventKey="dropped" title="Dropped">
                    <AnimeCollectionComponent pageSize={10} status={GQLMediaListStatus.DROPPED} />
                </Tab>
                <Tab eventKey="rewatching" title="Rewatching">
                    <AnimeCollectionComponent pageSize={10} status={GQLMediaListStatus.REPEATING} />
                </Tab>
            </Tabs>
        )
    }
}

export default withRouter(AnimeListComponent)
