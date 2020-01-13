import './App.css';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { AppState, AppStateActionTypes } from './globalState/rootReducer';
import { ISetPin, IInitConfigDb, ILoadConfigFromDb, IInitMediaSearchIndex } from './globalState/actions';
import { ThunkAction } from 'redux-thunk';
import { ConfigEntry } from './dm/ConfigEntry';
import UserToolbar from './components/user-components/UserToolbar';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProfileView from './components/user-components/ProfileView';
import AnimeListComponent from './components/media-components/AnimeListComponent';
import { setProcessCommandsToMonitor, setAcceptedExtensions, setFileNameRegexes } from './util/MainProcessCommunicationUtil';
import { GQLMediaListStatus } from './graphql/graphqlTypes';
import { loader } from "graphql.macro";
import { MediaSearchIndexEntry } from './dm/MediaSearchIndexEntry';
import { MainSettingsComponent } from './components/settings-components/MainSettingsComponent';
import { getAnimeList } from './util/AniListQueryUtil';

interface AppComponentState {
  enterPin: boolean
}

class App extends Component<AppProps,AppComponentState> {
  getAnimeListPageQuery = loader("./graphql/queries/GetAnimeListPage.gql");
  constructor(props: AppProps) {
    super(props);
    this.state = {
      enterPin: false
    };
    this.props.initConfigDb();
    this.props.initMediaSearchIndex();
    console.log(this.props);
    this.enablePinTextBox = this.enablePinTextBox.bind(this);
    this.disablePinTextBox = this.disablePinTextBox.bind(this);
    this.finishAuthentication = this.finishAuthentication.bind(this);
    this.loadCurrentUserAnime = this.loadCurrentUserAnime.bind(this);
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
                rel="noopener noreferrer"
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
            <Route path="/anime/list/:userId">
              <AnimeListComponent pageSize={10}/>
            </Route>
            <Route path="/settings">
              <MainSettingsComponent />
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

  async loadCurrentUserAnime() {
    getAnimeList(GQLMediaListStatus.CURRENT,
      10,
      1).then(mediaList => {
        this.props.initMediaSearchIndex(mediaList.map(entry => {
          return {
            id: entry.media?.id,
            names: [entry.media?.title?.userPreferred || "",
              entry.media?.title?.english || "",
              entry.media?.title?.native || "",
              entry.media?.title?.romaji || ""].concat(...entry.media?.synonyms?.map(s => s || "") || [])
              .filter(name => name !== "")
          } as MediaSearchIndexEntry;
        }));
      }).catch(err => console.error(err));
  }

  componentDidUpdate(prevProps: AppProps) {
    if (this.props.configDb && !prevProps.configDb) {
      this.props.loadConfigFromDb(() => {
        return this.props.configDb;
      });
    } 
    if (this.props.commands !== prevProps.commands) {
      setProcessCommandsToMonitor(this.props.commands!);
    }
    if (this.props.extensions !== prevProps.extensions) {
      setAcceptedExtensions(this.props.extensions!);
    } 
    if (this.props.fileNameRegexes !== prevProps.fileNameRegexes) {
      setFileNameRegexes(this.props.fileNameRegexes!);
    }
    if (this.props.currentUser !== prevProps.currentUser) {
      this.loadCurrentUserAnime();
    }
    if (this.props.currentOpenAnime !== prevProps.currentOpenAnime) {
      const notificationTitle = this.props.currentOpenAnime?.name;
      if (notificationTitle) {
        new Notification(notificationTitle!, {
          body: `Now watching episode ${this.props.currentOpenAnime?.currentEpisode}`
        });
      }
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  configDb: state.configDb,
  pin: state.pin,
  clientId: state.clientId,
  commands: state.commands,
  extensions: state.extensions,
  fileNameRegexes: state.fileNameRegexes,
  currentUser: state.currentUser,
  url: state.anilistApi,
  currentOpenAnime: state.currentOpenAnime
})
const initConfigDb = () => {
  return {
    type: AppStateActionTypes.INIT_CONFIG_DB
  } as IInitConfigDb 
}
const initMediaSearchIndex = (entries?: MediaSearchIndexEntry[]) => {
  return {
    type: AppStateActionTypes.INIT_MEDIA_SEARCH_INDEX,
    entries: entries
  } as IInitMediaSearchIndex;
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
  initMediaSearchIndex,
  setPin,
  loadConfigFromDb
}

type AppProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App)
