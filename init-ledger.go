package main

// Commands:
// 		go build init-ledger.go
// 		./init-ledger

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
)

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

func (p MedicalRecord) toString() string {
	return toJSON(p)
}

func toJSON(p interface{}) string {
	bytes, err := json.Marshal(p)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	return string(bytes)
}

func main() {
	records := getRecords()
	jsonrecords := toJSON(records)
	//bytes, _ := json.Marshal(records)
	//bytesString := string(bytes)
	fmt.Println(jsonrecords)
	fmt.Println(len(records))
	for i := 0; i < len(records); i++ {
		recordsAsBytes, _ := json.Marshal(cars[i])
	}

	i := 0
	for i < len(cars) {
		fmt.Println("i is ", i)
		carAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
		fmt.Println("Added", cars[i])
		i = i + 1
	}

	//APIstub.PutState(bytes)

}

func getRecords() []MedicalRecord {
	raw, err := ioutil.ReadFile("init-records.json")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	var c []MedicalRecord
	json.Unmarshal(raw, &c)
	return c
}
