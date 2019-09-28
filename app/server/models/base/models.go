package base

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"os"
	"sync"
)

type Database struct {
	db *sql.DB
}

var database Database
var once sync.Once
var err error

func GetInstance() *Database {

	once.Do(func(){
		dbinfo := os.Getenv("DATABASE_URL")
		if dbinfo == "" {
			log.Fatal("Error loading database info from env")
		}
		database.db, err = sql.Open("mysql", dbinfo)
		if err != nil {
			log.Println(err)
			return
		}
	})

	return &database
}

func (db Database) begin() (transaction *sql.Tx) {
	transaction, err := db.db.Begin()
	if err != nil {
		log.Println(err)
		return nil
	}
	return transaction
}

func (db Database) prepare(query string) (statement *sql.Stmt) {
	statement, err := db.db.Prepare(query)
	if err != nil {
		log.Println(err)
		return nil
	}
	return statement
}

func (db Database) Query(query string, arguments ...interface{}) (row *sql.Rows) {
	rows ,err := db.db.Query(query, arguments...)
	if err != nil {
		log.Println(err)
		return nil
	}
	return rows
}

func SingleQuery(sql string, args ...interface{}) error {
	SQL := database.prepare(sql)
	tx  := database.begin()
	_, err := tx.Stmt(SQL).Exec(args...)

	if err != nil {
		log.Println("singleQuery(exec): ", err)
		tx.Rollback()
	} else {
		err = tx.Commit()
		if err != nil {
			log.Println("singleQuery(commit): ", err)
			return err
		}
	}
	return err
}
