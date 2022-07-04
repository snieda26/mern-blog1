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

    // return res.json({success: true})

    try {
        const {title, text, tags, userId} = req.body

        

        const doc = new PostModel({
            title,
            text, 
            tags, 
            user: userId
        })

    
        const post = await doc.save()
        const newPost = post._doc
        res.status(200).json({
            ...newPost
        })
    } catch (error) {
        return res.status(400).json({
            error
        })
    }



    res.json({success: true})
}; 

export const a = {}