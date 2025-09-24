import React, { Component } from "react";

export default class sideLogin extends Component {
  render() {
    return (
      <>
        <div className={"  mx-auto text-center justify-center items-center" + " " + this.props.className}>
          <h2>{this.props.titre}</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            {this.props.bouton}
          </button>
        </div>
      </>
    );
  }
}
