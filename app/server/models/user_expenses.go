package models

import (
	"expenses/models/base"
	"expenses/types"
)

type UserExpenses struct {
	ID           int            `db:"id"`
	UserId       int            `db:"user_id"`
	CategoryName string         `db:"category_name"`
	PaymentType  uint           `db:"payment_type"`
	Price        uint64         `db:"price"`
	RegisterDate types.JsonTime `db:"register_date"`
}

/**
 * ユーザー家計簿作成
 */
func CreateUserExpenses(userId int, categoryName string, paymentType int, price uint64, registerDate types.JsonTime) error {
	sql := `INSERT INTO user_expenses(user_id, category_name, payment_type, price, register_date) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE price = price + VALUES(price)`

	err := base.SingleQuery(sql, userId, categoryName, paymentType, price, registerDate.Format("2006-01-02"))
	return err
}

/**
 * ユーザー家計簿取得
 */
func GetUserUserExpensesByID(userId int) ([]UserExpenses, error) {
	var userExpenses []UserExpenses
	sql := `SELECT * FROM user_expenses WHERE user_id = ?`
	rows := base.GetInstance().Query(sql, userId)
	defer rows.Close()

	for rows.Next() {
		var userExpensesOne UserExpenses
		err := rows.Scan(&userExpensesOne.ID, &userExpensesOne.UserId, &userExpensesOne.CategoryName, &userExpensesOne.PaymentType, &userExpensesOne.Price, &userExpensesOne.RegisterDate)
		if err != nil {
			return nil, err
		}
		userExpenses = append(userExpenses, userExpensesOne)
	}

	return userExpenses, nil
}
