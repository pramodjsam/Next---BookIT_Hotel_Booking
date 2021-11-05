const mongoose = require("mongoose");
const rooms = require("../data/rooms.json");
const Room = require("../models/room");

const dbUrl =
  "";

mongoose
  .connect(dbUrl)
  .then((conn) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const seedRooms = async () => {
  try {
    await Room.deleteMany();
    console.log("rooms are deleted");
    await Room.insertMany(rooms);
    console.log("all rooms are inserted");
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

seedRooms();
