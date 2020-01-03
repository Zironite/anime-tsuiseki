import React, { Component } from 'react'
import { AppState } from '../../globalState/rootReducer';
import { connect } from 'react-redux';
import { loader } from "graphql.macro";
import { queryAniList } from '../../util/AniListApiUtil';
import { GQLPage, GQLMediaListStatus } from '../../graphql/graphqlTypes';
import { Table, Pagination, ProgressBar } from 'react-bootstrap';
import './AnimeCollectionComponent.css';
import { humanMediaFormat } from "../../util/GeneralUtil";

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

        if (this.props.pin && this.props.currentUser?.id) {
            this.getAnimeListPage();
        }
    }

    render() {
        return (
            <div>
                <div className="min-height-75vh">
                    <Table striped bordered hover variant="dark" responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Format</th>
                                <th>Progress</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.pageData?.mediaList?.map(row => {
                                    return (
                                        <tr key={row?.media?.id}>
                                            <td>{row?.media?.title?.userPreferred}</td>
                                            <td>{humanMediaFormat(row?.media?.format)}</td>
                                            <td>
                                                <ProgressBar now={(row?.progress && row.media?.episodes) ? 
                                                    row.progress / row.media.episodes * 100 :
                                                    0} label={`${row?.progress || 0} / ${row?.media?.episodes || 0}`}
                                                    className="progress-bar-custom"/>
                                            </td>
                                            <td>{row?.score}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                <Pagination className="justify-content-center">
                    <Pagination.First />
                    <Pagination.Prev />

                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </div>
        )
    }

    humanReadableFormat() {

    }

    componentDidUpdate() {
        if (this.props.pin && this.props.currentUser?.id) {
            this.getAnimeListPage();
        }
    }

    getAnimeListPage() {
        const query = this.getAnimeListPageQuery.loc?.source.body;

        type TGQLGetAnimeListPageReturyType = {
            data: {
                Page: GQLPage
            }
        };
        queryAniList<TGQLGetAnimeListPageReturyType>(this.props.url as string,
            this.props.pin as string,
            query as string,
            {
                page: this.state.currPage,
                perPage: this.props.pageSize,
                userId: this.props.currentUser?.id,
                status: this.props.status
            }).then(response => {
                this.setState({
                    pageData: response.body?.data.Page
                });
            }).catch(err => {
                console.error(err)
            });
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