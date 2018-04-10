package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

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

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

// MedicalRecord implements a simple chaincode to manage an asset
type MedicalRecord struct {
	PersonalNumber string   `json:"personal_number"`
	Firstname      string   `json:"firstname"`
	Lastname       string   `json:"lastname"`
	Gender         string   `json:"gender"`
	Address        string   `json:"address"`
	ContactPerson  string   `json:"contact_person"`
	Caregivers     []string `json:"caregivers"`
	Allergies      []string `json:"allergies"`
	Places         []string `json:"places"`
	ClinicalInfo   []string `json:"clinicalinfo"`
}

// MedicalRecords implements a simple chaincode to manage an asset
type MedicalRecords struct {
	MedicalRecords []MedicalRecord `json:"medicalrecords"`
}

// Init is called during chaincode instantiation to initialize any
// data. Note that chaincode upgrade also calls this function to reset
// or to migrate data.
func (t *MedicalRecord) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke is called per transaction on the chaincode. Each transaction is
// either a 'get' or a 'set' on the asset created by Init function. The Set
// method may create a new asset by specifying a new key-value pair.
func (t *MedicalRecord) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	// Extract the function and args from the transaction proposal
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	var result string
	var err error

	// Route to the appropriate handler function to interact with the ledger
	if function == "getMedicalRecord" {
		return t.getMedicalRecord(stub, args)
	} else if function == "createMedicalRecord" {
		//return t.createMedicalRecord(stub, args)
	} else if function == "initLedger" {
		return t.initLedger(stub)
	} else if function == "deleteMedicalRecord" {
		return t.deleteMedicalRecord(stub, args)
	}

	if err != nil {
		return shim.Error(err.Error())
	}

	// Return the result as success payload
	return shim.Success([]byte(result))
}

// Retrieve medical record of person with personal number as identifier
func (t *MedicalRecord) getMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
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

	jsonResp := "{\"Personal number\":\"" + personalNumber + "\",\"Medical Record\":\"" + string(medicalRecord) + "\"}"
	fmt.Printf("Query Response:%s\n", jsonResp)
	return shim.Success(medicalRecord)
}

/* func (t *MedicalRecord) createMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}

	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}
*/

// Not finished at all
func (t *MedicalRecord) deleteMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
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

// Initate ledger with sample data
func (t *MedicalRecord) initLedger(stub shim.ChaincodeStubInterface) pb.Response {
	medicalRecords := []MedicalRecord{
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Cecile", Lastname: "Graves", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Vinson", Lastname: "Browning", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Susan", Lastname: "Hickman", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Lula", Lastname: "Merrill", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Shari", Lastname: "Mcintyre", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Campbell", Lastname: "Ball", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Lindsay", Lastname: "Knapp", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Cruz", Lastname: "Berg", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Griffith", Lastname: "Lloyd", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "123456-7890", Firstname: "Candace", Lastname: "Oconnor", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
	}

	i := 0
	for i < len(medicalRecords) {
		recordAsBytes, _ := json.Marshal(medicalRecords[i])
		stub.PutState("MedicalRecord"+strconv.Itoa(i), recordAsBytes)
		fmt.Println("Added", medicalRecords[i])
		i = i + 1
	}

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Medical Record
	err := shim.Start(new(MedicalRecord))
	if err != nil {
		fmt.Printf("Error creating new Simple Asset: %s", err)
	}
}
