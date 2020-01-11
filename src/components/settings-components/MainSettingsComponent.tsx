import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../../globalState/rootReducer'
import { Tab, Row, Col, Nav } from 'react-bootstrap'

interface Props {
    
}
interface State {
    
}

export class MainSettingsComponent extends Component<Props, State> {
    state = {}

    render() {
        return (
            <Tab.Container defaultActiveKey="general">
                <Row>
                    <Col sm={3}>
                        <Nav variant="tabs" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="general">General</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="detection">Detection</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9} className="text-white">
                        <Tab.Content>
                            <Tab.Pane eventKey="general">
                                General
                            </Tab.Pane>
                            <Tab.Pane eventKey="detection">
                                Detection
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        )
    }
}
