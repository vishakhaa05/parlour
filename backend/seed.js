require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

const mockUsers = [
  { name: 'Aditi Sharma', email: 'aditi.s@example.com', joinDate: '2023-05-12', status: 'Active' },
  { name: 'Priya Patel', email: 'priya.p@example.com', joinDate: '2023-05-14', status: 'Active' },
  { name: 'Rahul Verma', email: 'rahul.v@example.com', joinDate: '2023-05-15', status: 'Inactive' },
  { name: 'Sneha Gupta', email: 'sneha.g@example.com', joinDate: '2023-05-18', status: 'Active' },
];

const mockAppointments = [
  { user: 'Aditi Sharma', service: 'Glowing Facial', date: '2023-05-20', time: '10:00 AM', amount: '₹2500', status: 'Confirmed' },
  { user: 'Priya Patel', service: 'Keratin Treatment', date: '2023-05-20', time: '12:30 PM', amount: '₹8000', status: 'Pending' },
  { user: 'Neha Singh', service: 'Aroma Massage', date: '2023-05-21', time: '04:00 PM', amount: '₹4000', status: 'Confirmed' },
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parlour').then(async () => {
  console.log('Connected to MongoDB for seeding');
  
  await User.deleteMany({});
  await Appointment.deleteMany({});
  
  await User.insertMany(mockUsers);
  await Appointment.insertMany(mockAppointments);
  
  console.log('Database seeded!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
