module.exports = {
  up(db) {
    return db.createCollection('usersVotes', {
      capped: false,
      autoIndexId: true,
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user", "vote", "choice"],
          properties: {
            user: {
              bsonType: 'objectId'
            },
            vote: {
              bsonType: 'objectId'
            },
            choice: {
              bsonType: 'int'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error',
    })
  },
  down(db) {
    return db.collection('usersVotes').drop()
  }
}
