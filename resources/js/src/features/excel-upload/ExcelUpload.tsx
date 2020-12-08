import React, { Component } from 'react';
import axios from 'axios';
import LoaderBar from '../../app/common/LoaderBar';
import { WithTranslation, withTranslation } from 'react-i18next';

interface IProps extends WithTranslation {

}

interface IState {
    selectedFile: any;
    loader: boolean;
}

class ExcelUpload extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            loader: false,
            selectedFile: undefined
        }
    }

    onFileChange = (event: any) => {
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
    };
    // On file upload (click the upload button)
    onFileUpload = () => {

        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
          "file",
          this.state.selectedFile,
          this.state.selectedFile.name
        );

        // Start The Loader
        console.log(this.state.selectedFile);
        this.setState({
            loader: true,
        });
        // Request made to the backend api
        // Send formData object
        axios.post("/api/excel", formData)
        .then((res) => {
            alert(this.props.t('Excel upload successfully'));
        }).catch((err) => {
            alert(this.props.t('Excel upload failed'));
        }).finally(() => {
            this.setState({
                loader: false,
            });
        });
      };

    render() {
        return (
            <div className="container">
                {
                    this.state.loader ? <LoaderBar/> :
                    <form>
                        <input
                            type="file"
                            name="file"
                            onChange={this.onFileChange}
                        />
                        <button
                            style={{width:'145px'}}
                            type="button"
                            className="main-btn"
                            onClick={this.onFileUpload}
                        >
                            {this.props.t('upload excel')}
                        </button>
                    </form>
                }
            </div>
        );
    }
}

export default withTranslation()(ExcelUpload);
