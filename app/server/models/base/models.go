package base

import (
	"bytes"
	"database/sql"
	"io"
	"gopkg.in/yaml.v2"
	_ "github.com/go-sql-driver/mysql"
	"expenses/conf"
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

		f, err := conf.Assets.Open("/conf/db.yml")
		if err != nil {
			panic(err)
		}
		defer f.Close()

		by := new(bytes.Buffer)
		io.Copy(by, f)
		buf := by.Bytes()

		t := make(map[interface{}]interface{})
		_ = yaml.Unmarshal(buf, &t)

		conn := t[os.Getenv("APP_ENV")].(map[interface{}]interface{})
		dbinfo := conn["user"].(string) + ":" + conn["password"].(string) + "@tcp(" + conn["host"].(string) + ":3306)/" + conn["db"].(string) + "?parseTime=true"
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
