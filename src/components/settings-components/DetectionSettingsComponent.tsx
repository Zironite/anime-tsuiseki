import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState, AppStateActionTypes } from '../../globalState/rootReducer'
import { type } from 'os'
import { ISetFileNameRegexes } from "../../globalState/actions";
import { Form } from 'react-bootstrap';
import TextInputListComponent from '../general/TextInputListComponent';

interface Props {
    
}
interface State {
}

export class DetectionSettingsComponent extends Component<TDetectionSettingsComponentProps, State> {
    state: State = {
    }
    constructor(props: TDetectionSettingsComponentProps) {
        super(props);
    }

    render() {
        return (
            <Form>
                <TextInputListComponent controlId="formFileNameRegexes" 
                    label="Filename Regexes" 
                    texts={this.props.fileNameRegexes || []} />
            </Form>
        )
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
