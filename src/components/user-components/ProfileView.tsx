import React, { Component } from 'react'
import { getAnimeList } from '../../util/AniListQueryUtil'
import { GQLMediaListStatus, GQLMediaList } from '../../graphql/graphqlTypes'
import { connect } from 'react-redux'
import { AppState, AppStateActionTypes } from '../../globalState/rootReducer'
import { ISetWatchingAnimeList } from '../../globalState/actions'
import AnimeTile from '../media-components/AnimeTile'
import { CardDeck, Card } from 'react-bootstrap'

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
                <CardDeck className="m-1">
                    <Card className="bg-dark text-white">
                        <Card.Title>Anime Count</Card.Title>
                        <Card.Body>{this.props.currentUser?.statistics?.anime?.count}</Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Title>Mean Score</Card.Title>
                        <Card.Body>{this.props.currentUser?.statistics?.anime?.meanScore}</Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Title>Standard Deviation</Card.Title>
                        <Card.Body>{this.props.currentUser?.statistics?.anime?.standardDeviation}</Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Title>Minutes Watched</Card.Title>
                        <Card.Body>{this.props.currentUser?.statistics?.anime?.minutesWatched}</Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Title>Episodes Watched</Card.Title>
                        <Card.Body>{this.props.currentUser?.statistics?.anime?.episodesWatched}</Card.Body>
                    </Card>
                </CardDeck>
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
