import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const URL = `http://localhost:3030/api/`;

  // states
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    marital_status: "",
    personal_id: "",
    sum: "",
    birthday: "",
  });
  const [items, setItems] = useState([
    {
      _id: "",
      name: "",
      description: "",
      price: "",
      category: "",
      createdAt: "",
    },
  ]);
  const [item, setItem] = useState({
    personal_id: "",
    name: "",
    description: "",
    price: "",
    category: "",
  });


  // handleFunctions

  // personal Id verification
  const handlePersonalIdubmit = (event) => {
    event.preventDefault();
    id.length !== 9 || isNaN(id)
      ? setError("Personal Id Should be 9 numbers only")
      : success();
  };

  // personal Id state change
  const handleChange = (event) => {
    setId(event.target.value);
  };

  // get user by id
  const success = async () => {
    setError("");
    const response = await axios.get(`${URL}users/${id}`);

    if (response.status !== 200) {
      setError("something went wrong fetching your account");
    } else {
      setError("");
    }

    if (response.data.user || response.data.items) {
      handleStates(response);
    }
  };

  // set user and set items
  const handleStates = (response) => {
    makeUser(response.data.user);
    makeItems(response.data.items);
  };

  // set user details
  const makeUser = (userData) => {
    setUser((prevState) => {
      let newUser = Object.assign({}, prevState.user);
      newUser.first_name = userData.first_name;
      newUser.last_name = userData.last_name;
      newUser.marital_status = userData.marital_status;
      newUser.personal_id = userData.personal_id;
      newUser.birthday = userData.birthday;
      newUser.sum = userData.sum;
      return newUser;
    });
  };

  // set items details
  const makeItems = (itemsData) => {
    setItems(itemsData);
  };

  // delete item route
  const deleteItem = async (itemId, personalId) => {
    const response = await axios.post(`${URL}costs/deleteItem`, {
      id: itemId,
      personal_id: personalId,
    });

    if (response.status !== 200) {
      setError("something went wrong deleting the item");
    } else {
      setError("");
    }
    setUser((prevState) => {
      let newUser = Object.assign({}, prevState.user);
      newUser.first_name = prevState.first_name;
      newUser.last_name = prevState.last_name;
      newUser.marital_status = prevState.marital_status;
      newUser.personal_id = prevState.personal_id;
      newUser.birthday = prevState.birthday;
      newUser.sum = response.data.user.sum - response.data.item.price;
      return newUser;
    });
    makeItems(response.data.items);
  };

  // show items by user
  const renderedItems = items.map((item, index) => {
    return (
      <tr key={item._id}>
        <th>{item._id}</th>
        <th>{item.name}</th>
        <th>{item.category}</th>
        <th>{item.description}</th>
        <th>{item.price}</th>
        <th>{item.createdAt}</th>
        <th>
          <button onClick={() => deleteItem(item._id, item.createdBy)}>
            Delete
          </button>
        </th>
      </tr>
    );
  });


  // adding item
  const handleAddItem = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${URL}costs/createItem`, {
      personal_id: id,
      name: event.target[0].value,
      description: event.target[1].value,
      price: event.target[2].value,
      category: event.target[3].value,
    });
    if (response.data.message === 'item created'){
      success();
    }
    
  };

  // handle start and end date
  const handleDates = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${URL}costs/sortby`, {
      startDate: event.target[0].value,
      endDate: event.target[1].value,
      id
    });
    makeItems(response.data.items);
  };

  return (
    <div className="App">
      <h1>Async final project</h1>
      <form onSubmit={handlePersonalIdubmit}>
        <label>
          Personal ID: <input type="text" onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <p className="red">{error}</p>
      {user.first_name ? (
        <div className="myForm">
          <p>Personal_id: {user.personal_id}</p>
          <p>First Name: {user.first_name}</p>
          <p>Last Nam: {user.last_name}</p>
          <p>Birthday: {user.birthday}</p>
          <p>Marital Status: {user.marital_status}</p>
          <p className="bold">Sum prices: {user.sum}</p>
        </div>
      ) : (
        ""
      )}
      <br />
      <div>
        <div>
          {user.first_name ? (
            <>
              <form onSubmit={handleAddItem} className="myForm">
                <p className="bold">Add an item</p>
                <label>name:</label>
                <br />
                <input type="text" id="name" name="name" />
                <br />
                <label>description:</label>
                <br />
                <input type="text" id="description" name="description" />
                <br />
                <label>price:</label>
                <br />
                <input type="text" id="price" name="price" />
                <br />
                <label>category:</label>
                <br />
                <select name="cars" id="cars">
                  <option value="Food">Food</option>
                  <option value="Health">Health</option>
                  <option value="Housing">Housing</option>
                  <option value="Sport">Sport</option>
                  <option value="Education">Education</option>
                </select>
                <br />
                <br />
                <input type="submit" value="Submit"></input>
                <br />
                <br />
              </form>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <br />
      <div>
        {user.personal_id ? (
          <>
            <div>
              <form onSubmit={handleDates}>
                <p className="bold">Filter Dates:</p>
                <label>From:</label>
                <br />
                <input type="date" id="start" name="trip-start" />
                <br />
                <label>To:</label>
                <br />
                <input type="date" id="end" name="trip-end" />
                <br />
                <br />
                <input type="submit" value="Submit"></input>
                <br />
                <br />
              </form>
            </div>
            <table className="myTable">
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>CreatedAt</th>
                  <th>Action</th>
                </tr>
                {renderedItems}
              </tbody>
            </table>
          </>
        ) : (
          ""
        )}
        <br />
        <br />
      </div>
    </div>
  );
}

export default App;
