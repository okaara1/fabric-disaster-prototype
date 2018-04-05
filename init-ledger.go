package main

// Commands:
// 		go build init-ledger.go
// 		./init-ledger

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

// MedicalRecord implements a simple chaincode to manage an asset
type MedicalRecord struct {
	Name     string `json:"name"`
	Gender   string `json:"gender"`
	Lastname string `json:"lastname"`
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
	fmt.Println(toJSON(records))
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
