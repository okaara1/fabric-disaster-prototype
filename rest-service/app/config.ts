
export const config = {
  certAuthority: {
    CA_CLIENT_ADDRES: 'https://localhost:7054', 
    CA_NAME: 'ca.example.com',
    ENROLLMENT_ID: 'admin', 
    ENROLLMENT_SECRET: 'adminpw'
  }, 
  channel: {
    NAME: 'mychannel',
    PEER_ADDRESS: 'grpc://peer0.org1.example.com:7051',
    ORDERER_ADDRESS: 'grpcs://orderer.example.com:7050',
    CHAINCODE_ID: 'prototype',
    storeFolder: 'hfc-key-store',
  },
  keyStore: {
    STORE_PATH: 'hfc-key-store'
  },
  users: {
    admin: {
      username: 'admin',
      mspid: 'Org1MSP',
    },
    user1: {
      username: 'user1',
      mspid: 'Org1MSP'
    }
  }
}
