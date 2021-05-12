const { postBookHandler, getAllBookHandler, getSpecificBookHandler, editBookByIdHandler, deleteBookByIdHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: postBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getSpecificBookHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler
  }

]

module.exports = routes
