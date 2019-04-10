const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const uri = process.env.DB_HOST;

const options = {
  useNewUrlParser: true,
  reconnectTries: 10, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

mongoose.set('useCreateIndex', true);
mongoose.connect(uri, options);

const pollsRoutes = require('./routes/polls');
const usersRoutes = require('./routes/users');
const participantsRoutes = require('./routes/participants');


// Api sunucusu ile uygulama sunucunun farklı olması
// sebebiyle gerçekleşen 'cors 'hatalarını düzeltmek için
// eklenmesi gereken middleware
app.use(cors({ credentials: true, origin: true }));
// Add headers


//  isteklere verilen cevap süresini gösteriyor
app.use(morgan('dev'));
app.disable('etag');
// json verilerinin daha kolay okunabilmesi gerekli olan kütüphane
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/polls', pollsRoutes);
app.use('/users', usersRoutes);
app.use('/participants', participantsRoutes);


// Route Kontrolü
app.use((req, res, next) => {
  const error = new Error('EndPoint bulunamadı: ' + req.url );
  error.status = 404;
  next(error);
});

// Diğer Hatalar
app.use((error, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
