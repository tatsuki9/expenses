package main

import (
	"encoding/json"
	"log"
	"net/http"
	"golang.org/x/crypto/bcrypt"
	"expenses/models"
	"expenses/types"
	"expenses/utils"
	"strings"
)

const  (
	BcryptCost = 10
)

type loginStruct struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type signUpStruct struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:password`
}

func GetCategories(w http.ResponseWriter, r *http.Request, id int) {
	log.Println("[GetCategories] start")
	log.Println("[GetCategories] user_id: ")
	log.Println(id)
}

func RequireAuth(handler func (w http.ResponseWriter, r *http.Request, id int)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request){
		//cookie, err := r.Cookie("session")
		//if err != nil {
		//	log.Println("[RequireAuth/Error] fail get cookie", err)
		//	AnswerSomethingError(w, "[Error] fail get cookie", http.StatusUnauthorized, true)
		//}
		var userId  = -1
		var isValid = false

		token := r.Header.Get("Authorization")
		if isValid, userId = utils.ValidateToken(strings.TrimPrefix(token, "Bearer ")); !isValid {
			AnswerSomethingError(w, "[Error] unauthrorized", http.StatusUnauthorized, true)
			return
		}
		handler(w, r, userId)
	}
}

func Login(w http.ResponseWriter, r *http.Request) {

	var loginData loginStruct
	var statusCode = http.StatusOK
	err := json.NewDecoder(r.Body).Decode(&loginData)
	defer r.Body.Close()

	if err != nil {
		log.Println("[Login/Error] during parsing userdata", err)
		AnswerSomethingError(w, "[Error] during parsing userdata", http.StatusBadRequest, true)
		return
	}

	user, err := models.GetUserByEmail(loginData.Email)
	if err != nil {
		log.Println("[Login/Error] something error occured when get user from db", err)
		AnswerSomethingError(w, "[Error] something error occured when get user from db", http.StatusInternalServerError, true)
		return
	}
	if user.ID <= 0 {
		log.Println("[Login/Error] not found user, request data: ", loginData)
		AnswerSomethingError(w, "[Error] not found user", STATUS_USER_NOT_FOUND, false)
		return
	}

	// パスワード検証
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password))
	if err != nil {
		log.Println("[Login/Error] authentication is fail", err)
		AnswerSomethingError(w, "[Error] authentication is fail", STATUS_AUTHNETICATION_FAILED, false)
		return
	}

	// セッション作成
	token, err := utils.GetToken(user.ID)

	//cookie := &http.Cookie{
	//	Name:  "session",
	//	Value: token,
	//	Path:  "/",
	//}
	//http.SetCookie(w, cookie)
	w.WriteHeader(statusCode)

	status := types.Status {
		StatusCode: statusCode,
		Message: "Login success",
		Token: token,
	}
	err = json.NewEncoder(w).Encode(status)
	if err != nil {
		panic(err)
	}
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	var userData signUpStruct
	err := json.NewDecoder(r.Body).Decode(&userData)
	defer r.Body.Close()

	if err != nil {
		log.Println("[SignUp/Error] during parsing userdata", err)
		AnswerSomethingError(w, "[Error] during parsing userdata", http.StatusBadRequest, true)
		return
	}

	var status types.Status
	var statusCode = http.StatusOK

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	// 既存ユーザーチェック
	if !checkUniqueUser(userData.Email) {
		log.Println("[SignUp/Error] User is not unique Because request email is duplicate.")
		AnswerSomethingError(w, "[Error] User with email already exists.", http.StatusBadRequest, true)
		return
	}

	// メールアドレス正当性チェック
	if !utils.ValidateEmail(userData.Email) {
		log.Println("[SignUp/Error] User email is not valid")
		AnswerSomethingError(w, "[Error] User email is not valid.", http.StatusBadRequest, true)
		return
	}

	// ユーザー新規作成
	if userData.Username != "" && userData.Email != "" && userData.Password != "" && err == nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userData.Password), BcryptCost)
		if err != nil {
			log.Println("[SignUp/Error] fail generate hashed password")
			AnswerSomethingError(w, "[Error] fail generate hashed password", http.StatusInternalServerError, true)
			panic(err)
		}
		//password := utils.EncryptPassword(userData.Password)
		err = models.CreateUser(userData.Username, userData.Email, string(hashedPassword))

		if err != nil {
			log.Println("[SignUp/Error] fail create new user")
			AnswerSomethingError(w, "[Error] fail create new user", http.StatusInternalServerError, true)
			panic(err)
		} else {
			// セッション保存
			//user, err := models.GetUserByEmail(userData.Email)
			//if err != nil {
			//	log.Println("[SignUp/Error] fail get new user created")
			//	AnswerSomethingError(w, "[Error] fail get new user created")
			//	panic(err)
			//}
			//session, err := sessions.Store.Get(r, "session")
			//if err != nil {
			//	session, err = sessions.Store.New(r, "session")
			//	if err != nil {
			//		log.Println("[SignUp/Error] fail create new session")
			//		AnswerSomethingError(w, "[Error] fail create new session")
			//		panic(err)
			//	}
			//}
			//session.Values["loggedin"] = "true"
			//session.Values["username"] = userData.Username
			//session.Values["user_id"]  = user.ID
			//session.Save(r, w)
			//token, err = utils.GetToken(user.ID)
			//if err != nil {
			//	log.Println("[SignUp/Error] fail get jwt token")
			//	AnswerSomethingError(w, "[Error] fail get jwt token")
			//	panic(err)
			//}
		}
	}

	w.WriteHeader(statusCode)

	status = types.Status {
		StatusCode: statusCode,
		Message: "Sign up success",
		Token: "",
	}
	err = json.NewEncoder(w).Encode(status)
	if err != nil {
		panic(err)
	}
}

func checkUniqueUser(email string) bool {
	user, err := models.GetUserByEmail(email)
	if err != nil {
		log.Fatal(err)
	}
	if user.ID > 0 {
		return false
	}
	return true
}

///**
// * 異常系エラー
// */
//func AnswerSomethingError(w http.ResponseWriter, message string) {
//	w.WriteHeader(http.StatusBadRequest)
//	status := types.Status{
//		StatusCode: http.StatusBadRequest,
//		Message: message,
//		Token: "",
//	}
//	err := json.NewEncoder(w).Encode(status)
//	if err != nil {
//		log.Println(err)
//	}
//}

/**
 * 正常系エラー
 */
func AnswerSomethingError(w http.ResponseWriter, message string, errno int, isWithHeader bool) {
	if isWithHeader {
		w.WriteHeader(errno)
	}
	status := types.Status{
		StatusCode: errno,
		Message: message,
		Token: "",
	}
	err := json.NewEncoder(w).Encode(status)
	if err != nil {
		log.Println(err)
	}
}
