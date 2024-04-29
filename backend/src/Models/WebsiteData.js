const { Schema, model } = require("mongoose");

const webDataSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    textData: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const webDataModel = model("WebData", webDataSchema);

module.exports = { webDataModel };
