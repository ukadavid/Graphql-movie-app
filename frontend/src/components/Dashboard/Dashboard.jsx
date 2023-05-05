import { useState } from 'react';
import './Dashoboard.css';

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        query: `
          mutation createMovie($input: MovieInput!) {
            createMovie(input: $input) {
              title
              description
              price
              image
            }
          }
        `,
        variables: {
          input: formData,
        },
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      closeModal();
    } else {
      const errorMessage = responseData.errors[0].message;
      setErrorMessage(errorMessage);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <button className="add-movie-btn" onClick={openModal}>
        Add Movie
      </button>
      {showModal && (
        <div className="modal-container">
          <div className="modal">
            <span className="cancel-btn" onClick={closeModal}>
              <i className="fa fa-times"></i>
            </span>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
