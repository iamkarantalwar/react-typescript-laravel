import React from 'react';

function BredCrumb(){
    return (
       <div>
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

export default BredCrumb;