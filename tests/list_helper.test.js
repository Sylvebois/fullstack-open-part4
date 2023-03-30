const listHelper = require('../utils/list_helper')
const blogs = require('./testData')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  test('One blog', () => {
    expect(listHelper.totalLikes([blogs[0]])).toBe(7)
  })

  test('More blogs', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })

  test('No blog', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
})

describe('favoriteBlog', () => {
  test('One blog', () => {
    const fav = {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes
    }

    expect(listHelper.favoriteBlog([blogs[0]]))
      .toEqual(fav)
  })

  test('More blogs', () => {
    const fav = {
      title: blogs[2].title,
      author: blogs[2].author,
      likes: blogs[2].likes
    }
    expect(listHelper.favoriteBlog(blogs)).toEqual(fav)
  })

  test('No blog', () => {
    expect(listHelper.favoriteBlog([])).toBe(null)
  })
})

describe('mostBlogs', () => {
  test('One blog', () => {
    const mostBlogAuthor = {
      author: blogs[0].author,
      blogs: 1
    }

    expect(listHelper.mostBlogs([blogs[0]])).toEqual(mostBlogAuthor)
  })

  test('More blogs', () => {
    const mostBlogAuthor = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(listHelper.mostBlogs(blogs)).toEqual(mostBlogAuthor)
  })

  test('No blog', () => {
    expect(listHelper.mostBlogs([])).toBe(null)
  })
})

describe('mostLikes', () => {
  test('One blog', () => {
    const mostLikedAuthor = {
      author: blogs[0].author,
      likes: 7
    }

    expect(listHelper.mostLikes([blogs[0]])).toEqual(mostLikedAuthor)
  })

  test('More blogs', () => {
    const mostLikedAuthor = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(listHelper.mostLikes(blogs)).toEqual(mostLikedAuthor)
  })

  test('No blog', () => {
    expect(listHelper.mostLikes([])).toBe(null)
  })
})