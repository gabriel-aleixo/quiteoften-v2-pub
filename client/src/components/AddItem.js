import { useState } from 'react'
import React from 'react';

const AddItem = ({ onAdd, itemType }) => {

  const [description, setDescription] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    if (!description) {
      alert(`Please add a ${itemType} item`);
      return;
    }

    onAdd({ description});

    setDescription('');
  }

  return (
    <div className="block">
      <form  onSubmit={onSubmit}> 

            <div className="field has-addons"> 
              <div className="control is-expanded"> 
                <input
                  className = "input"
                  type="text"
                  placeholder="Add item"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="control">
                  <button type="submit" className="button is-primary is-outlined">Save</button>
              </div>

            </div>
      </form>
    </div>
  )
}

export default AddItem