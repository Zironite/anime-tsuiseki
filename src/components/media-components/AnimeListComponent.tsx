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
            </Tabs>
        )
    }
}

export default withRouter(AnimeListComponent)
