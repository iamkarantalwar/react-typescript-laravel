import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { UserRoles } from '../models/role.model';
import { RouteComponentProps } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import i18n from '../../i8n';

interface IProps extends RouteComponentProps, WithTranslation{ }

interface IState {
    search: string;
}

class Header extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            search: "",
        }
    }

    searchProject = () => {
        this.props.history.push(`/projects?search=${this.state.search}`);
    }

    render() {
            const t  = this.props.t;
            return (
                <div className="top-bar py-3">
                    <div className="container">
                        <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="logo">
                                <img src='../../../images/logo.jpg'/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="top-bar-social-links text-right">
                                <ul className="list-inline">
                                    <li className="list-inline-item"><a href="#" className="text-dark">{t('Welcome')}, {localStorage.getItem('name')}</a></li>
                                    <li className="list-inline-item"><a href="#"><i className="fa fa-bell-o" aria-hidden="true"></i></a></li>
                                    <li className="list-inline-item"><a href="#"><i className="fa fa-calendar" aria-hidden="true"></i></a></li>
                                    <li className="list-inline-item"><a href="#"><i className="fa fa-th" aria-hidden="true"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                    <header className="tab-header">
                        <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                    <Link className="nav-link mr-4" to="/">{t('Dashboard')}<span className="sr-only">(current)</span></Link>
                            </li>
                            <UserContext.Consumer>
                                {
                                    (user) => {
                                        if(user.role == UserRoles.ADMIN)
                                        {
                                            return (
                                                <Fragment>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" onClick={(e) => this.forceUpdate()} to="/projects">{t('Projects')}</Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" to="/users">{t('Users')}</Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" to="/teams">{t('Teams')}</Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" to="/taps">{t('Taps')}</Link>
                                                    </li>
                                                </Fragment>
                                            )
                                        } else {
                                            return (
                                                <Fragment>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" onClick={(e) => this.forceUpdate()} to="/projects">{t('Projects')}</Link>
                                                    </li>

                                                </Fragment>
                                            )
                                        }
                                    }
                                }
                            </UserContext.Consumer>
                                <li className="nav-item active">
                                    <a className="nav-link mr-4" href="/logout">{t('Logout')}<span className="sr-only">(current)</span></a>
                                </li>
                                <li>
                                    <select onChange={(e) => i18n.changeLanguage(e.target.value)} className="nav-link mr-4 lang-selector">
                                        <option value={'en'}>English</option>
                                        <option value={'ge'}>Germany</option>
                                    </select>

                                </li>
                            </ul>
                            <form className="form-inline my-2 my-lg-0" action="/projects" onSubmit={this.searchProject}>
                                <input className="form-control mr-sm-2" onChange={(e) => this.setState({search: e.target.value})} type="search" name="search" placeholder={t('Search')} aria-label="Search"/>
                                <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                            </form>
                        </div>
                        </nav>
                    </div>
                   </header>
                </div>

            );

    }
}



export default  withTranslation("translation")(withRouter(Header));
