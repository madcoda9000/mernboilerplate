import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

/**
 * Quote schema
 * @typedef {object} Quote
 * @property {string} quote - the quote
 * @property {string} author - the author of the quote
 * @property {string} genre - the quote genre
 */
const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
  },
  author: {
    type: String,
  },
  genre: {
    type: String,
  },
})
quoteSchema.plugin(mongoosePaginate)
const Quote = mongoose.model("Quote", quoteSchema)

export default Quote
