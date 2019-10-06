package main

import (
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	r := mux.NewRouter()
	r.Use(CORSMiddleware)
	r.HandleFunc("/signup", SignUp).Methods("POST")
	r.HandleFunc("/login", Login).Methods("POST")
	r.HandleFunc("/api/save_detail", RequireAuth(PostSaveDetail)).Methods("POST")

	r.HandleFunc("/api/categories", RequireAuth(GetCategories)).Methods("GET")
	r.HandleFunc("/api/user_expenses", RequireAuth(GetUserExpenses)).Methods("GET")
	r.HandleFunc("/api/leave", RequireAuth(Leave)).Methods("POST")

	// Handle all preflight request
	r.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		settingHeader(w)
		w.WriteHeader(http.StatusNoContent)
		return
	})

	http.Handle("/", r)
	log.Println("Webサーバーを開始。PORT: 8080")
	log.Fatal(http.ListenAndServe(":8080", handlers.LoggingHandler(os.Stdout, http.DefaultServeMux)))
}

// クロスオリジン対応用のミドルウェア
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
		settingHeader(w)
		next.ServeHTTP(w, r)
	})
}

func settingHeader(w http.ResponseWriter) {

	origin := "http://" + os.Getenv("ALLOW_ORIGIN")

	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, GET, POST, OPTIONS, PUT")
}
