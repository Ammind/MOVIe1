const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Film = require('./models/film');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://Ammind:Admin@cluster0.ujeinhi.mongodb.net/film-site?retryWrites=true&w=majority'

mongoose
    .connect(db)
    .then((res) => console.log('connected to DB'))
    .catch((error) => console.log(error));

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.static('ejs-views'));

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: false}));

app.use((req, res, next) =>{
    console.log(`path: ${req.path}`);
    console.log(`method: ${req.method}`);
    next();
});

app.get('/films', (req, res) => {
    const title = 'Home';
    Film
    .find()
    .sort({ _id: -1 })
    .then((films) => res.render(createPath('index'), {title, films}))
    .catch((error) =>{
        console.log(error);
        res.render(createPath('error'), {Name: 'Error'});
    });
    // const films = [
    //     {
    //     "_id": "636a4e1c5224eda75b82b005",
    //     "Name": "Побег из Шоушенка",
    //     "ReleaseYear": "1994-09-01T00:00:00.000Z",
    //     "Genre": [
    //         "Драмы",
    //         "Криминал"
    //     ],
    //     "Country": "США",
    //     "Age": "16+",
    //     "Description": "В основу культовой драмы легла повесть Стивена Кинга «Рита Хейуорт из Шоушенка». Действие фильма разворачивается в конце 50-х годов прошлого столетия. Молодого финансиста Энди Дюфрейна за двойное убийство приговаривают к пожизненному заключению, но он категорически отрицает свою причастность к преступлению. Свой срок Энди отправляется отбывать в одну из известнейших тюрем – Шоушенк, из которой еще никому не удавалось сбежать. В тюрьме парень сталкивается с суровыми реалиями тюремного мира, мира, где нет места состраданию, а вокруг только жестокость. Энди неоднократно становится жертвой сексуальных домогательств, но он сопротивляется до последнего. В скором времени тюремная жизнь Дюфрейна немного налаживается, и он даже находит себе друга, которым становится чернокожий заключенный Рэд...",
    //     "Image": "https://rezka.la/uploads/mini/full/1a/1638474572_610x900_162.webp",
    //     "URL": "",
    // }];
    
    // res.render(createPath('index'), {title, films});
});

app.get('/films:_id', (req, res) => {
    const title = 'Film';
    Film
    .findById(req.params._id)
    .then((film) => res.render(createPath('films'), {title, film}))
    .catch((error) =>{
        console.log(error);
        res.render(createPath('error'), {Name: 'Error'});
    });

    // const film = {
    //     "_id": "636a4e1c5224eda75b82b005",
    //     "Name": "Побег из Шоушенка",
    //     "ReleaseYear": "1994-09-01T00:00:00.000Z",
    //     "Genre": [
    //         "Драмы",
    //         "Криминал"
    //     ],
    //     "Country": "США",
    //     "Age": "16+",
    //     "Description": "В основу культовой драмы легла повесть Стивена Кинга «Рита Хейуорт из Шоушенка». Действие фильма разворачивается в конце 50-х годов прошлого столетия. Молодого финансиста Энди Дюфрейна за двойное убийство приговаривают к пожизненному заключению, но он категорически отрицает свою причастность к преступлению. Свой срок Энди отправляется отбывать в одну из известнейших тюрем – Шоушенк, из которой еще никому не удавалось сбежать. В тюрьме парень сталкивается с суровыми реалиями тюремного мира, мира, где нет места состраданию, а вокруг только жестокость. Энди неоднократно становится жертвой сексуальных домогательств, но он сопротивляется до последнего. В скором времени тюремная жизнь Дюфрейна немного налаживается, и он даже находит себе друга, которым становится чернокожий заключенный Рэд...",
    //     "Image": "https://rezka.la/uploads/mini/full/1a/1638474572_610x900_162.webp",
    //     "URL": "",
    // };
    // res.render(createPath('films'), { title, film });
});

app.get('/edit:_id', (req, res) => {
    const title = 'Edit Film';
    Film
    .findById(req.params._id)
    .then(film => res.render(createPath('edit_film'), {title, film}))
    .catch((error) =>{
        console.log(error);
        res.render(createPath('error'), {Name: 'Error'});
    });
});

app.put('/edit:_id', (req, res) => {
    const { Name, ReleaseYear, Genre, Country, Age, Description, Image } = req.body;
    const { _id } = req.params;
  
    Film
      .findByIdAndUpdate(_id, { Name, ReleaseYear, Genre, Country, Age, Description, Image })
      .then(updatedFilm => res.redirect(`/films${_id}`))
      .catch(error => {
        console.log(error);
        res.render(createPath('error'), { Name: 'Error' });
      });
  });

app.delete('/films:_id', (req, res) => {
    const title = 'Film';
    Film
    .findByIdAndDelete(req.params._id)
    .then(result => {
        res.sendStatus(200);
    })
    .catch((error) =>{
        console.log(error);
        res.render(createPath('error'), {Name: 'Error'});
    });
});

app.post('/add_film', (req, res) => {
    const {Name, Age, Genre,ReleaseYear,Country, Description, Image} = req.body;
    const film = new Film({Name, Age, Genre,ReleaseYear,Country, Description, Image});
    film
    .save()
    .then((result) => res.redirect("/films"))
    .catch((error) =>{
        console.log(error)
        res.render(createPath('error'), {Name: 'Error'});
    })

    // const film = {
    //     Name, 
    //     Age, 
    //     Genre,
    //     ReleaseYear,
    //     Country,
    //     Description,
    //     Image
    // }
    // res.render(createPath('films'), { film });
});

app.get('/add_film', (req, res) => {
    res.render(createPath('add_film'), { });
});

app.use((req, res) =>{
    res
    .status(404)
    res.render(createPath('error'));
});















