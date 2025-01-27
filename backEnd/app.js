const { express, mongoose, app } = require("./server");
const Book = require("./models/book");



app.use(express.json()); // this allow us to use json to send and receive data
app.use(express.urlencoded({ extended: true })); // this allow us to use url to send and receive data

// Middlewares

app.get('/showbooks', async(request, response) => {
  try{
    const books = await Book.find();
    response.status(200).json(books);
  }catch(error){
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
}) // show all books

app.get('/showbook/:id', async(request, response) => {
  try{
    const book = await Book.findById(request.params.id);
    if(!book)
      return response.status(404).json({ message: 'Book not found' });
    response.status(200).json(book);
  }catch(error){
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
}) // show one book by its id 

app.get('/showbook/:title', async(request, response) => {
  try{
    const book = await Book.find({ title: request.params.title });
    if(!book[0])
      return response.status(404).json({ message: 'Book not found' });
    response.status(200).json(book);
  }catch(error){
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
}) // show all books that have the same title

app.get('/searchbook', async(request, response) => {  // Version 1 of Search
  try {
    const search = request.query.search;
    const books = await Book.find({ $or: [{ title: { $regex: search, $options: 'i' } }, { author: { $regex: search, $options: 'i' } }] });
    response.status(200).json(books);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
}) // this query search that its shape look like this : http://localhost:8000/searchbook?search=Ahmed_Ibrahem (this search on author ahmed ibrahem or title ahmed ibrahem) 

app.get('/searchbook/:keyword', async(request, response) => { // Version 2 of Search
  try {
    const keyword = request.params.keyword;
    const books = await Book.find({ $or: [{ title: { $regex: keyword, $options: 'i' } }, { author: { $regex: keyword, $options: 'i' } }] });
    response.status(200).json(books);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
}) // this query search that its shape look like this : http://localhost:8000/searchbook/Ahmed_Ibrahem (this search on author ahmed ibrahem or title ahmed ibrahem)

app.post('/addbook', async(request, response) => {
try{
    const newBook = await Book.create(request.body); // this line create new book and save it in database and return it as response
    response.status(200).json(newBook); // this line return new book as response to client side with status code 200 
  }catch(error){
    console.log(error.message);;
    response.status(500).json({ message: error.message });
  }
}) // add new book

app.put('/updatebook/:id', async(request, response) => {
  try{
    const book = await Book.findByIdAndUpdate(request.params.id, request.body);
    if(!book)
      return response.status(404).json({ message: 'Book not found' });
    const updatedBook = await Book.findById(request.params.id);
    response.status(200).json(updatedBook);
  }catch(error){
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
}) // update book by its id

app.delete('/deletebook/:id', async(request, response) => {
  try{
    const book = await Book.findByIdAndDelete(request.params.id);
    if(!book)
      return response.status(404).json({ message: 'Book not found' });
    response.status(200).json(book);
  }catch(error){
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
})
 
  