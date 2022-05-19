const express = require("express");

const { v4: uuid, validate: validadeUuuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function validateId(req, res, next) {
  const { id } = req.params;
  if (!validadeUuuid(id)) {
    return res.status(404).json({ error: "Invalid uuid" });
  }

  return next();
}

function validateRepository(req, res, next) {
  const { id } = req.params;
  
  const repo = repositories.find(r => r.id === id);


  if (!repo) { return res.status(404).json({ error: "Repository not found" }); }

  req.repo = repo

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateId, validateRepository, (request, response) => {
  const requestData = request.body;
  const { repo } = request;

  Object.keys(requestData).forEach(key => {
    if (key != 'likes') {
      repo[key] = requestData[key];
    }
  });

  return response.json(repo);
});

app.delete("/repositories/:id", validateId, validateRepository, (request, response) => {
  const { repo } = request;

  repositories.splice(repo, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, validateRepository, (request, response) => {
  const { repo } = request;
  
  ++repo.likes;

  return response.json({ likes: repo.likes });
});

module.exports = app;
