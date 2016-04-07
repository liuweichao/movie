var Movie = require('../models/movie');
var Category = require('../models/category');

// index page
exports.index = function(req,res){
    Category
        .find({})
        .populate({path:'movies',option:{limit:5}})
        .exec(function(err,categories){
            if(err){
                console.log(err);
            }
            console.log(categories[0].movies.length);
            res.render('index',{
                title:'imooc 首页',
                categories:categories
            })
        });

};

// search
exports.search = function(req,res){
    var catId = req.query.cat;
    var page = parseInt(req.query.p,10);
    var count = 2;
    var index = page * count;

    Category
        .find({_id:catId})
        .populate({
            path:'movies',
            select:'title poster'
        })
        .exec(function(err,categories){
            if(err){
                console.log(err);
            }
            var category = categories[0] || {};
            var movies = category.movies || [];
            var results = movies.slice(index,index + count);

            console.log(movies.length / count);

            res.render('results',{
                title:'imooc 结果列表页面',
                keyword:category.name,
                currentPage : (page+ 1),
                query:'cat=' + catId,
                totalPage : Math.ceil(movies.length / count),
                movies:results
            })
        });

};
