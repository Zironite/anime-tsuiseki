import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

interface Props {
    profileId: string
}
interface State {
    
}

class ProfileView extends Component<RouteComponentProps<Props>, State> {
    state = {}

    render() {
        return (
            <div>
                {this.props.match.params.profileId}
            </div>
        )
    }
}

export default withRouter(ProfileView);
