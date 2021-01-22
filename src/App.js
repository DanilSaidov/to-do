import React from "react";
import axios from "axios";
import { CategoryList, AddButtonList, Tasks } from "./components";
// не появляются иконки
function App() {
  const [categories, setCategories] = React.useState([]);
  const [colors, setColors] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [catActive, setCatActive] = React.useState(false);
  const [addBtnActive, setAddBtnActive] = React.useState(false);
  const onEditTaskText = (listId, id, text) => {
    const newCategories = categories.map((obj) => {
      if (obj.id === listId) {
        obj.tasks.map((task) => {
          if (task.id === id) {
            task.text = text;
          }
          return task;
        });
      }
      return obj;
    });
    setCategories(newCategories);
  };
  const onEditTaskTitle = (id, title) => {
    const newTask = categories.map((obj) => {
      if (obj.id === id) {
        obj.title = title;
      }
      return obj;
    });
    axios
      .patch("http://localhost:3001/lists/" + id, {
        title: title,
      })
      .catch(() => {
        alert("Не удалось изменить название");
      });
    setCategories(newTask);
  };

  const setCategoriesClick = (object) => {
    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        title: object.title,
        colorId: object.colorId,
        tasks: [],
      })
      .then(({ data }) => {
        setCategories([...categories, { ...data, color: object.color }]);
      })
      .finally(() => {
        setAddBtnActive(false);
        setIsLoading(true);
      });
  };
  const setNewTaskClick = (id, newObj) => {
    const newCategories = categories.map((obj) => {
      if (obj.id === id) {
        obj.tasks = [...obj.tasks, newObj];
      }
      return obj;
    });
    setCategories(newCategories);
  };

  const onCategoryClick = (idx) => {
    const newActiveCategory = categories.find((obj) => obj.id === idx);
    setCatActive(newActiveCategory);
  };

  const onBtnAtiveClick = () => {
    setAddBtnActive(!addBtnActive);
  };
  const onRemoveClick = (idx) => {
    if (window.confirm("Удалить список задач?")) {
      const newCategories = categories.filter((obj) => obj.id !== idx);
      axios.delete("http://localhost:3001/lists/" + idx).then(() => {
        setCategories(newCategories);
        setCatActive(false);
      });
    }
  };
  const onCheckboxClick = (id, state) => {
    const newCategories = categories.map((obj) => {
      if (obj.tasks.find((item) => item.id === id)) {
        obj.tasks.map((task) => {
          if (task.id === id) {
            task.completed = state;
          }
          return task;
        });
      }
      return obj;
    });
    setCategories(newCategories);
  };
  const onRemoveTaskClick = (listId, id) => {
    const newCategories = categories.map((obj) => {
      if (obj.id === listId) {
        obj.tasks = obj.tasks.filter((task) => task.id !== id);
      }
      return obj;
    });
    setCategories(newCategories);
  };
  React.useEffect(() => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setCategories(data);
      });
    axios
      .get("http://localhost:3001/colors")
      .then(({ data }) => setColors(data));
  }, []);

  return (
    <div className='todo'>
      <div className='todo__sidebar'>
        <ul className='todo__list'>
          <CategoryList
            text='Все задачи'
            categoryClick={onCategoryClick}
            type={"allTask"}
            className={!catActive ? "todo__list__active" : ""}
            id={0}
            image={
              <svg
                width='25'
                height='25'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M12.96 8.10001H7.74001C7.24321 8.10001 7.20001 8.50231 7.20001 9.00001C7.20001 9.49771 7.24321 9.90001 7.74001 9.90001H12.96C13.4568 9.90001 13.5 9.49771 13.5 9.00001C13.5 8.50231 13.4568 8.10001 12.96 8.10001V8.10001ZM14.76 12.6H7.74001C7.24321 12.6 7.20001 13.0023 7.20001 13.5C7.20001 13.9977 7.24321 14.4 7.74001 14.4H14.76C15.2568 14.4 15.3 13.9977 15.3 13.5C15.3 13.0023 15.2568 12.6 14.76 12.6ZM7.74001 5.40001H14.76C15.2568 5.40001 15.3 4.99771 15.3 4.50001C15.3 4.00231 15.2568 3.60001 14.76 3.60001H7.74001C7.24321 3.60001 7.20001 4.00231 7.20001 4.50001C7.20001 4.99771 7.24321 5.40001 7.74001 5.40001ZM4.86001 8.10001H3.24001C2.74321 8.10001 2.70001 8.50231 2.70001 9.00001C2.70001 9.49771 2.74321 9.90001 3.24001 9.90001H4.86001C5.35681 9.90001 5.40001 9.49771 5.40001 9.00001C5.40001 8.50231 5.35681 8.10001 4.86001 8.10001ZM4.86001 12.6H3.24001C2.74321 12.6 2.70001 13.0023 2.70001 13.5C2.70001 13.9977 2.74321 14.4 3.24001 14.4H4.86001C5.35681 14.4 5.40001 13.9977 5.40001 13.5C5.40001 13.0023 5.35681 12.6 4.86001 12.6ZM4.86001 3.60001H3.24001C2.74321 3.60001 2.70001 4.00231 2.70001 4.50001C2.70001 4.99771 2.74321 5.40001 3.24001 5.40001H4.86001C5.35681 5.40001 5.40001 4.99771 5.40001 4.50001C5.40001 4.00231 5.35681 3.60001 4.86001 3.60001Z'
                  fill='#ccc'
                />
              </svg>
            }
          />
          {categories.map((obj, index) => (
            <CategoryList
              key={`${obj.title}_${index}`}
              text={obj.title}
              color={obj.color ? obj.color.hex : ""}
              image={obj.image}
              categoryClick={onCategoryClick}
              removeClick={onRemoveClick}
              id={obj.id}
              type={obj.type}
              col={obj.tasks && obj.tasks.length}
              className={
                catActive && catActive.id === obj.id ? "todo__list__active" : ""
              }
              isRemovable={
                catActive && catActive.id === obj.id && obj.type !== "allTask"
              }
            />
          ))}
          <CategoryList
            text='Создать папку'
            categoryClick={onBtnAtiveClick}
            type={"addFolder"}
            image={
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M8 1V15'
                  stroke='black'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M1 8H15'
                  stroke='black'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            }
          />
        </ul>
        {addBtnActive && (
          <AddButtonList
            onAddCategory={setCategoriesClick}
            isLoading={isLoading}
            badges={colors}
          />
        )}
      </div>
      <div className='todo__tasks'>
        {catActive ? (
          <Tasks
            onAddTask={setNewTaskClick}
            list={catActive}
            editTitle={onEditTaskTitle}
            checkboxClick={onCheckboxClick}
            editTaskText={onEditTaskText}
            removeTask={onRemoveTaskClick}
          />
        ) : (
          categories.length > 0 &&
          categories.map((obj, index) => (
            <Tasks
              key={`task__${obj.id}__${index}`}
              list={obj}
              editTitle={onEditTaskTitle}
              emptyHide
              onAddTask={setNewTaskClick}
              checkboxClick={onCheckboxClick}
              editTaskText={onEditTaskText}
              removeTask={onRemoveTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
