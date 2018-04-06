package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

// MedicalRecord implements a simple chaincode to manage an asset
type MedicalRecord struct {
	Firstname string `json:"firstname"`
	Gender    string `json:"gender"`
	Lastname  string `json:"lastname"`
}

// MedicalRecords implements a simple chaincode to manage an asset
type MedicalRecords struct {
	MedicalRecords []MedicalRecord `json:"medicalRecords"`
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

func main() {

	pages := getPages()
	for _, p := range pages {
		fmt.Println(p.toString())
	}

	fmt.Println(toJson(pages))
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
