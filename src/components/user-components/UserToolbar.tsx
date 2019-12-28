import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState, AppStateActionTypes } from '../../globalState/rootReducer'
import { queryAniList } from '../../util/AniListApiUtil';
import { loader } from "graphql.macro";
import { GQLUser } from '../../graphql/graphqlTypes';
import { ISetUser } from '../../globalState/actions';
import "./UserToolbar.css";

class UserToolbar extends Component<UserToolbarProps,{}> {
    getCurrentUserDataQuery = loader("../../graphql/queries/GetCurrentUserData.gql");
    constructor(props: UserToolbarProps) {
        super(props);
        this.getUserData();
        this.getUserData = this.getUserData.bind(this);
    }

    render() {
        return (
            <div>
                <img src={this.props.currentUser?.avatar?.medium} className="rounded-circle avatar-img" />
                <span>{this.props.currentUser?.name}</span>
            </div>
        )
    }

    getUserData() {
        const query = this.getCurrentUserDataQuery.loc?.source.body!;

        console.log(JSON.stringify({
            query: query
        }));

        console.log(`Querying ${this.props.url}`);
        type TGQLGetUserDataReturnType = {
            data: {
                Viewer: GQLUser
            }
        }
        queryAniList<TGQLGetUserDataReturnType>(this.props.url as string, this.props.pin as string, query)
            .then(response => {
                this.props.setUser(response.body?.data.Viewer!);
            })
            .catch(err => console.error(err));
    }

    componentDidUpdate(prevProps: UserToolbarProps) {
        if (this.props.pin !== prevProps.pin) {
            this.getUserData();
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    pin: state.pin,
    url: state.anilistApi,
    clientId: state.clientId,
    currentUser: state.currentUser
});

const setUser = (user: GQLUser) => {
    return {
        type: AppStateActionTypes.SET_USER,
        user: user
    }
}
const mapDispatchToProps = {
    setUser
};
type UserToolbarProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserToolbar)
