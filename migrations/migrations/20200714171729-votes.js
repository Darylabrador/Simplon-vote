module.exports = {
  up(db) {
    return db.createCollection('votes', {
      capped: false,
      autoIndexId: true,
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['subject', 'quota', 'choices', 'nbVote', 'participants', 'createdBy', 'visibility', 'status'],
          properties: {
            subject: {
              bsonType: 'string'
            },
            quota: {
              bsonType: 'int'
            },
            choices: {
              // array string ex: ['oui', 'non', 'peut être']
              bsonType: 'array'
            },
            nbVote: {
              bsonType: 'int'
            },
            participants: {
              // Array des Object ID des utilisateurs qui participent au vote
              bsonType: 'array',
            },
            createdBy: {
              // Object ID de l'utilisateur qui a créer le sujet de vote
              bsonType: 'objectId',
            },
            visibility: {
              // 2 status possibles : public / private
              bsonType: 'string'
            },
            status: {
              // On peut avoir 3 valeurs : created,inprogress,finished
              bsonType: 'string'
            }
          }
        },
      },
      validationLevel: 'strict',
      validationAction: 'error',
    })
  },
  down(db) {
    return db.collection('votes').drop()
  }
}