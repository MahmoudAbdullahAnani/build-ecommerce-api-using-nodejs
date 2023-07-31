const { default: mongoose } = require("mongoose");

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: [true, "This Name is Alrude Exist"],
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        categori: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categorie",
            required: true,
        },
    },
  { timestamps: true }
);

const SubCategoryMudels = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategoryMudels;