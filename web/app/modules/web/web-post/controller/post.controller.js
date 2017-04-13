const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Category = mongoose.model('Category');
const async = require('async');
const Boom = require('boom');
const paginator = require('super-pagination').paginator;

exports.list = {
    pre: [
        { method: getCategoryBySlug, assign: 'category' }
    ],
    handler: function (request, reply) {
        let config = request.server.configManager;
        let itemsPerPage = config.get('web.paging.itemsPerPage');
        let page = request.query.page || 1;

        let options = { status: 1 };
        if (request.pre.category) {
            options.category = request.pre.category._id;
        }

        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }

        async.parallel({

            posts: function (callback) {
                Post
                    .find(options)
                    .sort('-created')
                    .populate('category')
                    .lean()
                    .paginate(page, itemsPerPage, callback);
            }

        }, function (err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
            let items = result.posts[0];
            let total = result.posts[1];
            let categories = result.categories;
            let totalPage = Math.ceil(total / itemsPerPage);
            let pagination = new paginator().set({
                per_page: itemsPerPage,
                current_page: page,
                total: total,
                number_of_pages: totalPage,
                show_empty: false,
                url: '/posts' + getPrelink(request)
            });
            let meta = {
                title: 'News',
                description: 'News description'
            }
            let dataRes = { posts: items, meta: meta, paginator: pagination.render() };

            return reply.view('web/html/web-post/list', dataRes);
        });

    },
}
exports.view = {
    pre: [
        { method: getBySlug, assign: 'post' }
    ],
    handler: function (request, reply) {
        let post = request.pre.post;
        if (!post) {
            return reply(Boom.notFound('Post is not be found'));
        }
        let meta = {}
        // if(post.attrs.title){
        meta.title = post.attrs.title || post.title
        meta.description = post.attrs.description || post.teaser
        //}
        return reply.view('web/html/web-post/view', { post: post, meta: meta });
    },
}


function getBySlug(request, reply) {
    const slug = request.params.slug || request.payload.slug;
    let promise = Post.findOne({ 'slug': slug, 'status': 1 }).exec();
    promise.then(function (post) {
        reply(post);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply(err);
    })
}

function getCategoryBySlug(request, reply) {
    if (request.params && request.params.category) {
        const slug = request.params.category
        let promise = Category.findOne({ 'slug': slug, 'status': 1 });
        promise.then(function (category) {
            reply(category);
        }).catch(function (err) {
            request.log(['error'], err);
            return reply.continue();
        })
    } else {
        return reply.continue();
    }
}

function getPrelink(request) {
    if (request.pre.category) {
        return '/' + request.pre.category.slug;
    }
    return '';
}
