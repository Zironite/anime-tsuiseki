import React, { Component, FormEvent } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FaPlus, FaMinus } from "react-icons/fa";
import './TextInputListComponent.css';

interface Props {
    controlId: string,
    label: string,
    texts: string[],
    onChange: (texts: string[]) => void
}

interface State {
    texts: string[]
}

export default class TextInputListComponent extends Component<Props, State> {
    state: State = {
        texts: []
    }

    constructor(props: Props) {
        super(props);

        this.state.texts = this.props.texts;
        this.changeText = this.changeText.bind(this);
        this.addText = this.addText.bind(this);
        this.removeText = this.removeText.bind(this);
    }

    render() {
        return (
            <Form.Group controlId={this.props.controlId}>
                <Form.Label>{this.props.label}</Form.Label>
                {this.state.texts.map((text,index) => {
                    return (
                        <Row className="mb-2 mt-2" key={`textInput${index}`}>
                            <Col sm={6}>
                                <Form.Control
                                    type="text" 
                                    value={text} onChange={(e: React.FormEvent<HTMLInputElement>) => this.changeText(e,index)} />
                            </Col>
                            <Col>
                                <Button className="remove-button"
                                    onClick={() => this.removeText(index)}>
                                    <FaMinus />
                                </Button>
                            </Col>
                        </Row>
                    );
                })}
                <Button className="add-button" onClick={this.addText}>
                    <FaPlus />
                </Button>
            </Form.Group>
        )
    }

    componentDidUpdate(_prevProps: Props, prevState: State) {
        if (this.state.texts !== prevState.texts) {
            this.props.onChange(this.state.texts);
        }
    }

    changeText(e: React.FormEvent<HTMLInputElement>, index: number) {
        const newValue = e.currentTarget.value;
        const newTexts = [...this.state.texts];
        newTexts[index] = newValue;
        this.setState({
            texts: newTexts
        });
    }

    addText() {
        this.setState({
            texts: [...this.state.texts,""]
        });
    }

    removeText(index: number) {
        const newTexts = this.state.texts.filter((_v,currIndex) => currIndex !== index);
        this.setState({
            texts: newTexts
        });
    }
}
