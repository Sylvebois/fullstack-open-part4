require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGOURL = process.env.NODE_ENV === 'prod' ? 
  process.env.MONGOURL : 
  process.env.MONGOURL_DEV

module.exports = { PORT, MONGOURL }