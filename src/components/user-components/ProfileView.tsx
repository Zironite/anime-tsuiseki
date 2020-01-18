import React, { Component } from 'react'
import { getAnimeList } from '../../util/AniListQueryUtil'
import { GQLMediaListStatus, GQLMediaList } from '../../graphql/graphqlTypes'
import { connect } from 'react-redux'
import { AppState, AppStateActionTypes } from '../../globalState/rootReducer'
import { ISetWatchingAnimeList } from '../../globalState/actions'
import AnimeTile from '../media-components/AnimeTile'
import { CardDeck } from 'react-bootstrap'

interface State {

}
class ProfileView extends Component<ProfileViewProps, State> {
    state = {}

    constructor(props: ProfileViewProps) {
        super(props);

        this.getWatchingAnimeList = this.getWatchingAnimeList.bind(this);
        this.getWatchingAnimeList();
    }
    render() {
        return (
            <>
                <h1 className="text-white m-1">Watching</h1>
                <CardDeck className="m-1">
                    {this.props.watchingAnimeList?.map(anime => {
                        return (
                            <div key={anime.media?.id}>
                                <AnimeTile animeName={anime.media?.title?.userPreferred || ""}
                                    bannerUrl={anime.media?.bannerImage || ""}
                                    nextEpisode={(anime.progress || 0) + 1} />
                            </div>
                        )
                    })}
                </CardDeck>
                <h1 className="text-white m-1">Statistics</h1>
                <h2 className="text-white m-1">Count: {this.props.currentUser?.statistics?.anime?.count}</h2>
            </>
        )
    }

    getWatchingAnimeList() {
        getAnimeList(GQLMediaListStatus.CURRENT, 10, 1).then(mediaList => {
            this.props.setWatchingAnimeList(mediaList);
        }).catch(err => console.error(err));
    }

    componentDidUpdate(prevProps: ProfileViewProps) {
        if ((this.props.url !== prevProps.url ||
            this.props.pin !== prevProps.pin ||
            this.props.currentUser !== prevProps.currentUser) &&
            this.props.url && this.props.pin && this.props.currentUser) {
                this.getWatchingAnimeList();
            }
    }
}

const mapStateToProps = (state: AppState) => ({
    url: state.anilistApi,
    pin: state.pin,
    currentUser: state.currentUser,
    watchingAnimeList: state.watchingAnimeList
});

const setWatchingAnimeList = (data: GQLMediaList[]) => {
    return {
        type: AppStateActionTypes.SET_WATCHING_ANIME_LIST,
        data: data
    } as ISetWatchingAnimeList;
};

const mapDispatchToProps = {
    setWatchingAnimeList
};

type ProfileViewProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
