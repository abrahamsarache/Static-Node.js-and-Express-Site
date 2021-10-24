const express = require('express');
const app = express();

//Pug Setup
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

//Requiring "data.json" to import my projects to pug files
const data = require('./data.json');

const myProjects = data.projects;
const myName ="Abraham Sarache";

//An "index" route (/) to render the "Home" page with the locals set to data.projects
app.get('/', (req, res)=>{
    res.render('../views/index', {myName, myProjects})
});

//An "about" route (/about) to render the "About" page
app.get('/about', (req, res)=>{
    res.render('../views/about',{myName});  
});

//"project" routes
app.get('/project/:id', (req, res, next)=>{
  if(req.params.id <= myProjects.length){
      let number = req.params.id - 1;
      let {project_name, description, technologies, image_urls, live_link, github_link} = data.projects[number];
      res.render('../views/project.pug', {project_name, description, technologies, image_urls, live_link, github_link, myName, myProjects});
  }else{
    const err = new Error('Internal Server Problem');
    err.status = 500;
    return next(err);
  }
});

//404 error handler
app.use((req, res, next) =>{
  const err = new Error('This page does not exist');
   err.status = 404;
   next(err);
});

//Global error handler
app.use((err, req, res, next)=> {
  res.locals.error = err;
  res.status(err.status);
  console.error(`${err.message} ${err.status}`);
   if(err.status === 404){
    res.render('../views/404.pug', {err});
   } else {
    err.status = 500;
    res.render('../views/error.pug', {err});
   }
});

app.listen(3000, console.log("the app is listening to the port 3000"));