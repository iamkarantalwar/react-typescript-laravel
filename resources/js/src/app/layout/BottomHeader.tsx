import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TitleContext } from '../../context/TitleContext';
import { connect } from 'react-redux';
import { RootState,changeTitle } from '../../redux';
import { withTranslation, WithTranslation } from 'react-i18next';

const mapStateToProps = (state: RootState) => ({
    title: state.title,
});

const mapDispatchToProps = { changeTitle };

type ReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface IProps extends RouteComponentProps,ReduxProps, WithTranslation {}


export class BottomHeader extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const t = this.props.t;
        const path = this.props.location.pathname.split("/")[1];
        let context:{title: string} = this.context;
        let title_ = path.length === 0 ? t("Dashboard") : t(this.capitalizeFirstLetter(path));
        title_ = this.props.title.title ? this.props.title.title : title_;
        return (
            <div>
                <section className="test-project mt-4">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="test-proj-tittel">
                                        <h3 className="font-weight-normal">{title_}</h3>
                                        <p><i className="fa fa-home" aria-hidden="true"></i> - {title_} </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                </div>
                            </div>
                        </div>
                </section>
            </div>
        );
    }
}
BottomHeader.contextType = TitleContext;

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(withRouter(BottomHeader)));
