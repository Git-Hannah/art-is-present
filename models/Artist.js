const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const artistSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  name: {
    type: String,
    unique: true,
  },
  location: {
    city: String,
    country: String,
  },
  avatar: String,
  public: [String],
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
