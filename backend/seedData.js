import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Group from './src/models/Group.js';
import Expense from './src/models/Expense.js';
import Settlement from './src/models/Settlement.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/splitsmart');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Fetching users...');
    let mainUser = await User.findOne();
    
    if (!mainUser) {
      console.log('No user found. Creating a default user: user@example.com / password123');
      mainUser = await User.create({
        name: 'Main User',
        email: 'user@example.com',
        password: 'password123'
      });
    }

    console.log(`Using user: ${mainUser.name} (${mainUser.email}) as the primary user.`);

    // Clear existing dummy data (optional, but let's just add new data for now to not break their existing setup, or maybe we clear it if requested? Let's just create new groups so it's fresh)
    
    // Create Dummy Users
    console.log('Creating dummy friends...');
    const friendsData = [
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123' },
      { name: 'Sneha Patel', email: 'sneha@example.com', password: 'password123' },
      { name: 'Amit Kumar', email: 'amit@example.com', password: 'password123' },
      { name: 'Priya Singh', email: 'priya@example.com', password: 'password123' },
      { name: 'Alex Johnson', email: 'alex@example.com', password: 'password123' }
    ];
    
    const friends = [];
    for (const data of friendsData) {
      let friend = await User.findOne({ email: data.email });
      if (!friend) {
        friend = await User.create(data);
      }
      friends.push(friend);
    }

    // Create Groups
    console.log('Creating dummy groups...');
    const group1 = await Group.create({
      name: 'Goa Trip 🏖️',
      description: 'Expenses for our amazing Goa trip',
      members: [mainUser._id, friends[0]._id, friends[1]._id, friends[2]._id],
      createdBy: mainUser._id
    });

    const group2 = await Group.create({
      name: 'Apartment 🏠',
      description: 'Monthly rent and groceries',
      members: [mainUser._id, friends[3]._id, friends[4]._id],
      createdBy: mainUser._id
    });

    const group3 = await Group.create({
      name: 'Weekend Party 🎉',
      description: 'Saturday night out',
      members: [mainUser._id, friends[0]._id, friends[3]._id],
      createdBy: friends[0]._id
    });

    // Add Expenses for Goa Trip
    console.log('Adding expenses...');
    const amount1 = 12000;
    await Expense.create({
      groupId: group1._id,
      title: 'Flight Tickets',
      amount: amount1,
      paidBy: mainUser._id,
      splitType: 'equal',
      category: 'Travel',
      splits: [mainUser._id, friends[0]._id, friends[1]._id, friends[2]._id].map(id => ({ user: id, amount: amount1 / 4 }))
    });

    const amount2 = 8000;
    await Expense.create({
      groupId: group1._id,
      title: 'Hotel Booking',
      amount: amount2,
      paidBy: friends[0]._id,
      splitType: 'equal',
      category: 'Rent',
      splits: [mainUser._id, friends[0]._id, friends[1]._id, friends[2]._id].map(id => ({ user: id, amount: amount2 / 4 }))
    });

    const amount3 = 3500;
    await Expense.create({
      groupId: group1._id,
      title: 'Seafood Dinner',
      amount: amount3,
      paidBy: friends[1]._id,
      splitType: 'equal',
      category: 'Food',
      splits: [mainUser._id, friends[0]._id, friends[1]._id, friends[2]._id].map(id => ({ user: id, amount: amount3 / 4 }))
    });

    // Add Expenses for Apartment
    const amount4 = 25000;
    await Expense.create({
      groupId: group2._id,
      title: 'Monthly Rent',
      amount: amount4,
      paidBy: friends[3]._id,
      splitType: 'equal',
      category: 'Rent',
      splits: [mainUser._id, friends[3]._id, friends[4]._id].map(id => ({ user: id, amount: amount4 / 3 }))
    });

    const amount5 = 4500;
    await Expense.create({
      groupId: group2._id,
      title: 'Groceries',
      amount: amount5,
      paidBy: mainUser._id,
      splitType: 'equal',
      category: 'Shopping',
      splits: [mainUser._id, friends[3]._id, friends[4]._id].map(id => ({ user: id, amount: amount5 / 3 }))
    });
    
    const amount6 = 1200;
    await Expense.create({
      groupId: group2._id,
      title: 'Electricity Bill',
      amount: amount6,
      paidBy: friends[4]._id,
      splitType: 'equal',
      category: 'Utilities',
      splits: [mainUser._id, friends[3]._id, friends[4]._id].map(id => ({ user: id, amount: amount6 / 3 }))
    });

    // Add Expenses for Weekend Party
    const amount7 = 5500;
    await Expense.create({
      groupId: group3._id,
      title: 'Club Entry & Drinks',
      amount: amount7,
      paidBy: friends[0]._id,
      splitType: 'equal',
      category: 'Entertainment',
      splits: [mainUser._id, friends[0]._id, friends[3]._id].map(id => ({ user: id, amount: amount7 / 3 }))
    });

    const amount8 = 800;
    await Expense.create({
      groupId: group3._id,
      title: 'Uber home',
      amount: amount8,
      paidBy: mainUser._id,
      splitType: 'equal',
      category: 'Travel',
      splits: [mainUser._id, friends[0]._id, friends[3]._id].map(id => ({ user: id, amount: amount8 / 3 }))
    });

    // Add Settlements
    console.log('Adding settlements...');
    
    // Main user settles with friend 0 in Goa group
    await Settlement.create({
      fromUser: mainUser._id,
      toUser: friends[0]._id,
      groupId: group1._id,
      amount: 1500,
      status: 'completed'
    });

    // Friend 1 settles with main user in Goa group
    await Settlement.create({
      fromUser: friends[1]._id,
      toUser: mainUser._id,
      groupId: group1._id,
      amount: 2000,
      status: 'completed'
    });

    // Friend 3 settles with friend 4 in Apartment group
    await Settlement.create({
      fromUser: friends[3]._id,
      toUser: friends[4]._id,
      groupId: group2._id,
      amount: 500,
      status: 'completed'
    });

    // Main user settles with friend 3 in Apartment group
    await Settlement.create({
      fromUser: mainUser._id,
      toUser: friends[3]._id,
      groupId: group2._id,
      amount: 3000,
      status: 'completed'
    });

    console.log('Data successfully seeded! 🎉');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

seedData();
