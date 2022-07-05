import PostModel from "../models/Post.js"


export const getOne = async (req, res) => {
    try {
        const {id} = req.params
        const post = await PostModel.findOneAndUpdate({
            _id: id
        }, {
            $inc: {
                viewsCount: 1
            }
        }, {
            returnDocument: 'after'
        }, (err, doc) => {
            if(err) {
                return res.status(500).json({
                    message: 'cant\' return post'
                })
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'such post doesn\'t exist'
                })
            } 

        
            return res.status(200).json({
                ...doc
            })
            
        })

    } catch (error) {
        
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user')

        return res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error
        })
    }
}

export const createPost = async (req, res) => {
    try {
      const doc = new PostModel({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.body.userId,
        
      });
  
      const post = await doc.save();
  
      res.status(200).json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Cannot create new post',
      });
    } 
  };



export const remove = async (req,res) => {
    try {
        const postId = req.params.id;

        
        PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if(err) {
                return res.status(500).json({
                    message: "Can't delete post"
                })
            } 
            console.log(doc)
            if(!doc) {
                return res.json({
                    message: "Post is not found"
                })
            }
            
        })

        return res.status(200).json({
            message: 'Deleted post: '+  postId
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id
        
        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            user: req.body.userId,
            tags: req.body.tags
           }
        )

        return res.status(200).json({
            message: "Post was updated"
        })
    } catch (error){
        return res.status(500).json({
            message: error
        })
    }
}