import React, { Component } from 'react'
import { AppState } from '../../globalState/rootReducer';
import { connect } from 'react-redux';
import { loader } from "graphql.macro";
import { GQLPage, GQLMediaListStatus } from '../../graphql/graphqlTypes';
import { Table, ProgressBar } from 'react-bootstrap';
import './AnimeCollectionComponent.css';
import { humanMediaFormat } from "../../util/GeneralUtil";
import PaginationComponent from '../general/PaginationComponent';
import { getAnimeListPageUtil } from '../../util/AniListQueryUtil';

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
        currPage: 1
    }
    getAnimeListPageQuery = loader("../../graphql/queries/GetAnimeListPage.gql");

    constructor(props: AnimeCollectionComponentProps) {
        super(props);

        this.getAnimeListPage();
        this.onPageSelect = this.onPageSelect.bind(this);
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
                <PaginationComponent lastPage={this.state.pageData?.pageInfo?.lastPage || 0} 
                    onSelect={this.onPageSelect} 
                    displayedPageNums={5} />
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
            getAnimeListPageUtil(this.props.status,
                this.props.pageSize,
                this.state.currPage).then(response => {
                    this.setState({
                        pageData: response
                    });
                }).catch(err => {
                    console.error(err)
                });
        }
    }

    onPageSelect(page: number) {
        this.setState({
            currPage: page
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