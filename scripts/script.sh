#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Build your first network (BYFN) end-to-end test"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

CC_SRC_PATH="github.com/chaincode/prototype/go/"
if [ "$LANGUAGE" = "node" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/chaincode_example02/node/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

createChannel() {
	setGlobals 0 1

	if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
                set -x
		peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx >&log.txt
		res=$?
                set +x
	else
				set -x
		peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
		res=$?
				set +x
	fi
	cat log.txt
	verifyResult $res "Channel creation failed"
	echo "===================== Channel \"$CHANNEL_NAME\" is created successfully ===================== "
	echo
}

joinChannel () {
	for org in 1 2 3 4 5; do
	    for peer in 0 1; do
		joinChannelWithRetry $peer $org
		echo "===================== peer${peer}.org${org} joined on the channel \"$CHANNEL_NAME\" ===================== "
		sleep $DELAY
		echo
	    done
	done
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for org1..."
updateAnchorPeers 0 1
echo "Updating anchor peers for org2..."
updateAnchorPeers 0 2
echo "Updating anchor peers for org3..."
updateAnchorPeers 0 3
echo "Updating anchor peers for org4..."
updateAnchorPeers 0 4
echo "Updating anchor peers for org5..."
updateAnchorPeers 0 5


#echo "Installing test chaincode on peer0.org1..."
#installTestChaincode 0 1

#echo "Instantiating chaincode on peer0.org1..."
#instantiateChaincode 0 1

#echo "Querying chaincode on peer0.org1..."
#chaincodeQuery 0 1 100


## Install chaincode on peer0.org1 and peer0.org2
echo "Installing chaincode on peer0.org1..."
installChaincode 0 1
echo "Installing chaincode on peer0.org2..."
installChaincode 0 2
echo "Installing chaincode on peer0.org3..."
installChaincode 0 3
echo "Installing chaincode on peer0.org4..."
installChaincode 0 4
echo "Installing chaincode on peer0.org5..."
installChaincode 0 5


# # Instantiate chaincode on peer0.org1
echo "Instantiating chaincode on peer0.org1..."
instantiateChaincode 0 1
# # Instantiate chaincode on peer0.org2
echo "Instantiating chaincode on peer0.org2..."
instantiateChaincode 0 2
# # # Instantiate chaincode on peer0.org2
# echo "Instantiating chaincode on peer0.org3..."
# instantiateChaincode 0 3
# ## Instantiate chaincode on peer0.org2
# echo "Instantiating chaincode on peer0.org4..."
# instantiateChaincode 0 4
# ## Instantiate chaincode on peer0.org2
# echo "Instantiating chaincode on peer0.org5..."
# instantiateChaincode 0 5

# # Invoke chaincode on peer0.org1
echo "Sending invoke transaction on peer0.org1..."
chaincodeInvoke 0 1

# # # Query chaincode on peer0.org1
echo "Querying chaincode on peer0.org1..."
chaincodeQuery 0 4 100

# # # Query chaincode on peer0.org1
# echo "Querying chaincode on peer0.org2..."
# chaincodeQuery 0 2 100



# ## Install chaincode on peer1.org2
# echo "Installing chaincode on peer1.org2..."
# installChaincode 1 2

# # Query on chaincode on peer1.org2, check if the result is 90
# echo "Querying chaincode on peer1.org2..."
# chaincodeQuery 1 2 90



############### Write additional config for org 4 & 5 here ###########
# Syntax: [peer] [org]

## Example for Org 3: 
# updateAnchorPeers 0 3
# installChaincode 0 3
# instantiateChaincode 0 3
# chaincodeQuery 0 3 100
# ...


###############################################################



echo
echo "========= All GOOD, BYFN execution completed =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0


