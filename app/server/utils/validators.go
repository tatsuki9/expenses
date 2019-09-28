package utils

import (
	"regexp"
)

func ValidateEmail(email string) bool {
	validEmail := regexp.MustCompile(`^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$`)
	return validEmail.MatchString(email)
}
