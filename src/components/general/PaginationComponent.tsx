import React, { Component } from 'react'
import { Pagination } from 'react-bootstrap';

interface Props {
    onSelect: (page: number) => void,
    lastPage: number,
    displayedPageNums: number
}

interface State {
    currPage: number
}

export default class PaginationComponent extends Component<Props, State> {
    state: State = {
        currPage: 1
    };

    render() {
        return (
            <Pagination className="justify-content-center">
                    <Pagination.First onClick={() => this.changePage(1)} disabled={this.state.currPage === 1} />
                    <Pagination.Prev onClick={() => this.changePage(this.state.currPage - 1)} disabled={this.state.currPage === 1} />
                    { 
                        (this.state.currPage - Math.floor(this.props.displayedPageNums/2) > 1) ?
                        <Pagination.Ellipsis disabled={true}/> :
                        null
                    }
                    {
                        Array.from(Array(Math.floor(this.props.displayedPageNums/2)).keys()).reverse().map(n => {
                            let currPage = this.state.currPage - n - 1;

                            if (currPage >= 1) {
                                return (
                                    <Pagination.Item key={`page-${currPage}`}
                                        onClick={() => this.changePage(currPage)}>
                                        {currPage}
                                    </Pagination.Item>);
                            } else {
                                return null;
                            }
                        })
                    }
                    <Pagination.Item key="current" active={true}>{this.state.currPage}</Pagination.Item>
                    {
                        Array.from(Array(Math.floor(this.props.displayedPageNums/2)).keys()).map(n => {
                            let currPage = this.state.currPage + (n + 1);
                            if (currPage <= this.props.lastPage) {
                                return (
                                    <Pagination.Item key={`page-${currPage}`} 
                                        onClick={() => this.changePage(currPage)}>
                                        {currPage}
                                    </Pagination.Item>);
                            } else {
                                return null;
                            }
                        })
                    }
                    { 
                        (this.state.currPage + Math.floor(this.props.displayedPageNums/2) < this.props.lastPage) ?
                        <Pagination.Ellipsis disabled={true} /> :
                        null
                    }
                    <Pagination.Next key="next" onClick={() => this.changePage(this.state.currPage + 1)}
                        disabled={this.state.currPage === this.props.lastPage} />
                    <Pagination.Last key="last" onClick={() => this.changePage(this.props.lastPage)}
                        disabled={this.state.currPage === this.props.lastPage}/>
                </Pagination>
        )
    }

    changePage(page: number) {
        this.setState({
            currPage: page
        }, () => {
            this.props.onSelect(this.state.currPage);
        });
    }
}
