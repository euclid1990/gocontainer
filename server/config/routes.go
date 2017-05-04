package config

import (
	"../controllers"
	"../socket"
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"os"
	"path"
	"runtime"
	"strings"
)

type Route struct {
	name        string
	method      string
	pattern     string
	handlerFunc http.HandlerFunc
}

type Routes []Route

type Prefix struct {
	name    string
	pattern string
	dir     string
}

type Prefixs []Prefix

type Action struct {
	Path string `json:"path"`
}

var (
	routes = Routes{
		Route{
			"index",
			"GET",
			"/",
			Index,
		},
		// Docker Router
		Route{
			"docker.stats",
			"GET",
			"/dockers/stats",
			controllers.DockerStats,
		},
		// Container Router
		Route{
			"container.index",
			"GET",
			"/containers",
			controllers.ContainerIndex,
		},
		Route{
			"container.show",
			"GET",
			"/containers/{container_id}",
			controllers.ContainerShow,
		},
	}
	prefixs = Prefixs{
		Prefix{
			"static",
			"/static/",
			"./../client/build/static/",
		},
	}
	apiFilePath string
)

func NewRouter(so *socket.Socket) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	routes = append(routes, Route{
		"websocket",
		"",
		"/ws",
		so.ServeWs,
	})
	for _, route := range routes {
		if route.name != "" {
			router.
				Methods(route.method).
				Path(route.pattern).
				Name(route.name).
				Handler(route.handlerFunc)
		} else {
			router.
				Path(route.pattern).
				Name(route.name).
				Handler(route.handlerFunc)
		}
	}
	for _, prefix := range prefixs {
		router.
			PathPrefix(prefix.pattern).
			Name(prefix.name).
			Handler(http.StripPrefix(prefix.pattern, http.FileServer(http.Dir(prefix.dir))))

	}
	return router
}

func ListingRoutes(r *mux.Router) {
	routeList := make(map[string]interface{})
	r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		n := route.GetName()
		p, _ := route.GetPathTemplate()
		// Split controller & action
		s := strings.Split(n, ".")
		if len(s) < 2 {
			routeList[n] = p
		} else {
			existRoute, ok := routeList[s[0]]
			if ok {
				// Type assertion to access f's underlying map[string]Action
				existRoute.(map[string]Action)[s[1]] = Action{p}
			} else {
				r := make(map[string]Action)
				r[s[1]] = Action{p}
				routeList[s[0]] = r
			}
		}
		log.Println(n, p)
		return nil
	})
	routeJson, _ := json.MarshalIndent(routeList, "", "    ")
	writeApiFile(routeJson)
}

func writeApiFile(content []byte) {
	_, filename, _, _ := runtime.Caller(1)
	apiFilePath = path.Dir(filename) + "/./../../client/src/components/App/Api.json"
	if _, err := os.Stat(apiFilePath); err == nil {
		return
	}
	f, err := os.Create(apiFilePath)
	defer f.Close()
	if err != nil {
		panic(err)
	}
	f.Write(content)
	f.Sync()
}

func Index(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL.Path[:])
	http.ServeFile(w, r, "./../client/build/")
}
