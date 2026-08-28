import { create } from 'zustand'

const useBlogStore = create((set) => ({
  blogs: [],

  initializeBlogs: (blogs) => {
    set({ blogs })
  },

  addBlog: (blog) => {
    set((state) => ({
      blogs: state.blogs.concat(blog),
    }))
  },

  updateBlog: (updatedBlog) => {
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog.id === updatedBlog.id
          ? updatedBlog
          : blog
      ),
    }))
  },

  removeBlog: (id) => {
    set((state) => ({
      blogs: state.blogs.filter(
        (blog) => blog.id !== id
      ),
    }))
  },
}))

export default useBlogStore