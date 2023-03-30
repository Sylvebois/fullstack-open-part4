const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs ? blogs.reduce((total, blog) => total + blog.likes, 0) : 0
}

const favoriteBlog = (blogs) => {
  if (blogs && blogs.length > 0) {
    const favorite = blogs.reduce((best, blog) => best.likes > blog.likes ? best : blog)
    console.log(favorite)
    return { title: favorite.title, author: favorite.author, likes: favorite.likes }
  }
  return null
}

const mostBlogs = (blogs) => {
  if (blogs && blogs.length > 0) {
    const authors = new Map()

    blogs.forEach(blog => {
      let nbBlog = 1

      if (authors.has(blog.author)) {
        const authData = authors.get(blog.author)
        nbBlog += authData.blogs
      }

      authors.set(blog.author, {
        author: blog.author,
        blogs: nbBlog
      })
    })

    return Array.from(authors.values())
      .reduce((bestAuth, auth) => auth.blogs > bestAuth.blogs ? auth : bestAuth)
  }
  return null
}

const mostLikes = (blogs) => {
  if (blogs && blogs.length > 0) {
    const authors = new Map()

    blogs.forEach(blog => {
      let likes = blog.likes

      if (authors.has(blog.author)) {
        const authorData = authors.get(blog.author)
        likes += authorData.likes
      }

      authors.set(blog.author, {
        author: blog.author,
        likes: likes
      })
    })

    return Array.from(authors.values())
      .reduce((bestAuth, auth) => auth.likes > bestAuth.likes ? auth : bestAuth)
  }
  return null
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}