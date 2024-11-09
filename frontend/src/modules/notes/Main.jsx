import React, { useState } from 'react'
import NotesTab from './notes-tab/Main'
import TodosTab from './todos-tab/Main'

function Main() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['My Notes', 'Todo']
  const tabContent = [<NotesTab key={1} />, <TodosTab key={2} />]

  return (
    <div className='container-1'>
      <div className='flex justify-between items-center'>
        <div>
          {tabs.map((tab, index) => 
            <button 
              className='btn-4'
              key={tab}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          )}
        </div>

        <input type="text" />
      </div>
      
      {tabContent[activeTab]}
    </div>
  )
}

export default Main
