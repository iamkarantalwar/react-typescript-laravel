import React, { Component } from 'react';
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
                                    <li className="list-inline-item"><a href="#" className="text-dark">Hello, bob</a></li>
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
                                <a className="nav-link mr-4" href="/">Dashborad<span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mr-4" href="/projects">Projects</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mr-4" href="Settings.html">Settings</a>
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
                   <section className="test-project mt-5">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="test-proj-tittel">
                                        <h3 className="font-weight-normal">Dashborad</h3>
                                        <p><i className="fa fa-home" aria-hidden="true"></i> - Projects </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="test-proj-date text-right">
                                        <p>Heute:<a href="#"> 01 April</a></p>
                                    </div>
                                </div>
                            </div>            
                        </div>
                    </section>
                </div>
                
            );
        
    }
}

export default Header;
