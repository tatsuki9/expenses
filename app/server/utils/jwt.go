package utils

import (
	"os"
	"time"
	"github.com/dgrijalva/jwt-go"
)

type TokenClaims struct {
	ID       int
	jwt.StandardClaims
}

var mySigningKey = []byte(os.Getenv("JWT_SECRET_KEY"))

func GetToken(id int) (string, error) {

	claims := TokenClaims{
		id,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 5).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(mySigningKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ValidateToken(receiveToken string) (bool, int) {
	token, err := jwt.ParseWithClaims(receiveToken, &TokenClaims{}, func(token *jwt.Token) (interface{}, error){
		return []byte(mySigningKey), nil
	})

	if err != nil {
		return false, -1
	}
	claims := token.Claims.(*TokenClaims)
	return token.Valid, claims.ID
}
