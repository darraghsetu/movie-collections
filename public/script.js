$('.close')
  .on('click', function() {
    $(this)
      .closest('.closeable')
      .transition('fade')
    ;
  })
;

$(document).ready(() => {
  $("#signupPassword").on("focus", () => { 
    $("#passwordReqs").transition("slide down");
  });
  
  $("#signupPassword").on("blur", () => {
    $("#passwordReqs").transition("slide down");
  });
});

function clearForm(formId) {
  const form = document.getElementById(formId);
  
  if(form){
    const formFields = form.querySelectorAll('input');
    
    formFields.forEach(field => {
      if (field.type === "checkbox") {
        field.removeAttribute("checked");
      } else {
        field.value = "";  
      }
    });
  }
};

const newCollectionBtn = document.getElementById('new-collection-btn');

if (newCollectionBtn) {
  const cancelNewCollectionBtn = document.getElementById('cancel-new-collection-btn');
  const newCollection = document.getElementById('new-collection');
  const clearCollectionBtn = document.getElementById('clear-new-collection-btn');
  
  newCollectionBtn.addEventListener('click', () => {
    clearForm('collection-form');
    newCollection.classList.remove('hidden');
  });
  
  cancelNewCollectionBtn.addEventListener('click', () => {
    newCollection.classList.add('hidden');
    window.location.hash = '#top';
  });

  clearCollectionBtn.addEventListener('click', () => {
    clearForm('collection-form');
  });  
}

const newMovieBtn = document.getElementById('new-movie-btn');

if (newMovieBtn) {
  const cancelNewMovieBtn = document.getElementById('cancel-new-movie-btn');
  const clearMovieBtn = document.getElementById('clear-new-movie-btn');
  const newMovieSegment = document.getElementById('new-movie');
  const editMovieSegment = document.getElementById("edit-movie");
  
  newMovieBtn.addEventListener('click', () => {
    clearForm('movie-form');
    editMovieSegment.classList.add('hidden');
    newMovieSegment.classList.remove('hidden');
    window.location.hash = '';
    window.location.hash = '#new-movie';
  });

  cancelNewMovieBtn.addEventListener('click', () => {
    clearForm('movie-form');
    newMovieSegment.classList.add('hidden');
    window.location.hash = '#top';
  });

  clearMovieBtn.addEventListener('click', () => {
    clearForm('movie-form')
  });
}

const movieCollection = document.getElementById('movie-collection');
  
if (movieCollection) {
  const editMovie = document.getElementById("edit-movie");
  const editForm = editMovie.querySelector('#edit-form');
  const cancelEditMovieBtn = document.getElementById('cancel-edit-movie-btn');
  const clearEditMovieBtn = document.getElementById('clear-edit-movie-btn');
  const editSegment = document.getElementById('edit-movie');
  
  movieCollection.addEventListener('click', (event) => {
    if (event.target.classList.contains('editBtn')) {
    
      const editBtn = event.target;
      const movieData = editBtn.closest('[id^="movie-data-"]')
      
      const collectionId = movieData.dataset.collectionId;
      const movieId = movieData.dataset.movieId;
      const title = movieData.dataset.title;
      const releaseYear = movieData.dataset.releaseYear;
      const runtime = movieData.dataset.runtime;
      const genres = JSON.parse(movieData.dataset.genres);
      const directors = JSON.parse(movieData.dataset.directors);
      const cast = JSON.parse(movieData.dataset.cast);
      const favourite = movieData.dataset.favourite;

      clearForm('edit-form');
      document.getElementById('new-movie').classList.add('hidden');      
      editMovie.querySelector('#edit-movie-header').innerText = `Update " ${title} "`;
      editForm.action = `/movie-collection/${collectionId}/updatemovie/${movieId}`;
      editForm.querySelector('#edit-movie-title').value = title;
      editForm.querySelector('#edit-movie-release-year').value = releaseYear;
      editForm.querySelector('#edit-movie-runtime').value = runtime;
      editForm.querySelector('#edit-movie-director-one').value = directors[0];
      
      if (directors.length > 1) {
        editForm.querySelector('#edit-movie-director-two').value = directors[1];
        if (directors.length > 2) {
          editForm.querySelector('#edit-movie-director-three').value = directors[2];
        }
      }
      
      editForm.querySelector('#edit-movie-cast-one').value = cast[0];
      
      if (cast.length > 1) {
        editForm.querySelector('#edit-movie-cast-two').value = cast[1];  
        if (cast.length > 2) {
          editForm.querySelector('#edit-movie-cast-three').value = cast[2];
        }
      }
      
      if (genres.length > 1) {
        editForm.querySelector('#edit-movie-genre-one').value = genres[1];
        if (genres.length > 2) {
          editForm.querySelector('#edit-movie-genre-two').value = genres[2];  
        }
      }
      
      const checkbox = document.getElementById('edit-movie-favourite')
      checkbox.removeAttribute('checked');
      
      if (favourite === 'true'){
        checkbox.setAttribute('checked', '');
      }
      
      editMovie.classList.remove('hidden');
      window.location.hash = '';
      window.location.hash = '#edit-movie';
    }
  });
  
  cancelEditMovieBtn.addEventListener('click', () => {
    editSegment.classList.add('hidden');
    window.location.hash = '#top';
  });

  clearEditMovieBtn.addEventListener('click', () => {
    clearForm('edit-form');
  });
}