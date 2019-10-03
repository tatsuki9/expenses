package mst

import (
	"expenses/models/base"
)

type MstCategories struct {
	ID           int    `db:"id"`
	CategoryName string `db:"category_name"`
}

/**
 * ユーザーカテゴリー一覧取得
 */
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
