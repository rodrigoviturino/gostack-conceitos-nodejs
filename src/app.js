const express = require("express");
const cors = require("cors");
const uuid = require("uuid");

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json({repositories});
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repos = {
    id: uuid.v4(),
    title,
    url,
    techs,
    likes : 0
  };

  repositories.push(repos);

  return response.status(201).json({repos});
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const idRepository = repositories.findIndex((repository) => repository.id === id);

  if(idRepository === -1){
    return response.status(400).json({
      message: "Repository not exists!"
    });
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[idRepository].likes
  };

  repositories[idRepository] = repository;

  return response.status(200).json({repository});

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex((repository) => repository.id === id);
  if(indexRepository === -1){
    return response.status(400).json({
      message: "Repository not exists!"
    })
  }

  const removeRepository = repositories.splice(indexRepository,1);

  return response.json(removeRepository);
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
  console.log(indexRepository)

  return response.json(repositories[indexRepository]);
});

module.exports = app;
