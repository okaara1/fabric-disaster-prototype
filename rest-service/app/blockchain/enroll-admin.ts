import { config } from "../config";

'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Enroll the admin user
 */

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:' + store_path);
console.log(Fabric_Client);

export async function enrollAdmin(username: string = 'admin', password: string = 'adminpw') {

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
let state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });

// assign the store to the fabric client
fabric_client.setStateStore(state_store);
var crypto_suite = Fabric_Client.newCryptoSuite();
// use the same location for the state store (where the users' certificate are kept)
// and the crypto store (where the users' keys are kept)
var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
crypto_suite.setCryptoKeyStore(crypto_store);
fabric_client.setCryptoSuite(crypto_suite);
var tlsOptions = {
  trustedRoots: [],
  verify: false
};
// be sure to change the http to https when the CA is running TLS enabled
fabric_ca_client = new Fabric_CA_Client(config.certAuthority.CA_CLIENT_ADDRES, tlsOptions, 'ca0', crypto_suite);

// first check to see if the admin is already enrolled
let user_from_store = await fabric_client.getUserContext('admin', true);

if (user_from_store && user_from_store.isEnrolled()) {
  console.log('Successfully loaded admin from persistence');
  admin_user = user_from_store;

} else {

  try {
    // need to enroll it with CA server
    let enrollment = await fabric_ca_client.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw'
    });
    
    console.log('Successfully enrolled admin user "admin"');
    
    admin_user = await fabric_client.createUser({
      username: 'admin',
      mspid: 'Org1MSP',
      cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
    });
    
     await fabric_client.setUserContext(admin_user);

  } catch(err) {
      console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
      throw new Error('Failed to enroll admin');
  }
}

console.log('Assigned the admin user to the fabric client ::' + admin_user.toString());
}

// execute();

