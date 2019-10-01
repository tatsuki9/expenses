package types

/**
 * 共通で使う予定の型一覧です。
 */

import (
	"encoding/json"
	"strings"
	"time"
)

type Status struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
	Token      string `json:"token"`
}

type JsonTime struct {
	time.Time
}

const layout = "2006-01-02"
func (j *JsonTime) UnmarshalJSON(b []byte) (err error) {
	s := strings.Trim(string(b), "\"")
	if s == "null" {
		j.Time = time.Time{}
		return
	}
	j.Time, err = time.Parse(layout, s)
	return
}

func (rt JsonTime) MarshalJSON() ([]byte, error) {
	return json.Marshal(rt.Format(layout))
}

// Sql driver interface
func (rt *JsonTime) Scan(value interface{}) error {
	rt.Time = value.(time.Time)
	return nil
}
