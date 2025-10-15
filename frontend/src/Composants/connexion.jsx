import React, { Component } from "react";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default class Connexion extends Component {
  constructor(props) {
    super(props);
    this.state = { showPassword: false };
  }

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    return (
      <div className="items-center">
        <form>
          <div>
            <p className="labeConnex mb-7 text-center">Connexion</p>

            <div className="mb-4">
              <label className="text-m block text-left font-serif">Identifiant:</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder=""
                  className="inputConnexion1 w-full bg-gray-50 pl-8"
                />
              </div>
            </div>

            <div className="mb-4 mt-4">
              <label className="text-m block text-left font-serif">Mot de passe:</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  type={this.state.showPassword ? "text" : "password"}
                  placeholder=""
                  className="inputConnexion1 w-full bg-gray-50 pl-8 pr-10"
                />

                {/* Swap pour œil / œil barré */}
                <label className="swap swap-rotate absolute right-2 top-1/2 -translate-y-1/2 transform">
                  <input
                    type="checkbox"
                    checked={this.state.showPassword}
                    onChange={this.togglePassword}
                  />
                  <EyeIcon className="swap-on h-4 w-4 text-blue-400" />
                  <EyeSlashIcon className="swap-off h-4 w-4 text-blue-400" />
                </label>
              </div>
            </div>

            <button className="btnConnexion mx-auto block mt-10" >
              se connecter
            </button>
            <p className="inscriptionLink mx-auto mt-2 block w-fit transition-all duration-1000 hover:underline " onClick={this.props.activeDefil}>
              Créer un compte
            </p>
          </div>
        </form>
      </div>
    );
  }
}
