import React, { Component, Fragment } from 'react';
import Loader  from 'react-loader-spinner';
class LoaderBar extends Component {
    render() {
        return (
            <Fragment>
                  <div
                    style={{
                        width: "100%",
                        height: "100",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                    <Loader type="ThreeDots" color="#2BAD60" height={100} width={100} />
            </div>
            </Fragment>
        );
    }
}

export default LoaderBar;
