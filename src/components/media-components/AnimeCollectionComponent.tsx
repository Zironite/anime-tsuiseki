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
    userId: string,
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
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    render() {
        let firstAndPrevPagination: JSX.Element | undefined;
        let lastAndNextPagination: JSX.Element | undefined;

        if (this.state.currPage !== 0) {
            firstAndPrevPagination = 
                <React.Fragment>
                    
                </React.Fragment>;
        }

        if (this.state.currPage !== this.state.pageData?.pageInfo?.lastPage) {
            lastAndNextPagination =
                <React.Fragment>
                    
                </React.Fragment>
        }

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
                    <Pagination.First onClick={() => this.handlePageClick(1)} disabled={this.state.currPage === 0} />
                    <Pagination.Prev onClick={() => this.handlePageClick(this.state.currPage - 1)} disabled={this.state.currPage === 0} />


                    <Pagination.Next key="next" onClick={() => this.handlePageClick(this.state.currPage + 1)}
                        disabled={this.state.currPage === this.state.pageData?.pageInfo?.lastPage} />
                    <Pagination.Last key="last" onClick={() => this.handlePageClick(this.state.pageData?.pageInfo?.lastPage)}
                        disabled={this.state.currPage === this.state.pageData?.pageInfo?.lastPage}/>
                </Pagination>
            </div>
        )
    }
    
    componentDidUpdate(prevProps: AnimeCollectionComponentProps, prevState: State) {
        if (prevState.currPage !== this.state.currPage ||
            prevProps.currentUser?.id !== this.props.currentUser?.id ||
            prevProps.pageSize !== this.props.pageSize ||
            prevProps.pin !== this.props.pin) {
            this.getAnimeListPage();
        }
    }

    getAnimeListPage() {
        if (this.props.pin && this.props.userId) {
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
                    userId: this.props.userId,
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

    handlePageClick(newPage?: number) {
        console.log(newPage);
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