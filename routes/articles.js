const router = require('express').Router()
const Article = require('../models/article')


// get new article page
router.get('/newArticle', (req,res) => {
    res.render('articles/newArticle', { article: new Article()})
})

// get edit page
router.get('/edit/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})
// post edited article
router.put('/:id', async (req,res) => {
    let article = await Article.findById(req.params.id)
    article.title =  req.body.title, 
    article.description = req.body.description, 
    article.content = req.body.content
    try {
        updatedArticle = await article.save()
        res.redirect(`/articles/${updatedArticle.id}`)
    } catch(err) {
        console.log(err)
        res.render('articles/edit', { article: article })
    }
})

// get single page
router.get('/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    if(!article) res.redirect('/')
    res.render('articles/detail', { article: article })
})
// post a new article
router.post('/', async (req,res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch(err) {
        console.log(err)
        res.render('articles/newArticle', { article: article })
    }
})

// delete
router.delete('/:id', async (req,res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


// get a single page for comments
router.get('/comment/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/newComment', { article: article })
})
// post a comment
router.post('/:id', async (req,res) => {
    const comment = req.body.comment
    try{
        Article.findByIdAndUpdate(
            req.params.id,
            { $push: { comment: [comment] }},
            { new: true })
        .exec((err)=>{
            if(err) console.log(err) 
        })
    } catch(e){
        console.log(e.message)
    }
    res.redirect(`/articles/${req.params.id}`)  
})

// like
// when posting, we need a unique url (prev: '/:id <-- same as 'comment')
router.post('/like/:id', async (req,res)=> {
    const article = await Article.findById(req.params.id)
    article.like.push(req.params.id)

    try{
        await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch(err) {
        console.log(err)
    }  
})

// dislike
router.post('/dislike/:id', async (req,res)=> {
    const article = await Article.findById(req.params.id)
    article.dislike.push(req.params.id)

    try{
        await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch(err) {
        console.log(err)
    }  
})


module.exports = router