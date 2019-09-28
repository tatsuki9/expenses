package mst

import (
	"expenses/models/base"
)

type MstCategories struct {
	ID           int    `db:"id"`
	CategoryName string `db:"category_name"`
}

func GetAllMstCategory() ([]MstCategories, error) {
	var mstCategories []MstCategories
	sql  := `SELECT * FROM mst_categories`
	rows := base.GetInstance().Query(sql)
	defer rows.Close()

	for rows.Next() {
		var mstCategory MstCategories
		err := rows.Scan(&mstCategory.ID, &mstCategory.CategoryName)
		if err != nil {
			return nil, err
		}
		mstCategories = append(mstCategories, mstCategory)
	}
	return mstCategories, nil
}

func GetMstCategoryByID(id int) (*MstCategories, error) {
	var mstCategory MstCategories
	sql  := `SELECT * FROM mst_categories WHERE id = ?`
	rows := base.GetInstance().Query(sql, id)
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&mstCategory.ID, &mstCategory.CategoryName)
		if err != nil {
			return nil, err
		}
	}

	return &mstCategory, nil
}
