const mongoose = require('mongoose')


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comment: [
        {
            type: String
            // text: String <-- wrong
        }
    ],
    like: [
        {
            type: String
            // id: String <-- wrong
        }
    ],
    dislike: [
        {
            type: String
        }
    ]
})

// method for counting Likes
articleSchema.methods.countLike = function() {

    let newCount = 0
    newCount =+ 1

    this.like = newCount
    return this.save()
}


module.exports = mongoose.model('Article', articleSchema)