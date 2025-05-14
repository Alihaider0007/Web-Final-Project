const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const cors = require('cors');
app.use(cors());
const TourPackage = require('./models/TourPackage');
const MyTour = require('./models/myTours');
const bodyParser = require('body-parser');



const User = require('./models/User');



const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // to parse form data

app.use(express.json());
app.use(express.static('public')); // serve HTML files from /public folder

//Database Connection Mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));


// Routes
app.get('/', (req, res) => {
  res.send('🏠 Welcome to the Tourist Website API');
});

//Authentication of user(Login Signup)
// SignUp route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create new user and save to the database
    const newUser = new User({ name, email, password: hash });
    await newUser.save();

    // Send success response
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error registering user' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Expecting email and password from the request body

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const valid = await bcrypt.compare(password, user.password);

    // Check if the password matches
    if (!valid) {
      return res.status(401).send({ message: 'Incorrect password' });
    }

    // If login is successful, send success message
    return res.send({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).send({ message: 'Login error' });
  }
});

// RESET password by Nodemailer
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Route to request password reset (send reset link)
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send('If an account exists with this email, you will receive a password reset link shortly.');
    }

    // Generate a JWT token (with expiry time)
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save token and expiry to the user in the database
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send email with the reset link (using Nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `http://localhost:${PORT}/update_password.html?token=${resetToken}`;
    
    await transporter.sendMail({
      from: `"Tourist App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Tourist Account Password',
      html: `
        <h2>Hello!</h2>
        <p>You requested to reset your password. Click the button below to continue:</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#333;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>– The Tourist App Team</p>
      `
    });


    res.status(200).send('Password reset link has been sent to your email (if the email is registered).');
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to reset password (update password)
app.post('/update-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find the user based on the decoded token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Ensure the token has not expired
    if (Date.now() > user.resetTokenExpiry) {
      return res.status(400).send('Reset token has expired');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = undefined; // Clear reset token
    user.resetTokenExpiry = undefined; // Clear reset token expiry
    await user.save();

    res.status(200).send('Password successfully updated');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  }
});

//EVENTS: Create API Routes
const Event = require('./models/Event');
//Create route to add event (for testing or admin):
app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event' });
  }
});
//Create route to get all events or search by city:
app.get('/api/events', async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { city: new RegExp(city, 'i') } : {};
    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});
//For My Events  ADD and Remove events
const MyEvent = require('./models/MyEvent');
//Add Event to MyEvents
app.post('/api/myEvents', async (req, res) => {
  try {
    const newEvent = new MyEvent(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save event' });
  }
});
//Get All MyEvents
app.get('/api/myEvents', async (req, res) => {
  try {
    const events = await MyEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch my events' });
  }
});
//Delete Event by ID
app.delete('/api/myEvents/:id', async (req, res) => {
  try {
    await MyEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

//tourPackages

const router = express.Router();
app.use('/', router);

router.get('/api/packages', async (req, res) => {
  try {
    const { destination, budget, duration } = req.query;

    const filter = {};

    // Filter by city
    if (destination) {
      filter.city = destination;
    }

    // Budget filtering
    if (budget === 'budget') {
      filter.price = { $lt: 1000 };
    } else if (budget === 'mid') {
      filter.price = { $gte: 1000, $lte: 3000 };
    } else if (budget === 'luxury') {
      filter.price = { $gt: 3000 };
    }

    // Duration filtering
    if (duration === 'short') {
      filter.duration = { $lte: 3 };
    } else if (duration === 'medium') {
      filter.duration = { $gte: 4, $lte: 7 };
    } else if (duration === 'long') {
      filter.duration = { $gte: 8 };
    }

    const packages = await TourPackage.find(filter);
    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
//TourPackage booking
// Route to get all booked tours
app.get('/api/myTours', async (req, res) => {
  try {
    const tours = await MyTour.find();
    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch booked tours' });
  }
});

// Route to add a new tour booking (from "Book Now")
('/api/bookings', async (req, res) => {
  try {
    const newTour = new MyTour(req.body);
    await newTour.save();
    res.status(201).json({ message: 'Tour booked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed' });
  }
});

//
app.post('/api/myTours', async (req, res) => {
    try {
        const tour = new MyTour(req.body);
        await tour.save();
        res.status(201).json(tour);
    } catch (error) {
        res.status(500).json({ error: 'Failed to book tour.' });
    }
});


// Route to delete a booking
app.delete('/api/myTours/:id', async (req, res) => {
  try {
    await MyTour.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});


//

// // API to get destination by name
// app.get('/api/destinations', (req, res) => {
//   const destinationName = req.query.name;
//   const filePath = path.join(__dirname, 'data', 'destinations.json');

//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading JSON file:', err);
//       app.postreturn res.status(500).json({ error: 'Failed to read data.' });
//     }

//     try {
//       const destinations = JSON.parse(data);
//       const destination = destinations.find(dest => dest.name.toLowerCase() === destinationName.toLowerCase());

//       if (!destination) {
//         return res.status(404).json({ error: 'Destination not found.' });
//       }

//       res.json(destination);
//     } catch (parseErr) {
//       console.error('Error parsing JSON:', parseErr);
//       res.status(500).json({ error: 'Invalid data format.' });
//     }
//   });
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
