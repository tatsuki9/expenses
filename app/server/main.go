package main

import (
	"log"
	"net/http"
	//"expenses/models"
	//"net/http"
	"github.com/joho/godotenv"
	"github.com/gorilla/mux"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	//models.GetInstance()
	r := mux.NewRouter()
	r.Use(CORSMiddleware)
	r.HandleFunc("/signup", SignUp).Methods("POST")
	r.HandleFunc("/login", Login).Methods("POST")
	r.HandleFunc("/api/save_detail", RequireAuth(PostSaveDetail)).Methods("POST")

	r.HandleFunc("/api/categories", RequireAuth(GetCategories)).Methods("GET")
	r.HandleFunc("/api/user_expenses", RequireAuth(GetUserExpenses)).Methods("GET")


	// Handle all preflight request
	r.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		settingHeader(w)
		w.WriteHeader(http.StatusNoContent)
		return
	})

	http.Handle("/", r)
	log.Println("Webサーバーを開始。PORT: 3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

// クロスオリジン対応用のミドルウェア
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
		settingHeader(w)
		next.ServeHTTP(w, r)
	})
}

func settingHeader(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, GET, POST, OPTIONS, PUT")
}
