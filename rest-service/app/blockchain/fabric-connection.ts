'use strict';

/** System imports */
import path from 'path';

/** Fabric specific imports */
const Client = require('fabric-client');

/** config file */
import { config } from "../config";

export class FabricConnection {
  
  /** shared variables */
  protected fabricClient;
  protected channel;
  protected peer;
  protected orderer;
  protected member_user;
  protected store_path;
  protected tx_id;

  constructor(fabricClient = new Client()) {
    console.log('FabricConnection constructor');
    this.fabricClient = fabricClient;
    // setup the fabric network
    this.channel = fabricClient.newChannel(config.channel.NAME);
    this.peer = fabricClient.newPeer(config.channel.PEER_ADDRESS, {}); // TODO: change peer address to access a different peer
    this.channel.addPeer(this.peer);
    this.orderer = fabricClient.newOrderer(config.channel.ORDERER_ADDRESS)
    this.channel.addOrderer(this.orderer);
    this.member_user = null;
    this.store_path = path.join(__dirname, config.keyStore.STORE_PATH);
    console.log('Store path:' + this.store_path);
    this.tx_id = null;
  }

  protected async setupCryptoMaterial() {
    try {
      console.log("setupCryptoMaterial()");
      let state_store = await Client.newDefaultKeyValueStore({ path: this.store_path });
      this.fabricClient.setStateStore(state_store);
      let crypto_suite = Client.newCryptoSuite();
      // use the same location for the state store (where the users' certificate are kept)
      // and the crypto store (where the users' keys are kept)
      let crypto_store = Client.newCryptoKeyStore({ path: this.store_path });
      crypto_suite.setCryptoKeyStore(crypto_store);
      this.fabricClient.setCryptoSuite(crypto_suite);
    } catch (error) {
      console.error(error);
    }
  }

  protected async loadUserFromStore() {

    try {
      console.log("loadUserFromStore()");

      // get the enrolled user from persistence, this user will sign all requests
      let user_from_store = await this.fabricClient.getUserContext('user1', true);
      
      if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded user1 from persistence');
        this.member_user = user_from_store;
      } else {
        throw new Error('Failed to get user1.... run registerUser.js');
      }
    } catch (error) {
      console.error(error);
    }
  }

}