const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  if(!title || !url || (techs && !techs.length)) {
    return response.status(400).json({error: 'Missing information'})
  }

  if(!url.includes("github.com")){
    return response.status(400).json({error: 'invalid URL'})
  }

  if(!techs.length){
    return response.status(400).json({error: 'You must have to pass at least one language'})
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params

  const { title, url, techs } = request.body

  if(url && !url.includes("github.com")){
    return response.status(400).json({error: 'invalid URL'})
  }

  if(!repositories.length) {
    return response.status(404).json({error: 'No repository found'})
  }
  
  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  const oldRepo = repositories[repoIndex]
  
  const newRepo = {
    id,
    title: title || oldRepo.title,
    url: url || oldRepo.url,
    techs: techs || oldRepo.techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = newRepo

  return response.json(newRepo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  
  if(repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories[repoIndex].likes++

  return response.json(repositories[repoIndex])
});

module.exports = app;
