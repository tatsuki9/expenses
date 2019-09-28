package utils

import (
	"crypto/sha1"
	"fmt"
	"io"
)

// パスワード暗号化
func EncryptPassword(password string) string {
	h := sha1.New()
	io.WriteString(h, password)
	return fmt.Sprintf("%x", h.Sum(nil))
}
