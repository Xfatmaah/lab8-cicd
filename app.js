const express = require('express');
const os = require('os');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;


const url = process.env.DATABASE_URL || 'mongodb://db:27017';
const client = new MongoClient(url);
const dbName = 'todoDB';


app.get('/', (req, res) => {
  res.json({
    app:  'CISC 886 Lab 8',
    mode: process.env.MODE || 'local',
    host: os.hostname(),
    database: 'MongoDB Status: Connected'
  });
});


app.get('/tasks', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('tasks');
    const tasks = await collection.find({}).toArray();
    
    
    const grouped = tasks.reduce((acc, task) => {
      (acc[task.status] = acc[task.status] || []).push(task);
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: "Database Error: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT} - Waiting for MongoDB requests...`);
});