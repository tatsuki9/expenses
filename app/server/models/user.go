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
	IsDelete int       `db:"is_delete"`
	Created  time.Time `db:"created"`
}

func CreateUser(username string, email string, password string) error {
	sql := `INSERT INTO users(name, email, password, is_delete, created) VALUES(?, ?, ?, 0, NOW())`

	err := base.SingleQuery(sql, username, email, password)
	return err
}

func GetUserByEmail(email string) (*User, error) {
	var user User
	sql  := `SELECT * FROM users WHERE email = ?`
	rows := base.GetInstance().Query(sql, email)
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.IsDelete, &user.Created)
		if err != nil {
			return nil, err
		}
	}

	return &user, nil
}

func LeaveUpdateUser(userId int) error {
	sql := `UPDATE users SET is_delete = 1 WHERE id = ?`

	err := base.SingleQuery(sql, userId)
	return err
}
