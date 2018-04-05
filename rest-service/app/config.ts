
export const config = {
  certAuthority: {
    CA_CLIENT_ADDRES: 'http://localhost:7054', 
    CA_NAME: 'ca.example.com',
    ENROLLMENT_ID: 'admin', 
    ENROLLMENT_SECRET: 'adminpw'
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
