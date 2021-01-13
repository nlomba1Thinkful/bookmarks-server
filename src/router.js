const express = require('express')
const bookmarkRouter = express.Router()
const { v4: uuid } = require('uuid');
const logger = require('./logging');

const bookmarks = [{
    id: 1,
    title: 'Google',
    url: 'www.google.com',
    desc: 'The worlds search engine',
    rating: '4'
  }];

bookmarkRouter.use('/bookmarks',(req,res)=>{
    res
        .json(bookmarks)
})

bookmarkRouter.post('/bookmark',(req,res)=>{
  console.log(req.body)
    const { title, url, desc, rating } = req.body;
    if (!title) {
        logger.error(`Title is required`);
        return res
          .status(400)
          .send('Invalid data');
     }
      
    if (!url) {
        logger.error(`URL is required`);
        return res
          .status(400)
          .send('Invalid data');
    }
    
    let isValidURL =()=> {
      if (url.toLowerCase().includes('https://')) {
      return true
    } if (url.toLowerCase().includes('http://')) {
      return true
    }
    false 
    }

    if (!isValidURL) {
        logger.error(`URL is invalid, must include http(s)://`);
        return res
          .status(400)
          .send('Invalid data');
      }

    const id = uuid();

    const bookmark = {
        id,
        title,
        url,
        desc,
        rating
    };

    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created`);

    res
    .status(201)
    .location(`http://localhost:8000/bookmark/${id}`)
    .json(bookmark);
})

bookmarkRouter
    .route('/bookmark/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = bookmarks.find(b => b.id == id);
    
        // make sure we found a bookmark
        if (!bookmark) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
            .status(404)
            .send('Bookmark Not Found');
        }
    
        res.json(bookmark);
    })
    .delete((req, res)=>{
        const {id}=req.params
        const idx = bookmarks.findIndex(bkmk=> bkmk.id == id)

        if (idx == -1) {
            logger.error(`Bookmark with id ${id} not found`)
            return res
            .status(404)
            .send('Not Found')
        }
        bookmarks.splice(idx, 1)

        logger.info(`Bookmark with id ${id} deleted.`)
        res
            .status(204)
            .end()
    })

module.exports = bookmarkRouter