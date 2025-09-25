import React, { Component } from "react";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default class Connexion extends Component {
  constructor(props) {
    super(props);
    this.state = { showPassword: false };
  }

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

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
                  className="inputConnexion1 bg-gray-50 w-full pl-8"
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
                  type={this.state.showPassword ? "text" : "password"}
                  placeholder=""
                  className="inputConnexion1 bg-gray-50 w-full pl-8 pr-10"
                />

                {/* Swap pour œil / œil barré */}
                <label className="swap swap-rotate absolute right-2 top-1/2 transform -translate-y-1/2">
                  <input 
                    type="checkbox" 
                    checked={this.state.showPassword} 
                    onChange={this.togglePassword} 
                  />
                  <EyeIcon className="swap-on w-4 h-4 text-blue-400" />
                  <EyeSlashIcon className="swap-off w-4 h-4 text-blue-400" />
                </label>
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
