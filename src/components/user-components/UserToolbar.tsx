import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../../globalState/rootReducer'
import { queryAniList } from '../../util/AniListApiUtil';

class UserToolbar extends Component<UserToolbarProps,{}> {
    constructor(props: UserToolbarProps) {
        super(props);
        this.getUserData();
        this.getUserData = this.getUserData.bind(this);
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }

    getUserData() {
        const query = `
        query {
            Viewer {
              name
            }
        }`

        console.log(JSON.stringify({
            query: query
        }));

        console.log(`Querying ${this.props.url}`);
        queryAniList(this.props.url as string, this.props.pin as string, query)
            .then(response => {
                console.log(response);
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
    clientId: state.clientId
});
const mapDispatchToProps = {

};
type UserToolbarProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserToolbar)
