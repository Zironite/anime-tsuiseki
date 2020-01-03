import React, { Component } from 'react'
import { AppState } from '../../globalState/rootReducer';
import { connect } from 'react-redux';
import { loader } from "graphql.macro";
import { queryAniList } from '../../util/AniListApiUtil';
import { GQLPage, GQLMediaListStatus } from '../../graphql/graphqlTypes';
import { Table } from 'react-bootstrap';

interface Props {
    pageSize: number,
    status: GQLMediaListStatus
}
interface State {
    currPage: number,
    pageData?: GQLPage
}

class AnimeCollectionComponent extends Component<AnimeCollectionComponentProps, State> {
    state: State = {
        currPage: 0
    }
    getAnimeListPageQuery = loader("../../graphql/queries/GetAnimeListPage.gql");

    constructor(props: AnimeCollectionComponentProps) {
        super(props);
        this.getAnimeListPage();
    }

    render() {
        return (
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                {
                    this.state.pageData?.mediaList?.map(row => {
                        return (
                            <tr>
                                <td>{row?.media?.title?.userPreferred}</td>
                            </tr>
                        );
                    })
                }
            </Table>
        )
    }

    getAnimeListPage() {
        const query = this.getAnimeListPageQuery.loc?.source.body;

        type TGQLGetAnimeListPageReturyType = {
            data: {
                Page: GQLPage
            }
        }
        queryAniList<TGQLGetAnimeListPageReturyType>(this.props.url as string,
            this.props.pin as string,
            query as string,
            {
                page: this.state.currPage,
                perPage: this.props.pageSize,
                userId: this.props.currentUser?.id,
                status: this.props.status
            }).then(response => {
                this.state.pageData = response.body?.data.Page;
            }).catch(err => console.error(err));
    }
}

const mapStateToProps = (state: AppState) => ({
    pin: state.pin,
    url: state.anilistApi,
    clientId: state.clientId,
    currentUser: state.currentUser
});

const mapDispatchToProps = {
};

type AnimeCollectionComponentProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & Props

export default connect(mapStateToProps, mapDispatchToProps)(AnimeCollectionComponent)