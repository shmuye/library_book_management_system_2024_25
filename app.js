const API_URL = 'http://localhost:5000/api/books';

function displayBooks() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const bookList = document.getElementById("book-list");
      bookList.innerHTML = "";

      data.forEach((book) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${book.title}</strong> by ${book.author}, Quantity: ${book.quantity}
          <button onclick="editBook(${book.id})">Edit</button>
          <button onclick="removeBook(${book.id})">Remove</button>`;
        bookList.appendChild(li);
      });

      displayTotalBooks(data.length);
    })
    .catch(error => console.error('Error fetching books:', error));
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (title && author && quantity) {
    const newBook = { title, author, quantity };
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    })
      .then(response => response.json())
      .then(data => {
        displayBooks();
        clearForm();
      })
      .catch(error => console.error('Error adding book:', error));
  } else {
    alert("Please fill in all fields.");
  }
}

function editBook(id) {
  const title = prompt("Enter the updated title:");
  const author = prompt("Enter the updated author:");
  const quantity = parseInt(prompt("Enter the updated quantity:"));

  if (title && author && quantity) {
    const updatedBook = { title, author, quantity };
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedBook)
    })
      .then(response => response.json())
      .then(data => {
        displayBooks();
      })
      .catch(error => console.error('Error updating book:', error));
  } else {
    alert("Invalid input. Book not updated.");
  }
}

function removeBook(id) {
  if (confirm("Are you sure you want to remove this book?")) {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.status === 200) {
          displayBooks();
        } else {
          alert("Book not found.");
        }
      })
      .catch(error => console.error('Error removing book:', error));
  }
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("quantity").value = "";
}

function displayTotalBooks(total) {
  const totalBooks = document.getElementById("total-books");
  totalBooks.innerText = `Total Books: ${total || 0}`;
}

displayBooks();
