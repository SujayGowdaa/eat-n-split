/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useRef } from 'react';
import { useState } from 'react';

/* eslint-disable react/jsx-key */
const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button
      onClick={() => onClick((prevState) => !prevState)}
      className='button'
    >
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isAddFormOpen, setAddFormOpen] = useState(false);

  function handleAddFriend(friend) {
    setFriends((prevState) => [...prevState, friend]);
    setAddFormOpen(false);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList friendList={friends} />
        {isAddFormOpen && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={setAddFormOpen}>
          {isAddFormOpen ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      <FormSplitBill />
    </div>
  );
}

function FriendsList({ friendList }) {
  return (
    <ul>
      {friendList.map((f) => (
        <Friend friend={f} key={f.id} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owe you ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button>Select</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const frndName = useRef();
  const imageURL = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    if (frndName.current.value !== '' && imageURL.current.value !== '') {
      const id = crypto.randomUUID(); // generates random id in web browser
      const newFriend = {
        id: id,
        name: frndName.current.value,
        image: `${imageURL.current.value}?=${id}`,
        balance: 0,
      };
      onAddFriend(newFriend);
      frndName.current.value = '';
      // console.log(newFriend);
    }
    return;
  }

  return (
    <form className='form-add-friend' onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input ref={frndName} type='text' />
      <label>📷Image URL</label>
      <input
        ref={imageURL}
        type='text'
        readOnly
        value='https://i.pravatar.cc/48'
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className='form-split-bill'>
      <h2>Split a bill with Jane</h2>
      <label>💰Bill value</label>
      <input type='text' />
      <label>🧍‍♂️Your expense</label>
      <input type='text' />
      <label>🧑‍🤝‍🧑X's expense</label>
      <input type='text' disabled />
      <label>🤔Who is paying the bill</label>
      <select>
        <option value='user'>You</option>
        <option value='friend'>X</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
