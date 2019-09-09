const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();
server.use(express.json());

server.route('/')
  .get((req, res) => {
    db('accounts')
      .then(r => {
        console.log(r);
        if(r.length) res.status(200).json(r);
        else res.status(404).json({ error: 'Could not get accounts' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Accounts could not be retrieved' });
      });
  })
  .post((req, res) => {
    let account = req.body;
    if(!account.name || !account.budget) res.status(400).json({ error: 'name and budget are required fields' });
    else db('accounts').insert(account)
      .then(r => {
        console.log(r);
        if(r.length) res.status(201).json({ id: r[0] });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'The account could not be added' });
      });
  });

server.route('/:id')
  .get((req, res) => {
    let id = req.params.id;
    db('accounts').where({ id: id })
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(400).json({ error: 'Could not retrieve the requested account' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'The request could not be completed' });
      });
  })
  .put((req, res) => {
    let id = req.params.id;
    let update = req.body;
    if(!update.name || !update.budget) res.status(400).json({ error: 'You must include both name and budget' });
    else db('accounts').where({ id: id }).update(update)
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(400).json({ error: 'The account could not be updated' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'The request could not be completed' });
      });
  })
  .delete((req, res) => {
    let id = req.params.id;
    db('accounts').where({ id: id }).del()
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(400).json({ error: 'The account could not be deleted' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'The request could not be completed' });
      });
  });


module.exports = server;