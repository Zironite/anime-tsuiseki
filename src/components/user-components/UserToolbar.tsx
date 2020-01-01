import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState, AppStateActionTypes } from '../../globalState/rootReducer'
import { queryAniList } from '../../util/AniListApiUtil';
import { loader } from "graphql.macro";
import { GQLUser } from '../../graphql/graphqlTypes';
import { ISetUser } from '../../globalState/actions';
import "./UserToolbar.css";
import { Dropdown } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

enum DropdownOptions {
    PROFILE = "1",
    LOGOUT = "2"
}

class UserToolbar extends Component<UserToolbarProps,{}> {
    getCurrentUserDataQuery = loader("../../graphql/queries/GetCurrentUserData.gql");
    constructor(props: UserToolbarProps) {
        super(props);
        this.getUserData();
        this.getUserData = this.getUserData.bind(this);
        this.handleDropdownOnSelect = this.handleDropdownOnSelect.bind(this);
    }

    render() {
        return (
            <div className="user-toolbar p-2">
                <Dropdown onSelect={this.handleDropdownOnSelect}>
                    <Dropdown.Toggle variant="info" id="user-dropdown">
                        <img src={this.props.currentUser?.avatar?.medium} className="rounded-circle avatar-img mr-3" />
                        <span>{this.props.currentUser?.name}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey={DropdownOptions.PROFILE}><FaUser /> Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey={DropdownOptions.LOGOUT}><FaSignOutAlt /> Log out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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

    handleDropdownOnSelect(eventKey: any, event: Object) {
        switch (eventKey) {
            case DropdownOptions.PROFILE:
                console.log("Activated profile");
                break;
            case DropdownOptions.LOGOUT:
                console.log("Activated logout");
                break;
            default:
                break;
        }
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
    } as ISetUser;
}
const mapDispatchToProps = {
    setUser
};
type UserToolbarProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserToolbar)
