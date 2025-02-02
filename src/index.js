const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');

const shortUrl = require('./route/shortUrlRoutes');
const analyticRoute = require('./route/analyticRoute');
const authRoutes = require('./route/auth'); // Updated path
const swaggerDocs = require('./config/swaggerConfig');

dotenv.config();
require('./config/passport')(passport);

const app = express();
const { PORT, MONGODB_STRING, SESSION_SECRET } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB is connected'))
  .catch((error) => console.log(error));

// Session setup with express-session
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/shorten', shortUrl);
app.use('/api/analytics', analyticRoute);

swaggerDocs(app);

app.listen(PORT, () => {
  console.log(`Express app is running on port ${PORT}`);
});
