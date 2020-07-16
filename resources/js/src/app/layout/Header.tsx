import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { UserRoles } from '../models/role.model';

export class Header extends Component {
    render() {
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
                                    <li className="list-inline-item"><a href="#" className="text-dark">Hello, {localStorage.getItem('name')}</a></li>
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
                        <a className="navbar-brand" href="#">Navbar</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
        
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                    <Link className="nav-link mr-4" to="/">Dashborad<span className="sr-only">(current)</span></Link>
                            </li>
                            <UserContext.Consumer>
                                {
                                    (user) => {
                                        if(user.role == UserRoles.ADMIN)
                                        {
                                            return (
                                                <Fragment>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" onClick={(e) => this.forceUpdate()} to="/projects">Projects</Link>
                                                    </li>                           
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" to="/users">User</Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" to="/teams">Teams</Link>
                                                    </li>
                                                </Fragment>
                                            )
                                        } else {
                                            return (
                                                <Fragment>
                                                    <li className="nav-item">
                                                        <Link className="nav-link mr-4" onClick={(e) => this.forceUpdate()} to="/projects">Projects</Link>
                                                    </li> 
                                                </Fragment>
                                            )
                                        }
                                    }
                                }
                            </UserContext.Consumer>
                            <li className="nav-item active">
                                    <a className="nav-link mr-4" href="/logout">Logout<span className="sr-only">(current)</span></a>
                            </li>
                            </ul>
                            <form className="form-inline my-2 my-lg-0">
                                <input className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
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

export default Header;
