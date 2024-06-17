document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const searchBtn = document.getElementById('searchBtn');
    const books = document.getElementById('books');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDescription = document.getElementById('popupDescription');
    const closeBtn = document.querySelector('.close');
  
  // search bar function
  
    searchBtn.addEventListener('click', () => {
        const query = searchBar.value;
        if (query) {
            searchBooks(query);
        }
    });
  
    function searchBooks(query) {
        const url = `https://openlibrary.org/subjects/${query.toLowerCase()}.json`;
        axios.get(url)
            .then(response => {
                const books = response.data.works;
                displayBooks(books);
            })
            .catch(error => console.error('Error fetching book data:', error));
  };
  
  // display books //
  
    function displayBooks(books) {
      const booksContainer = document.getElementById('books');
      booksContainer.innerHTML = ''; 
    
  //layout and arrangement per books
  
      books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'card';
    
        const coverId = book.cover_id ? book.cover_id : (book.cover_edition_key ? book.cover_edition_key : null);
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/128x193?text=No+Cover';
    
        bookElement.innerHTML = `
          <img src="${coverUrl}" class="card-img-top" alt="Cover of ${book.title}" />
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">Autori: ${book.authors.map(author => author.name).join(', ')}</p>
            <button class="btn-popup" data-book-id="${book.key}">Read the description</button>
          </div>
        `;
    
        booksContainer.appendChild(bookElement);
      });
  
      addPopupEventListeners();
    }   
  
    //popup with description
    
    
  function addPopupEventListeners() {
    const popupButtons = document.querySelectorAll('.btn-popup');
    popupButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const bookId = event.target.getAttribute('data-book-id');
            fetchBookDescription(bookId);
        });
    });
  }
  
  function fetchBookDescription(bookId) {
    const url = `https://openlibrary.org${bookId}.json`;
    axios.get(url)
        .then(response => {
            const book = response.data;
            const description = book.description ? (typeof book.description === 'string' ? book.description : book.description.value) : 'No description available';
            showPopup(book.title, description);
        })
        .catch(error => console.error('error loading book description', error));
  }
  
  function showPopup(title, description) {
    popupTitle.textContent = title;
    popupDescription.textContent = description;
    popup.style.display = 'block';
  }
  
  // open close popup layout 
  
  closeBtn.onclick = function() {
    popup.style.display = 'none';
  }
  
  window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
  }
  
  });
  
   
  
  
  