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
  /**
   * the quote
   * @type {string}
   */
  quote: {
    type: String,
  },
  /**
   * the author of the quote
   * @type {string}
   */
  author: {
    type: String,
  },
  /**
   * the quote genre
   * @type {string}
   */
  genre: {
    type: String,
  },
})
quoteSchema.plugin(mongoosePaginate)
const Quote = mongoose.model("Quote", quoteSchema)

export default Quote
