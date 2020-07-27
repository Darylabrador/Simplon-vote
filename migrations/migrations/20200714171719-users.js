module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    return db.createCollection('users', {
      capped: false,
      autoIndexId: true,
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['login', 'email', 'password'],
          properties: {
            login: {
              bsonType: 'string'
            },
            email: {
              bsonType: 'string'
            },
            password: {
              bsonType: 'string'
            }
          },
        },
      },
      validationLevel: 'strict',
      validationAction: 'error',
    })
  },

  async down(db, client) {
    return await db.collection('users').drop()
  }
};
