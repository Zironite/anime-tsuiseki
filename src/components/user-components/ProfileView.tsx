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

        this.getWatchingAnimeList();
    }
    render() {
        return (
            <CardDeck className="m-1">
                {this.props.watchingAnimeList?.map(anime => {
                    return (
                        <div>
                            <AnimeTile key={anime.media?.id} animeName={anime.media?.title?.userPreferred || ""}
                                bannerUrl={anime.media?.bannerImage || ""} />
                        </div>
                    )
                })}
            </CardDeck>
        )
    }

    getWatchingAnimeList() {
        getAnimeList(GQLMediaListStatus.CURRENT, 10, 1).then(mediaList => {
            this.props.setWatchingAnimeList(mediaList);
        }).catch(err => console.error(err));
    }
}

const mapStateToProps = (state: AppState) => ({
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
