/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
const books = require('./books')
const { nanoid } = require('nanoid')

const postBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  // id is randomly generated
  const id = nanoid(16)
  // book is not finished by default
  let finished = false
  // if book's pagecount = last readpage, book is finished
  if (pageCount === readPage) {
    finished = true
  }
  // dates based current date, since we're posting a new book, last update is the first insert
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  // group all new items
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
  }
  // no name found
  if (newBook.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  // readpage exceeds pagecount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  // pushes item into array
  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0
  // on success
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  // general error
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

// ===============================================================================================

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query
  if (name !== undefined) {
    // console.log('there is a ' + name)
    // console.log('debugging ' + books[0].name)
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.name.toLowerCase().includes(name.toLowerCase()))
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  }

  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.reading === true)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  } else if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.reading === false)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  }

  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.finished === true)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  } else if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((obj) => obj.finished === false)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher
          }))
      }
    })
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books
        .map((obj) => ({
          id: obj.id,
          name: obj.name,
          publisher: obj.publisher
        }))
    }
  })
  return response
}

// const getAllBookHandler = (request, h) => (
//   {
//     status: 'success',
//     data: {
//       books: books.map((obj) => ({
//         id: obj.id,
//         name: obj.name,
//         publisher: obj.publisher
//       }))
//     }
//   }
// )

// ===============================================================================================

const getSpecificBookHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((obj) => obj.id === bookId)[0]
  //   console.log(book)
  // book found
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: { book }
    })
    response.code(200)
    return response
  }
  // book not found
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

// ===============================================================================================

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((obj) => obj.id === bookId)

  // book did not found
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  // no name found
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  // readpage exceeds pagecount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  // insert new book
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
}

// ===============================================================================================

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((obj) => obj.id === bookId)
  // book did not found
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  // book found
  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
}

// ===============================================================================================

module.exports = {
  postBookHandler,
  getAllBookHandler,
  getSpecificBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
