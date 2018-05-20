import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const deepPopulateInstance = deepPopulate(mongoose);

const { Schema } = mongoose;

const PoemSchema = new Schema({
  title : {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  message: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  upVotes: [], 
  downVotes: [], 
  voteScore: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Number,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  _creator:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _comments : [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
});


function autoPopulateCommentFields(next){
  this.populate({
    path: '_creator',
    select: 'username -_id' 
  });
  this.populate({
    path: '_comments',
    select: 'message _creator _poem _comments createdAt isDeleted _parentId',
    match: { 'isDeleted' : false },
    populate: [
      {
        path: '_creator',
        select: 'username -_id'
      },
      {
        path: '_comments',
        select: 'message _creator _poem _comments createdAt isDeleted _parentId',
        match: { 'isDeleted' : false },
        populate: [
          {
            path: '_creator',
            select: 'username -_id'
          },
          {
            path: '_comments',
            select: 'message _creator _poem _comments createdAt isDeleted _parentId',
            match: { 'isDeleted' : false },
            populate: [
              {
                path: '_creator',
                select: 'username -_id'
              },
              {
                path: '_comments',
                select: 'message _creator _poem _comments createdAt isDeleted _parentId',
                match: { 'isDeleted' : false },
                populate: [
                  {
                    path: '_creator',
                    select: 'username -_id'
                  },
                  {
                    path: '_comments',
                    select: 'message _creator _poem _comments createdAt isDeleted _parentId',
                    match: { 'isDeleted' : false },
                    populate: [
                      {
                        path: '_creator',
                        select: 'username -_id'
                      },
                      {
                        path: '_comments',
                        select: 'message _creator _poem _comments createdAt isDeleted _parentId',
                        match: { 'isDeleted' : false },
                        populate: [
                          {
                            path: '_creator',
                            select: 'username -_id'
                          },
                          {
                            path: '_comments',
                            select: 'message _creator _poem _comments createdAt isDeleted _parentId',
                            match: { 'isDeleted' : false }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
  next()
}

PoemSchema.pre('findOne', autoPopulateCommentFields);

// PoemSchema.plugin(deepPopulateInstance, {
//   populate: {
//     '_creator': {
//       select: 'username -_id'
//     },
//     '_comments': {
//       select: 'message _creator _poem _comments createdAt isDeleted _parentId',
//       match: {'isDeleted' : false}
//     },
//     '_comments._creator': {
//       select: 'username -_id'      
//     },
//     '_comments._comments': {
//       select: 'message _creator _poem _comments createdAt isDeleted _parentId',
//       match: {'isDeleted' : false}
//     }
//   }
// });

const Poem = mongoose.model('Poem', PoemSchema);

export default Poem;