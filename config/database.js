//let dbUrl = 'mongodb://localhost:27017/simplonvote'

if (process.env.DB_URL) {
     dbUrl = process.env.DB_URL
}else{
  db='mongodb://localhost:27017/simplonvote';
}

module.exports = {
  url : dbUrl
}

