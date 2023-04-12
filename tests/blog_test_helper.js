const Blog = require('../models/blog')

const getAllBlogs = async () =>{
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { getAllBlogs }