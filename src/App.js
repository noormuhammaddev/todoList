import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './App.scss';
import _ from 'lodash';
import {v4} from "uuid";


const item = {
  id: v4(),
  name: "first name"
}

const item2 = {
  id: v4(),
  name: "second item name"
}

function App() {
  const [text, setText] = useState();

  const [state, setState] = useState({
    "todo": {
      title: "To Do",
      items: [item, item2]
    },
    "in-progress": {
      title: "In Progress",
      items: []
    },
    "done": {
      title: "Done",
      items: []
    },
  });

  const [todo, setTodo] = useState([])
  const [inProgress, setInProgress] = useState([])

  const handleDragEnd = ({destination, source}) => {
    if(!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // creating a copy of items before remoing it from state
    const itemCopy = {...state[source.droppableId].items[source.index]}
    setState(prev => {
      prev = {...prev}

      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1)

      // adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })

  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: 'title',
          items: [
            {
              id: v4(),
              name: text
            },
            ...prev.todo.items
          ]
        }
      }
    })

    setText("")
  }

  return (
    <div className="todo-app">
      {/* <TodoList /> */}
      <div className="todo-form">
        <input 
          type="text" 
          placeholder="Add a todo item" 
          value={text} 
          name="text" 
          className="text-control" 
          onChange = {e => setText(e.target.value)}
        />

        <button className="button" onClick={addItem}>Add todo</button>
      </div>
      
      <div className="col-wrapper">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className="column">
                <h4>{data.title}</h4>

                <Droppable droppableId={key}>
                {(provided) => {
                  return(
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"droppable-col"}
                    >
                      {data.items.map((el, index) => {
                        return(
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided) => {
                              return(
                                <div
                                  className="list-item"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {el.name}
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
