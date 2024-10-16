import Post from '../models/Post.js';
import Group from '../models/Group.js';
import Comment from '../models/Comment.js';
import { response } from 'express';

export const updatePost = async (req, res, next) => {
    try {
        //get post id from request parameter
        const { postId } = req.params;

        const { postPassword, ...restBody } = req.body;
        
        //find post by id and update
        const selectedPost = await Post
             .findOne({id: postId});
        
        if (!selectedPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (selectedPost.password != postPassword) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }
        
        const updatedPost = await Post
            .findOneAndUpdate({id: postId}, {
                ...restBody,
            }, {new: true, runValidators: true});

        const responseJSON = updatedPost.toJSON();

        const associatedGroupId = await Group
            .findById(updatedPost.groupGenuineId);
        
        responseJSON.groupId = associatedGroupId.id;

        res.status(200).json(responseJSON);
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { postPassword } = req.body;

        const selectedPost = await Post
            .findOne({id: postId});

        if (!selectedPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (selectedPost.password != postPassword) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }

        await Post
            .findOneAndDelete({id: postId});

        res.status(200).json({message: '게시글 삭제 성공'});
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const getPostDetail = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const selectedPost = await Post
            .findOne({id: postId});

        if (!selectedPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        const responseJSON = selectedPost.toJSON();
        const associatedGroupId = await Group
            .findById(selectedPost.groupGenuineId);

        responseJSON.groupId = associatedGroupId.id;

        console.log(responseJSON.groupId);
        res.status(200).json(responseJSON);
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const verifyPostPassword = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { password } = req.body;

        const selectedPost = await Post
            .findOne({id: postId});

        if (!selectedPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (selectedPost.password != password) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({message: '비밀번호가 확인되었습니다'});
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const likePost = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const selectedPost = await Post
            .findOne({id: postId});

        if (!selectedPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        await Post
            .findOneAndUpdate({id: postId}, {
                $inc: {likeCount: 1}
            });

        res.status(200).json({message: '그룹 공감하기 성공'});
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const isPostPublic = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const selectedPost = await Post
            .findOne({id: postId});

        if (!selectedPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({id: selectedPost.id, isPublic: selectedPost.isPublic});
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const createPostComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { nickname, content, password } = req.body;

        const selectedPost = await Post
            .findOne({id: postId});

        if (!selectedPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if(!nickname || !content || !password) {
            const error = new Error();
            error.statusCode = 400;
            throw error;
        }

        const newComment = new Comment(req.body);
        newComment.postGenuineId = selectedPost._id;

        const savedComment = await newComment.save();

        const responseJSON = savedComment.toJSON();

        res.status(201).json(responseJSON);
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const getPostComment = async (req, res, next) => {
    try {
        let { page = 1,
                pageSize = 10,
            } = req.query;

        // 유효성 검증
        page = isNaN(page) || page <= 0 ? 1 : Number(page);
        pageSize = isNaN(pageSize) || pageSize <= 0 ? 10 : Number(pageSize);
        const postId = req.params.postId;

        if(!postId) {
            const error = new Error();
            error.statusCode = 400;
            throw error;
        }

        //find there is a group with the given id
        const foundPost = await Post
            .findOne({id: postId});
        
        if (!foundPost) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        const skip = (page - 1) * pageSize;

        const qurey = {postGenuineId: foundPost._id};

        const foundComment = await Comment
            .find(qurey)
            .skip(skip)
            .limit(pageSize);

        const totalItemCount = await Comment.countDocuments(qurey);


        const dataArray = foundComment.map(group => {
            const postJSON = group.toJSON();
            return postJSON;
        });

        const responseJSON = {};

        responseJSON.currentPage = page;
        responseJSON.totalPages = Math.ceil(totalItemCount / pageSize);
        responseJSON.totalItemCount = totalItemCount;
        responseJSON.data = dataArray;

        res.status(200).json(responseJSON);
    }
    catch(error) {
        error.statusCode = 400;
        next(error);
    }
}

