import React, { Component } from "react";

export default class Connexion extends Component {
  render() {
    return (
      <div className="items-center">
        <form>
          <div>
            <h1 className="text-3xl font-bold mb-4">Connexion!</h1>

            <div>
              <label className="text-left block mb-1">Identifiant:</label>
              <input
                type="text"
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-left block mb-1">Mot de passe:</label>
              <input
                type="password"
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>

            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    );
  }
}
