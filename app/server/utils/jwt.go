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

/**
 * JWTトークン取得
 */
func GetToken(id int) (string, int64, error) {

	expiresAt := time.Now().Add(time.Hour * 5).Unix()
	now := time.Now().Unix()
	remainAt := expiresAt - now

	claims := TokenClaims{
		id,
		jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(mySigningKey)
	if err != nil {
		return "", -1, err
	}
	return tokenString, remainAt, nil
}

/**
 * JWTトークン検証
 */
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
