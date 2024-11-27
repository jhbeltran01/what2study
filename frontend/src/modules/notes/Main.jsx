import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import { useDispatch, useSelector } from 'react-redux';
import { setNotes } from '@redux/notes';
import NotesTabContent from './notes-tab/Main';
import TodosTabContent from './todos-tab/Main';

export const ShowFormContext = createContext();

function NotesTab() {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    axios
      .get(`${apiRootURL}/notes/`)
      .then((response) => {
        dispatch(setNotes(response.data.results));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  const tab = [<NotesTabContent key={1} />, <TodosTabContent key={2} />][activeTab];

  return (
    <ShowFormContext.Provider value={[showForm, setShowForm]}>
      <div className="container-1">
        <div className="btn-4-container">
          <button
            className={`btn-4 ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            Notes
          </button>
          <button
            className={`btn-4 ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            To-Do
          </button>
        </div>

        {tab}

        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  );
}

export default NotesTab;
