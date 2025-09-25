import React, { Component } from "react";

export default class SideLogin extends Component {
  render() {
    return (
      <div className={`flex flex-col items-center justify-center ${this.props.className}`}>
        <p className="text-center mb-4">{this.props.titre}</p>
        <button className="">{this.props.bouton}</button>
      </div>
    );
  }
}
