import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../../globalState/rootReducer'
const { ipcRenderer } = window.require('electron');

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
        const query = `query {
            Viewer {
              name
            }
        }`

        console.log(JSON.stringify({
            query: query
        }));

        console.log(`Querying ${this.props.url}`);
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log(arg);
        });
        ipcRenderer.send('asynchronous-message', { 
            url: this.props.url as string, 
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${this.props.pin}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: query
            })
        });
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
