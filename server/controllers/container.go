package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

func ContainerIndex(w http.ResponseWriter, r *http.Request) {
	containers := []map[string]string{{"id": "example"}}
	js, err := json.Marshal(containers)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func ContainerShow(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	containerId := params["container_id"]
	containers := map[string]string{"id": containerId}
	js, err := json.Marshal(containers)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
