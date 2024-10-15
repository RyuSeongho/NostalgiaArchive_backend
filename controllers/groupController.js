import Group from '../models/Group.js';

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

        const responseJSON = foundGroup.map(group => {
            const groupJSON = group.toJSON();
            delete groupJSON.badges;
            return groupJSON;
        });

        res.status(200).json(responseJSON);
    }
    catch(error) {
        error.statusCode = 400;
        next(error);
    }
};

