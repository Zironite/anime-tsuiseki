import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap'
import AnimeCollectionComponent from './AnimeCollectionComponent'
import { GQLMediaListStatus } from '../../graphql/graphqlTypes'

interface Props {
    userId: string,
    pageSize: string
}
interface State {
    
}

class AnimeListComponent extends Component<RouteComponentProps<Props>, State> {
    state = {}

    render() {
        return (
            <Tabs defaultActiveKey="watching" id="anime-list-component-tabs">
                <Tab eventKey="watching" title="Watching">
                    <AnimeCollectionComponent userId={this.props.match.params.userId} 
                        pageSize={parseInt(this.props.match.params.pageSize)} 
                        status={GQLMediaListStatus.CURRENT} />
                </Tab>
                <Tab eventKey="completed" title="Completed">
                    <AnimeCollectionComponent userId={this.props.match.params.userId} 
                        pageSize={parseInt(this.props.match.params.pageSize)} 
                        status={GQLMediaListStatus.COMPLETED} />
                </Tab>
                <Tab eventKey="planning" title="Planning">
                    <AnimeCollectionComponent userId={this.props.match.params.userId}
                        pageSize={parseInt(this.props.match.params.pageSize)} 
                        status={GQLMediaListStatus.PLANNING} />
                </Tab>
                <Tab eventKey="paused" title="Paused">
                    <AnimeCollectionComponent userId={this.props.match.params.userId}
                        pageSize={parseInt(this.props.match.params.pageSize)} 
                        status={GQLMediaListStatus.PAUSED} />
                </Tab>
                <Tab eventKey="dropped" title="Dropped">
                    <AnimeCollectionComponent userId={this.props.match.params.userId} 
                        pageSize={parseInt(this.props.match.params.pageSize)} 
                        status={GQLMediaListStatus.DROPPED} />
                </Tab>
                <Tab eventKey="rewatching" title="Rewatching">
                    <AnimeCollectionComponent userId={this.props.match.params.userId}
                        pageSize={parseInt(this.props.match.params.pageSize)} 
                        status={GQLMediaListStatus.REPEATING} />
                </Tab>
            </Tabs>
        )
    }
}

export default withRouter(AnimeListComponent)
