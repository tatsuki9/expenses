package models

import (
	"time"
	"expenses/models/base"
)

type User struct {
	ID       int       `db:"id"`
	Name     string    `db:"name"`
	Email    string    `db:"email"`
	Password string    `db:"password"`
	Created  time.Time `db:"created"`
}

func CreateUser(username string, email string, password string) error {
	sql := `INSERT INTO users(name, email, password, created) VALUES(?, ?, ?, NOW())`

	err := base.SingleQuery(sql, username, email, password)
	return err
}

func GetUserByEmail(email string) (*User, error) {
	var user User
	sql  := `SELECT * FROM users WHERE email = ?`
	rows := base.GetInstance().Query(sql, email)
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Created)
		if err != nil {
			return nil, err
		}
	}

	return &user, nil
}
