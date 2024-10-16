import Group from '../models/Group.js';
import Post from '../models/Post.js';

export const createGroup = async (req, res, next) => {
    try {
        const group = new Group(req.body);
        const savedGroup = await group.save();
        const responseJSON = savedGroup.toJSON();
        delete responseJSON.badgeCount;

        res.status(201).json(responseJSON);
    }
    catch (error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

export const getGroup = async (req, res, next) => {
    try {
        let { page = 1,
                pageSize = 10,
                sortBy = 'latest',
                keyword = '',
                isPublic = true
            } = req.query;

        // 유효성 검증
        page = isNaN(page) || page <= 0 ? 1 : Number(page);
        pageSize = isNaN(pageSize) || pageSize <= 0 ? 10 : Number(pageSize);

        //sortBy: latest | mostPosted | mostLiked |  mostBadge (정렬 기준)
        const actions = {
            latest: {createdAt: 'desc'},
            mostPosted: {postCount: 'desc'},
            mostLiked: {likeCount: 'desc'},
            mostBadge: {badgeCount: 'desc'}
        };

        const sortOption = actions[sortBy];

        const regex = new RegExp(keyword, 'i');
        const skip = (page - 1) * pageSize;

        const foundGroup = await Group
            .find({name: regex, isPublic: isPublic})
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize);

        const totalItemCount = await Group.countDocuments({name: regex, isPublic: isPublic});


        const dataArray = foundGroup.map(group => {
            const groupJSON = group.toJSON();
            delete groupJSON.badges;
            return groupJSON;
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
};

export const updateGroup = async (req, res, next) => {
    try {
        //get group id from request parameter
        const { groupId } = req.params;

        const { name, password, imageUrl, isPublic, introduction } = req.body;
        
        //find group by id and update
        const selectedGroup = await Group
             .findOne({id: groupId});
        
        if (!selectedGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        console.log(selectedGroup, selectedGroup.password, password);
        
        if (selectedGroup.password != password) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }
        
        const updatedGroup = await Group
            .findOneAndUpdate({id: groupId}, {
                name,
                imageUrl,
                isPublic,
                introduction
            }, {new: true});

        const responseJSON = updatedGroup.toJSON();
        delete responseJSON.badgeCount;

        res.status(200).json(responseJSON);
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const deleteGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { password } = req.body;

        const selectedGroup = await Group
            .findOne({id: groupId});

        if (!selectedGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (selectedGroup.password != password) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }

        await Group
            .findOneAndDelete({id: groupId});

        res.status(200).json({message: '그룹 삭제 성공'});
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const getGroupDetail = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        const selectedGroup = await Group
            .findOne({id: groupId});

        if (!selectedGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        const responseJSON = selectedGroup.toJSON();
        delete responseJSON.badgeCount;

        res.status(200).json(responseJSON);
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const verifyGroupPassword = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { password } = req.body;

        const selectedGroup = await Group
            .findOne({id: groupId});

        if (!selectedGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (selectedGroup.password != password) {
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

export const likeGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        const selectedGroup = await Group
            .findOne({id: groupId});

        if (!selectedGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        await Group
            .findOneAndUpdate({id: groupId}, {
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

export const isGroupPublic = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        const selectedGroup = await Group
            .findOne({id: groupId});

        if (!selectedGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({id: selectedGroup.id, isPublic: selectedGroup.isPublic});
    }
    catch(error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
}

export const createGroupPost = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { groupPassword, postPassword, ...restBody } = req.body;
        const post = new Post(restBody);
        post.password = postPassword;

        const foundGroup = await Group
            .findOne({id: groupId});
        
        if (!foundGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        if (foundGroup.password != groupPassword) {
            const error = new Error();
            error.statusCode = 403;
            throw error;
        }

        post.groupGenuineId = foundGroup._id;

        const savedPost = await post.save();

        const responseJSON = savedPost.toJSON();
        
        responseJSON.groupId = groupId;

        console.log(responseJSON);

        res.status(201).json(responseJSON);
    }
    catch (error) {
        if(error.name == 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

export const getGroupPost = async (req, res, next) => {
    try {
        let { page = 1,
                pageSize = 10,
                sortBy = 'latest',
                keyword = '',
                isPublic = true
            } = req.query;

        // 유효성 검증
        page = isNaN(page) || page <= 0 ? 1 : Number(page);
        pageSize = isNaN(pageSize) || pageSize <= 0 ? 10 : Number(pageSize);
        const groupId = req.params.groupId;

        if(!groupId) {
            const error = new Error();
            error.statusCode = 400;
            throw error;
        }

        //find there is a group with the given id
        const foundGroup = await Group
            .findOne({id: groupId});
        
        if (!foundGroup) {
            const error = new Error();
            error.statusCode = 404;
            throw error;
        }

        //sortBy: latest | mostPosted | mostLiked |  mostBadge (정렬 기준)
        const actions = {
            latest: {createdAt: 'desc'},
            mostPosted: {postCount: 'desc'},
            mostLiked: {likeCount: 'desc'},
            mostBadge: {badgeCount: 'desc'}
        };

        const sortOption = actions[sortBy];

        const regex = new RegExp(keyword, 'i');
        const skip = (page - 1) * pageSize;

        const qurey = {nickname: regex, isPublic: isPublic, groupGenuineId: foundGroup._id};

        const foundPost = await Post
            .find(qurey)
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize);

        const totalItemCount = await Post.countDocuments(qurey);


        const dataArray = foundPost.map(group => {
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
};