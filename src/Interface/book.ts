export interface BookCardProps {
    book: Book;
    onClick: (book: Book) => void;
  }

  export interface Book {
    title: string;
    author: string;
    genre: string;
    publicationYear: number;
  }

  export interface CreateBookResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any; 
  }