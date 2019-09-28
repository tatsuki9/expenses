package main

import (
	"encoding/json"
	"log"
	"net/http"
	"expenses/models/mst"
)

type SaveDetailStruct struct {
	Date     string `json:"date"`
	Price    uint64 `json:"price"`
	Category string `json:"category"`
}

func GetCategories(w http.ResponseWriter, r *http.Request, id int) {
	log.Println("[GetCategories] start")
	log.Println("[GetCategories] user_id: ")
	log.Println(id)

	var statusCode = http.StatusOK
	mstCategories, err := mst.GetAllMstCategory()
	if err != nil {
		log.Println("[GetCategories/Error] something error occured when get user from db", err)
		AnswerSomethingError(w, "[Error] something error occured when get user from db", http.StatusInternalServerError, true)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(statusCode)
	err = json.NewEncoder(w).Encode(mstCategories)
	if err != nil {
		panic(err)
	}
}

func PostSaveDetail(w http.ResponseWriter, r *http.Request, id int) {
	log.Println("[PostSaveDetail] start")
	log.Println(r.Body)
	log.Println(r.Header.Get("Content-Type"))
	var saveDetailStruct SaveDetailStruct
	err := json.NewDecoder(r.Body).Decode(&saveDetailStruct)
	defer r.Body.Close()

	log.Println(saveDetailStruct)

	if err != nil {
		log.Println("[PostSaveDetail/Error] during parsing requestData", err)
		AnswerSomethingError(w, "[Error] during parsing requestData", http.StatusBadRequest, true)
		return
	}
}
