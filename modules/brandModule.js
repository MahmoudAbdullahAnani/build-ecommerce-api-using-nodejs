const { default: mongoose } = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    slug: String,
    image: {
        type: String,
    }
}, { timestamps: true })

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;