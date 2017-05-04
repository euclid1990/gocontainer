package controllers

import (
	"../services"
	"encoding/json"
	"net/http"
)

func DockerStats(w http.ResponseWriter, r *http.Request) {
	DockerEngine = NewEngine()
	containers, err := services.DockerRunStats(DockerEngine.cli, DockerEngine.ctx)
	if err != nil {
		panic(err)
	}
	js, err := json.MarshalIndent(containers, "", " ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
