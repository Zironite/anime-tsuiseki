import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState, AppStateActionTypes } from '../../globalState/rootReducer'
import { loader } from "graphql.macro";
import { GQLUser } from '../../graphql/graphqlTypes';
import { ISetUser } from '../../globalState/actions';
import "./UserToolbar.css";
import { Navbar, Nav } from "react-bootstrap";
import { FaSignOutAlt, FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Ticker from "react-ticker";
import { getUserDataUtil } from '../../util/AniListQueryUtil';

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
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand as={Link} to={`/profile/${this.props.currentUser?.id}`}>
                    <img src={this.props.currentUser?.avatar?.medium} 
                        alt="Avatar"
                        className="rounded-circle avatar-img mr-3" />
                    <span>{this.props.currentUser?.name}</span>
                </Navbar.Brand>
                <Nav className="mr-3">
                    <Nav.Link as={Link} to={`/anime/list/${this.props.currentUser?.id}`}>
                        Anime List
                    </Nav.Link>
                </Nav>
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/settings">
                        Settings
                    </Nav.Link>
                </Nav>
                <>
                    <FaPlay className={this.props.currentAnime ? "active-play-button" : "inactive-play-button"} />
                    <Ticker mode="await" height={20} speed={10}>
                        {() => (
                            <>
                                <h6 className="text-light">{this.props.currentAnime?.name || "Not watching anything right now"}</h6>
                            </>
                        )}
                    </Ticker>
                </>
                <Nav className="ml-4">
                    <Nav.Link>
                        <FaSignOutAlt /> Log out
                    </Nav.Link>
                </Nav>
            </Navbar>
        )
    }

    getUserData() {
        getUserDataUtil();
    }

    handleDropdownOnSelect(eventKey: any) {
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
    currentUser: state.currentUser,
    currentAnime: state.currentOpenAnime
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
