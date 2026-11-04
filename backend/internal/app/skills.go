package app

import (
	"time"
)

type User struct {
	Id        int64
	Email     string
	Password  string
	CreatedAt time.Time
}
