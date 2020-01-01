import logo from './logo.svg';
import './App.css';
import React, { Component, Dispatch } from 'react'
import { ReactReduxContext, connect } from 'react-redux';
import { AppState, AppStateActionTypes, TReducerActions } from './globalState/rootReducer';
import { ISetPin, IInitConfigDb, ILoadConfigFromDb } from './globalState/actions';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ConfigEntry } from './dm/ConfigEntry';
import UserToolbar from './components/user-components/UserToolbar';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProfileView from './components/user-components/ProfileView';

interface AppComponentState {
  enterPin: boolean
}

class App extends Component<AppProps,AppComponentState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      enterPin: false
    };
    this.props.initConfigDb();
    console.log(this.props);
    this.enablePinTextBox = this.enablePinTextBox.bind(this);
    this.disablePinTextBox = this.disablePinTextBox.bind(this);
    this.finishAuthentication = this.finishAuthentication.bind(this);
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          { this.props.pin ?
            <UserToolbar /> :
            <div className="m-2">
              <a className="btn btn-primary" 
                href={`https://anilist.co/api/v2/oauth/authorize?client_id=${this.props.clientId}&response_type=token`}
                target="_blank"
                onClick={this.enablePinTextBox}>
                Login
              </a>
            </div>
          }
          <ReactModal isOpen={this.state.enterPin}
            onRequestClose={this.disablePinTextBox}>
            <div className="mt-2">
              <textarea className="form-control" onPaste={this.finishAuthentication}/>
            </div>
          </ReactModal>
          <Switch>
            <Route path="/profile/:profileId">
              <ProfileView />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>)
  }

  enablePinTextBox() {
    this.setState({
      enterPin: true
    });
  }

  disablePinTextBox() {
    this.setState({
      enterPin: false
    });
  }

  finishAuthentication(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData("text");
    this.props.setPin(text);
    this.disablePinTextBox();
  }

  componentDidUpdate(prevProps: AppProps) {
    if (this.props.configDb && !prevProps.configDb) {
      this.props.loadConfigFromDb(() => {
        return this.props.configDb;
      });
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  configDb: state.configDb,
  pin: state.pin,
  clientId: state.clientId
})
const initConfigDb = () => {
  return {
    type: AppStateActionTypes.INIT_CONFIG_DB
  } as IInitConfigDb 
}

const setPin = (newPin: string) => {
  return {
    type: AppStateActionTypes.SET_PIN,
    newPin: newPin
  } as ISetPin
}

const loadConfigFromDb = (configDb: () => PouchDB.Database<ConfigEntry> | undefined): ThunkAction<any,AppState,null,ILoadConfigFromDb> => 
async (dispatch) => {
  console.log("Starting config db load");
  if (!configDb()) {
    console.error("Config db is undefind");
  }
  configDb()?.allDocs({include_docs: true})
    .then(response => {
      console.log("Finished querying config db");
      dispatch({
        type: AppStateActionTypes.LOAD_CONFIG_FROM_DB,
        data: response.rows.map(row => row.doc as ConfigEntry)
      });
    }).catch(err => console.error(err));
}

const mapDispatchToProps = {
  initConfigDb,
  setPin,
  loadConfigFromDb
}

type AppProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App)
