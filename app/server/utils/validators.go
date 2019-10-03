package utils

import "regexp"

/*
 * 入力メールアドレス検証
 */
func ValidateEmail(email string) bool {
	validEmail := regexp.MustCompile(`^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$`)
	return validEmail.MatchString(email)
}
