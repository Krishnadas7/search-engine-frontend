import { Clock } from "lucide-react";
import React from "react";
import { BookCardProps } from "../Interface/book";

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer mb-4"
      onClick={() => onClick(book)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
          {book.genre}
        </div>
      </div>
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <Clock size={12} className="mr-1" />
        <span>{book.publicationYear}</span>
      </div>
    </div>
  );
};
export default  BookCard