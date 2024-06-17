const router = require("express").Router();

const Institute = require("../../shared/models/institute.model");

//Administrator routes

router.route("/create").post(async (req, res) => {
  try {
    const { name, address, contact } = req.body;

    const newInstitute = new Institute({
      name,
      address,
      contact,
    });

    const savedInstitute = await newInstitute.save();

    res.status(201).json({ message: "Institute created successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Some thing went wrong." });
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;
    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const deletedInstitute = await Institute.findByIdAndDelete({ _id: id });

    if (!deletedInstitute) {
      return res.status(404).json({ message: "Institute not found." });
    }

    res.status(200).json({ message: "Institute deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

//student routes

router.route("/all").get(async (req, res) => {
  try {
    const allInstitutes = await Institute.find({}, "name");

    if (!allInstitutes || allInstitutes.length === 0) {
      return res.status(404).json({ message: "No institutes found." });
    }

    const institutes = allInstitutes.map((institute) => institute.name);

    res.status(200).json({ institutes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to retrieve institutes." });
  }
});

module.exports = router;
