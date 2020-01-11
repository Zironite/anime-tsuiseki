import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState, AppStateActionTypes } from '../../globalState/rootReducer'
import { type } from 'os'
import { ISetFileNameRegexes } from "../../globalState/actions";
import { Form, Button } from 'react-bootstrap';
import TextInputListComponent from '../general/TextInputListComponent';

interface Props {
    
}
interface State {
    fileNameRegexes: string[]
}

export class DetectionSettingsComponent extends Component<TDetectionSettingsComponentProps, State> {
    state: State = {
        fileNameRegexes: []
    }
    constructor(props: TDetectionSettingsComponentProps) {
        super(props);

        this.setState({
            fileNameRegexes: this.props.fileNameRegexes || []
        });

        this.onFileNameRegexesChange = this.onFileNameRegexesChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    render() {
        return (
            <Form>
                <TextInputListComponent controlId="formFileNameRegexes" 
                    label="Filename Regexes" 
                    texts={this.props.fileNameRegexes || []} 
                    onChange={this.onFileNameRegexesChange}/>
                <Button variant="dark" onClick={this.saveChanges}>
                    Save
                </Button>
            </Form>
        )
    }

    onFileNameRegexesChange(fileNameRegexes: string[]) {
        this.setState({
            fileNameRegexes: fileNameRegexes
        });
    }

    saveChanges() {
        this.props.setFileNameRegexes(this.state.fileNameRegexes);
    }
}

const mapStateToProps = (state: AppState) => ({
    fileNameRegexes: state.fileNameRegexes
});

const setFileNameRegexes = ( fileNameRegexes: string[]) => ({
    type: AppStateActionTypes.SET_FILENAME_REGEXES,
    fileNameRegexes: fileNameRegexes
}) as ISetFileNameRegexes;

const mapDispatchToProps = {
    setFileNameRegexes
}

type TDetectionSettingsComponentProps = Props & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(DetectionSettingsComponent)
