package types

type Status struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
	Token      string `json:"token"`
}
