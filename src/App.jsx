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
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((prevState) => [...prevState, friend]);
    setAddFormOpen(false);
  }

  function handleSelectFriend(friend) {
    selectedFriend !== null
      ? setSelectedFriend((prevState) =>
          prevState.id === friend.id ? null : friend
        )
      : setSelectedFriend(friend);
    setAddFormOpen(false);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          friendList={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
        {isAddFormOpen && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={setAddFormOpen}>
          {isAddFormOpen ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

function FriendsList({ friendList, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friendList.map((f) => (
        <Friend
          friend={f}
          key={f.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  let isSelected;
  selectedFriend !== null
    ? (isSelected = selectedFriend.id === friend.id)
    : undefined;

  return (
    <li className={isSelected ? 'seleced' : ''}>
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
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
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

function FormSplitBill({ selectedFriend }) {
  const [bill, setBill] = useState('');
  const [whoIsPaying, setwhoIsPaying] = useState('user');
  const [yourExpense, setYourExpense] = useState();
  let friendExpense = '';
  friendExpense = bill > 0 ? bill - yourExpense : '';

  return (
    <form className='form-split-bill'>
      <h2>{`Split a bill with ${selectedFriend.name}`}</h2>
      <label>💰Bill value</label>
      <input
        type='number'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♂️Your expense</label>
      <input
        type='number'
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > bill ? yourExpense : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense</label>
      <input type='number' disabled value={friendExpense} />
      <label>🤔Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
