import logo from './logo.svg';
import './App.css';
import React, { Component, Dispatch } from 'react'
import { ReactReduxContext, connect } from 'react-redux';
import { AppState, AppStateActionTypes, TReducerActions } from './globalState/rootReducer';
import { ISetPin, IInitConfigDb, ILoadConfigFromDb } from './globalState/actions';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ConfigEntry } from './dm/ConfigEntry';

interface AppComponentState {
  enterPin: boolean
}

class App extends Component<AppProps,AppComponentState> {
  constructor(props: AppProps) {
    super(props);
    this.setState({
      enterPin: false
    });
    this.props.initConfigDb();
    console.log(this.props);
    this.enablePinTextBox = this.enablePinTextBox.bind(this);
    this.finishAuthentication = this.finishAuthentication.bind(this);
  }

  render() {
    return (
      <div className="m-2">
        <div>
          <a className="btn btn-primary" 
            href="https://anilist.co/api/v2/oauth/authorize?client_id=2979&response_type=token" 
            target="_blank"
            onClick={this.enablePinTextBox}>
            Login
          </a>
        </div>
        <div className="mt-2">
          { this.state && this.state.enterPin ? 
              <textarea className="form-control"
                onPaste={this.finishAuthentication}/> : 
              null }
        </div>
      </div>)
  }

  enablePinTextBox() {
    this.setState({
      enterPin: true
    });
  }

  finishAuthentication(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData("text");
    this.props.setPin(text);
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
  pin: state.pin
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
