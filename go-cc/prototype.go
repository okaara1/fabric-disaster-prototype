/////////////	Edited basic functions 	//////////////

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// SimpleAsset implements a simple chaincode to manage an asset
type SimpleAsset struct {
}

/* // MedicalRecord implements a simple chaincode to manage an asset
type MedicalRecord struct {
	FirstName      string   `json:"firstname"`
	LastName       string   `json:"lastname"`
	PersonalNumber string   `json:"personal_number"`
	Gender         string   `json:"gender"`
	Address        string   `json:"address"`
	ContactPerson  string   `json:"contact_person"`
	Caregivers     []string `json:"caregivers"`
	Allergies      []string `json:"allergies"`
	Places         []string `json:"places"`
	ClinicalInfo   []string `json:"clinicalinfo"`
}
*/

// MedicalRecord implements a simple chaincode to manage an asset
type MedicalRecord struct {
	Firstname string `json:"firstname"`
	Gender    string `json:"gender"`
	Lastname  string `json:"lastname"`
}

// MedicalRecords implements a simple chaincode to manage an asset
type MedicalRecords struct {
	MedicalRecords []MedicalRecord `json:"medicalrecords"`
}

// Init is called during chaincode instantiation to initialize any
// data. Note that chaincode upgrade also calls this function to reset
// or to migrate data.
func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke is called per transaction on the chaincode. Each transaction is
// either a 'get' or a 'set' on the asset created by Init function. The Set
// method may create a new asset by specifying a new key-value pair.
func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	// Extract the function and args from the transaction proposal
	function, args := stub.GetFunctionAndParameters()

	var result string
	var err error

	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "getMedicalRecord" {
		return s.getMedicalRecord(APIstub, args)
	} else if function == "createMedicalRecord" {
		return s.createMedicalRecord(APIstub)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "deleteMedicalRecord" {
		return s.deleteMedicalRecord(APIstub, args)
	}

	if err != nil {
		return shim.Error(err.Error())
	}

	// Return the result as success payload
	return shim.Success([]byte(result))
}

// Retrieve medical record of person with personal number as identifier
func (t *SimpleChaincode) getMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var personalNumber string // Entity
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting personal number of the person to query")
	}

	personalNumber = args[0]

	// Get the state from the ledger
	medicalRecord, err := stub.GetState(personalNumber)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + personalNumber + "\"}"
		return shim.Error(jsonResp)
	}

	if medicalRecord == nil {
		jsonResp := "{\"Error\":\"No medical record with personal number " + personalNumber + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"Personal number\":\"" + A + "\",\"Medical Record\":\"" + string(Avalbytes) + "\"}"
	fmt.Printf("Query Response:%s\n", jsonResp)
	return shim.Success(Avalbytes)
}

func (s *SmartContract) createMedicalRecord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var car = Car{Make: args[1], Model: args[2], Colour: args[3], Owner: args[4]}

	carAsBytes, _ := json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

// Not finished at all
func (t *SimpleChaincode) deleteMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	A := args[0]

	// Delete the key from the state in ledger
	err := stub.DelState(A)
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	return shim.Success(nil)
}

////////////////	Retrieve JSON template records	//////////////

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	pages := getPages()
	for _, p := range pages {
		fmt.Println(p.toString())
		recordAsBytes, _ := json.Marshal(p)
		APIstub.PutState("MedicalRecord"+strconv.Itoa(i), recordAsBytes)
	}

	return shim.Success(nil)
}

func (p MedicalRecord) toString() string {
	return toJson(p)
}

func toJson(p interface{}) string {
	bytes, err := json.Marshal(p)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	return string(bytes)
}

func getPages() []MedicalRecord {
	raw, err := ioutil.ReadFile("init-records.json")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	var c []MedicalRecord
	json.Unmarshal(raw, &c)
	return c
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SimpleAsset))
	if err != nil {
		fmt.Printf("Error creating new Simple Asset: %s", err)
	}
}
