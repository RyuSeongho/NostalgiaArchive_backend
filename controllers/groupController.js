import Group from '../models/Group.js';

export const createGroup = async (req, res) => {
    try {
        const group = new Group(req.body);
        const savedGroup = await group.save();

        res.status(201).json(savedGroup.toJSON());
    }
    catch (error) {
        if(error.name == 'ValidationError') {
            res.status(404).json({ message: '잘못된 요청입니다' });
            return;
        } else {
            res.status(409).json({ message: '서버 오류가 발생했습니다' });
        }
    }
};

export const getGroup = async (req, res) => {
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
            mostBadge: {badges: 'desc'},
        };

        const sortOption = actions[sortBy];

        const regex = new RegExp(keyword, 'i');
        const skip = (page - 1) * pageSize;

        const foundGroup = await Group
            .find({name: regex, isPublic: isPublic})
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize)
            .lean();
        
        //delete badge attr from responseJSON
        foundGroup.forEach(group => {
            //add badgeCount attr to each group
            group.badgeCount = group.badges.length;
            delete group.badges;
        });

        res.status(200).json(foundGroup);
    }
    catch(error) {
        res.status(409).json({ message: error.message });
    }
};

