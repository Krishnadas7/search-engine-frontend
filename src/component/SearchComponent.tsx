import React, { useEffect, useState } from 'react';
import { BookOpen, Search, BookmarkPlus, ChevronRight, Star, Clock, X } from 'lucide-react';
import BookCard from './BookCard';
import { Book, CreateBookResponse } from '../Interface/book';
import toast from "react-hot-toast";
import axios from 'axios';



const BookSearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [changVal,setChangVal]= useState<boolean>(false)
  const [newBook, setNewBook] = useState<Book>({
    title: '',
    author: '',
    genre: '',
    publicationYear: 0
  });
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    async function getBooks() {
      try {
        const response = await axios.get<{ success: boolean; data: Book[] }>(process.env.BASE_URL as string);
        setBooks(response.data.data); // Ensure you're setting only the array
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
  
    getBooks();
  }, [changVal]);
  // Handle search input change
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const query = event.target.value.trim()
    setSearchQuery(query)
  
    if (query === "") {
      setFilteredBooks([]);
      return;
    }
  
    try {
      const response = await axios.get<{ success: boolean; statusCode: number; message: string; data: Book[] }>(
        `${process.env.BASE_URL}/bookSearch?title=${query}`
      );
  
      if (response.data.success) {
        console.log("data from deeas",response.data.data)
        setFilteredBooks(response.data.data);
      } else {
        setFilteredBooks([]);
      }
    } catch (error: any) {
      console.error("Error searching books:", error.response?.data?.message || error.message);
      setFilteredBooks([]); 
    }
  };

  // Handle book selection
  const handleBookSelect = (book: Book): void => {
    setSelectedBook(book);
  };

  // Toggle modal
  const toggleModal = (): void => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setNewBook({
        title: '',
        author: '',
        genre: '',
        publicationYear: 0
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setNewBook({
      ...newBook,
      [name]: name === 'publicationYear' ? parseInt(value) || 0 : value
    });
  };

  // Handle form submission
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await axios.post<CreateBookResponse>(process.env.BASE_URL as string, newBook);
  
      toast.success(response?.data.message); 
      setChangVal(!changVal); 
      toggleModal(); 
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen size={32} />
              <h1 className="text-2xl font-bold ml-2">BookVerse</h1>
            </div>
            <button 
              className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium text-sm"
              onClick={toggleModal}
            >
              Add Book
            </button>
          </div>
          <div className="mt-12 max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold mb-4">Discover Your Next Favorite Book</h2>
            <p className="text-indigo-100 mb-8">
              Explore our carefully curated collection spanning centuries of literary excellence
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto -mt-16 bg-white rounded-xl shadow-md p-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-4 py-3 bg-gray-50 border outline-none border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search by title or author..."
            />
          </div>

          {filteredBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBooks.map((book, index) => (
                <BookCard key={index} book={book} onClick={handleBookSelect} />
              ))}
            </div>
          )}

          {filteredBooks.length === 0 && !selectedBook && searchQuery === '' && (
            <div className="py-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-indigo-200 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Discover Literary Treasures</h3>
              <p className="text-gray-500 mb-6">Start by typing a book title or author name</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <Star size={20} className="text-indigo-500 mb-2" />
                  <h4 className="font-medium">Popular Classics</h4>
                  <p className="text-xs text-gray-600 mt-1">Timeless stories loved by millions</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <BookmarkPlus size={20} className="text-indigo-500 mb-2" />
                  <h4 className="font-medium">New Additions</h4>
                  <p className="text-xs text-gray-600 mt-1">Fresh picks for your reading list</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <Star size={20} className="text-indigo-500 mb-2" />
                  <h4 className="font-medium">Recommended</h4>
                  <p className="text-xs text-gray-600 mt-1">Curated suggestions just for you</p>
                </div>
              </div>
            </div>
          )}

          {selectedBook && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
              <button 
                onClick={() => setSelectedBook(null)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center mb-4"
              >
                <ChevronRight className="h-4 w-4 transform rotate-180 mr-1" />
                Back to results
              </button>
              
              <div className="md:flex items-start">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="bg-indigo-100 rounded-lg h-48 flex items-center justify-center">
                    <BookOpen size={64} className="text-indigo-400" />
                  </div>
                </div>
                
                <div className="md:w-2/3 md:pl-6">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedBook.title}</h2>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium py-1 px-2 rounded">
                      {selectedBook.genre}
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-4">by {selectedBook.author}</p>
                  
                  <div className="border-t border-b border-gray-100 py-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock size={16} className="mr-2 text-indigo-500" />
                      <span>Published in {selectedBook.publicationYear}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    {selectedBook.title} is a renowned {selectedBook.genre.toLowerCase()} novel that has captivated readers for generations. Written by {selectedBook.author} and first published in {selectedBook.publicationYear}, this timeless work explores themes that continue to resonate with modern audiences.
                  </p>
                  
                  <div className="flex space-x-4">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">
                      Add to Reading List
                    </button>
                    <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {!selectedBook && filteredBooks.length === 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.slice(0, 4).map((book, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {book.genre}
                      </span>
                      <span className="text-xs text-gray-500">{book.publicationYear}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button 
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Book</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={newBook.genre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={newBook.publicationYear || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  min="1"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSearchComponent;