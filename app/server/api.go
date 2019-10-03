package main

import (
	"encoding/json"
	"log"
	"net/http"
	"expenses/models"
	"expenses/models/mst"
	"expenses/types"
)

type SaveDetailStruct struct {
	Category    string         `json:"category"`
	PaymentType int            `json:"payment_type"`
	Price       uint64         `json:"price"`
	Date        types.JsonTime `json:"date"`
}

/**
 * カテゴリー一覧取得ハンドラ
 */
func GetCategories(w http.ResponseWriter, r *http.Request, userId int) {
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

/**
 * ユーザー家計簿一覧取得ハンドラ
 */
func GetUserExpenses(w http.ResponseWriter, r *http.Request, userId int) {
	var statusCode = http.StatusOK
	userExpenses, err := models.GetUserUserExpensesByID(userId)
	if err != nil {
		log.Println("[GetUserExpenses/Error] something error occured when get user expenses from db", err)
		AnswerSomethingError(w, "[Error] something error occured when get user expenses from db", http.StatusInternalServerError, true)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(statusCode)
	err = json.NewEncoder(w).Encode(userExpenses)
	if err != nil {
		panic(err)
	}
}

/**
 * 家計簿詳細保存ハンドラ
 */
func PostSaveDetail(w http.ResponseWriter, r *http.Request, userId int) {
	var saveDetailStruct SaveDetailStruct
	var statusCode = http.StatusOK
	var status types.Status

	err := json.NewDecoder(r.Body).Decode(&saveDetailStruct)
	defer r.Body.Close()

	if err != nil {
		log.Println("[PostSaveDetail/Error] during parsing requestData", err)
		AnswerSomethingError(w, "[Error] during parsing requestData", http.StatusBadRequest, true)
		return
	}

	err = models.CreateUserExpenses(userId, saveDetailStruct.Category, saveDetailStruct.PaymentType, saveDetailStruct.Price, saveDetailStruct.Date)
	if err != nil {
		log.Println("[PostSaveDetail/Error] fail create new user expenses")
		AnswerSomethingError(w, "[Error] fail create new user expenses", http.StatusInternalServerError, true)
		panic(err)
	}

	w.WriteHeader(statusCode)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	status = types.Status {
		StatusCode: statusCode,
		Message: "Post expenses detail success",
		Token: "",
	}
	err = json.NewEncoder(w).Encode(status)
	if err != nil {
		panic(err)
	}
}

/**
 * 退会処理ハンドラ
 */
func Leave(w http.ResponseWriter, r *http.Request, userId int) {
	var status types.Status
	var statusCode = http.StatusOK

	err := models.LeaveUpdateUser(userId)
	if err != nil {
		log.Println("[Leave/Error] fail delete update user")
		AnswerSomethingError(w, "[Error] fail delete update user", http.StatusInternalServerError, true)
		panic(err)
	}

	w.WriteHeader(statusCode)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	status = types.Status {
		StatusCode: statusCode,
		Message: "Leave Update success",
		Token: "",
	}
	err = json.NewEncoder(w).Encode(status)
	if err != nil {
		panic(err)
	}
}
