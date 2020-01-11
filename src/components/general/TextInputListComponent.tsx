import React, { Component, FormEvent } from 'react'
import { Form } from 'react-bootstrap';

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
    }

    render() {
        return (
            <Form.Group controlId={this.props.controlId}>
                <Form.Label>{this.props.label}</Form.Label>
                {this.state.texts.map((text,index) => {
                    return (
                        <Form.Control key={`textInput${index}`} 

                            type="text" 
                            defaultValue={text} onChange={(e: React.FormEvent<HTMLInputElement>) => this.changeText(e,index)} />
                    );
                })}
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
}
