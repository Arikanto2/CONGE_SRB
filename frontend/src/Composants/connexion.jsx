import React, { Component } from "react";
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid'

export default class Connexion extends Component {
  render() {
    return (
      <div className="items-center">
        <form>
          <div>
            <p className="labeConnex text-center mb-4">Connexion.</p>

            <div className="mb-4">
              <label className="text-left block text-m font-serif">Identifiant:</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <UserIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder=""
                  className="inputConnexion1 bg-gray-50" 
                />
              </div>
            </div>

            <div className="mt-4 mb-4">
              <label className="text-left block text-m font-serif">Mot de passe:</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <LockClosedIcon className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  placeholder=""
                  className="inputConnexion1 bg-gray-50" 
                />
              </div>
            </div>

            <button className="btnConnexion mx-auto block">
              se connecter
            </button>
          </div>
        </form>
      </div>
    );
  }
}
