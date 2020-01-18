import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import './AnimeTile.css';

interface Props {
    animeName: string,
    bannerUrl: string
}
interface State {
    
}

export default class AnimeTile extends Component<Props, State> {
    state = {}

    render() {
        return (
            <Card className="bg-dark text-white">
                <Card.Img src={this.props.bannerUrl} className="anime-tile-img-fit" />
                <Card.ImgOverlay className="img-overlay-gradient">
                    <Card.Title>{this.props.animeName}</Card.Title>
                </Card.ImgOverlay>
            </Card>
        )
    }
}
