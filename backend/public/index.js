import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
});


const addButton = document.getElementById("add-movie-button");
const form = document.getElementById("add-movie-form");

form.style.display = "none";

addButton.addEventListener("click", () => {
  form.style.display = form.style.display === "none" ? "block" : "none";
});


const updateButtons = document.querySelectorAll('#update-movie-button');

updateButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const movieCard = event.target.closest('.movie-card');
    const updateForm = movieCard.querySelector('.update-form');
    updateForm.style.display = 'block';
  });
});

function uploadImage() {
  const fileInput = document.getElementById("image-input");
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("image", file);

  fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
    })
    .catch((error) => {
    });
}