const express = require("express");
const cors = require("cors");
const uuid = require("uuid");

const { v4: uuidv4, validate: isUuid } = require('uuid');
// const { v4: uuidv4 } = require('uuid');


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repos = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes : 0
  };

  repositories.push(repos);

  return response.json(repos);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const indexRepository = repositories.findIndex((repository) => repository.id === id);

  if(indexRepository === -1){
    return response.status(400).json({
      message: "Repository not exists!"
    });
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexRepository].likes
  };

  repositories[indexRepository] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex((repository) => repository.id === id);
  if(indexRepository >= 0){
    repositories.splice(indexRepository,1);
  } else {
    return response.status(400).json({
      error: "Repository not exists!"
    })
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const indexRepository = repositories.findIndex((repository) => repository.id === id)
  if(indexRepository === -1){
    return response.status(400).json({
      message: "Repository not found!"
    });
  }

  repositories[indexRepository].likes += 1;

  return response.status(201).json(repositories[indexRepository]);
});

module.exports = app;
