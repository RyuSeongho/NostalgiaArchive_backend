import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { response } from 'express';

export const updateComment = async (req, res, next) => {
    try {
        //get comment id from request parameter
        const { commentId } = req.params;

        const { password, ...restBody } = req.body;
        
        //find comment by id and update
        const selectedComment = await Comment
             .findOne({id: commentId});
        
        if (!selectedComment) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (selectedComment.password != password) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }
        
        const updatedComment = await Comment
            .findOneAndUpdate({id: commentId}, {
                ...restBody,
            }, {new: true, runValidators: true});

        const responseJSON = updatedComment.toJSON();

        res.status(200).json(responseJSON);
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { password } = req.body;

        const selectedComment = await Comment
            .findOne({id: commentId});
        
        if (!selectedComment) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (selectedComment.password != password) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }

        await Comment
            .findOneAndDelete({id: commentId});
        
        res.status(200).json({message: '답글 삭제 성공'});
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

