package conf

import (
	"time"

	"github.com/jessevdk/go-assets"
)

var _Assets79eb86c8a1f905f8d49c6aae9f490fdc0969e012 = ""
var _Assets1577f1c4a02b9a085a22b28d01d0a4e0b493b7a7 = "driver: mysql\ndev:\n  user: root\n  password: root\n  host: db\n  db: expenses\nproduction:\n  user: root\n  password: root\n  host: db\n  db: expenses\n"

// Assets returns go-assets FileSystem
var Assets = assets.NewFileSystem(map[string][]string{"/": []string{"conf"}, "/conf": []string{"db.go", "db.yml"}}, map[string]*assets.File{
	"/": &assets.File{
		Path:     "/",
		FileMode: 0x800001ed,
		Mtime:    time.Unix(1570296840, 1570296840000000000),
		Data:     nil,
	}, "/conf": &assets.File{
		Path:     "/conf",
		FileMode: 0x800001ed,
		Mtime:    time.Unix(1570297137, 1570297137000000000),
		Data:     nil,
	}, "/conf/db.go": &assets.File{
		Path:     "/conf/db.go",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1570297137, 1570297137000000000),
		Data:     []byte(_Assets79eb86c8a1f905f8d49c6aae9f490fdc0969e012),
	}, "/conf/db.yml": &assets.File{
		Path:     "/conf/db.yml",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1570296318, 1570296318000000000),
		Data:     []byte(_Assets1577f1c4a02b9a085a22b28d01d0a4e0b493b7a7),
	}}, "")
