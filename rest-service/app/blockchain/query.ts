'use strict';

import { config } from "../config";
import { FabricConnection } from "./fabric-connection";
import { Car } from "../models/car.model";
import { MedicalRecord } from "../models/medical-record.model";

export class HealthRecordQueries extends FabricConnection {

  constructor() {
    super();
  }

  async queryAllRecords(username: string = 'user1', mspid: string = 'Org1MSP'): Promise<MedicalRecord[]> { 

    try {

      await super.setupCryptoMaterial();
      await super.loadUserFromStore();

      // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
      // queryAllCars chaincode function - requires no arguments , ex: args: [''],
      const request = {
        //targets : --- letting this default to the peers assigned to the channel
        chaincodeId: config.channel.CHAINCODE_ID,
        fcn: 'queryAllRecords',
        args: ['']
      };

      // send the query proposal to the peer
      return new Promise<MedicalRecord[]>((resolve, reject) => {
        this.channel
          .queryByChaincode(request)
          .then(queryResponses => {
            if (queryResponses && queryResponses.length == 1) {
              if (queryResponses[0] instanceof Error) {
                throw queryResponses[0];
              } 
              resolve(JSON.parse(queryResponses[0].toString()));
            } else {
              console.log("No payloads were returned from query");
              resolve([]);
            }
          })
          .catch(err => reject(err));
      }); 

    } catch (err) {
      console.error(err);
    }
  }

  async queryRecordById(recordId: string): Promise<MedicalRecord> { 

    try {

      await super.setupCryptoMaterial();
      await super.loadUserFromStore();

      // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
      // queryAllCars chaincode function - requires no arguments , ex: args: [''],
      const request = {
        //targets : --- letting this default to the peers assigned to the channel
        chaincodeId: config.channel.CHAINCODE_ID,
        fcn: 'getMedicalRecord',
        args: [recordId]
      };

      // send the query proposal to the peer
      return new Promise<MedicalRecord>((resolve, reject) => {
        this.channel
          .queryByChaincode(request)
          .then(queryResponses => {

            if (!queryResponses.toString()) {
              throw new Error('The record does not exist');
            }
            resolve(JSON.parse(queryResponses.toString())); 
          })
          .catch(err => {
            reject(new Error('The record does not exist'));
          });
      });

    } catch (err) {
      console.error(err);
    }
  }

}


// var Fabric_Client = require('fabric-client');
// var path = require('path');
// var util = require('util');
// var os = require('os');

// //
// var fabric_client = new Fabric_Client();

// import { config } from "../config";
// import { FabricConnection } from "./fabric-connection";
// import { Car } from "../models/car.model";

// // setup the fabric network
// var channel = fabric_client.newChannel(config.channel.NAME);
// var peer = fabric_client.newPeer(config.channel.PEER_ADDRESS); // TODO: change peer address to access a different peer
// channel.addPeer(peer);

// //
// var member_user = null;
// var store_path = path.join(__dirname, config.keyStore.STORE_PATH);
// console.log('Store path:' + store_path);
// var tx_id = null;

// export async function queryAllRecords(username: string = 'user1', mspid: string = 'Org1MSP') { 
//   try {
//     let state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });
//     // assign the store to the fabric client
//     fabric_client.setStateStore(state_store);
//     var crypto_suite = Fabric_Client.newCryptoSuite();
//     // use the same location for the state store (where the users' certificate are kept)
//     // and the crypto store (where the users' keys are kept)
//     var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
//     crypto_suite.setCryptoKeyStore(crypto_store);
//     fabric_client.setCryptoSuite(crypto_suite);

//     // get the enrolled user from persistence, this user will sign all requests
//     let user_from_store = await fabric_client.getUserContext('user1', true);

//     if (user_from_store && user_from_store.isEnrolled()) {
//       console.log('Successfully loaded user1 from persistence');
//       member_user = user_from_store;
//     } else {
//       throw new Error('Failed to get user1.... run registerUser.js');
//     }

//     // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
//     // queryAllCars chaincode function - requires no arguments , ex: args: [''],
//     const request = {
//       //targets : --- letting this default to the peers assigned to the channel
//       chaincodeId: 'fabcar',
//       fcn: 'queryAllCars',
//       args: ['']
//     };

//     // send the query proposal to the peer
//     let query_responses = await channel.queryByChaincode(request);
//     console.log("Query has completed, checking results");
//     // query_responses could have more than one  results if there multiple peers were used as targets
//     if (query_responses && query_responses.length == 1) {
//       if (query_responses[0] instanceof Error) {
//         console.error("error from query = ", query_responses[0]);
//       } else {
//         console.log("Response is ", query_responses[0].toString());
//         return query_responses[0].toString();
//       }
//     } else {
//       console.log("No payloads were returned from query");
//     }
//   } catch (err) {
//     console.error('Failed to query successfully :: ' + err);
//   }

// }


// export async function queryRecordById(recordId: string) { 

//     let state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });
//     // assign the store to the fabric client
//     fabric_client.setStateStore(state_store);
//     var crypto_suite = Fabric_Client.newCryptoSuite();
//     // use the same location for the state store (where the users' certificate are kept)
//     // and the crypto store (where the users' keys are kept)
//     var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
//     crypto_suite.setCryptoKeyStore(crypto_store);
//     fabric_client.setCryptoSuite(crypto_suite);

//     // get the enrolled user from persistence, this user will sign all requests
//     let user_from_store = await fabric_client.getUserContext('user1', true);

//     if (user_from_store && user_from_store.isEnrolled()) {
//       console.log('Successfully loaded user1 from persistence');
//       member_user = user_from_store;
//     } else {
//       throw new Error('Failed to get user1.... run registerUser.js');
//     }

//     // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
//     // queryAllCars chaincode function - requires no arguments , ex: args: [''],
//     const request = {
//       //targets : --- letting this default to the peers assigned to the channel
//       chaincodeId: 'fabcar',
//       fcn: 'queryCar',
//       args: [recordId]
//     };

//     // send the query proposal to the peer
//     let query_responses = await channel.queryByChaincode(request);
//     console.log("Query has completed, checking results");
//     if (!query_responses.toString()) {
//       throw new Error('The record does not exist');
//     }
//     return query_responses.toString(); 
    

// }