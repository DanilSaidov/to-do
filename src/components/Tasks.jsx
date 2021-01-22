import axios from "axios";
import React from "react";

function Tasks({
  list,
  editTitle,
  emptyHide,
  onAddTask,
  checkboxClick,
  editTaskText,
  removeTask,
}) {
  const [toggleAddForm, setToggleAddForm] = React.useState(false);
  const [toggleEdit, setToggleEdit] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [changeInputValue, setChangeInputValue] = React.useState(false);
  const [isLoading, setIsloading] = React.useState(false);
  const handlerChangeInputValue = (event) => {
    const newChangeInputValue = event.target.value;
    setChangeInputValue(newChangeInputValue);
  };
  const handlerToggleEdit = (id, value, action, defaultValue) => {
    // const target = event.target.parentElement;
    // target.classList.toggle("active");
    if (action) {
      if (defaultValue !== value) {
        setChangeInputValue(false);
        setToggleEdit(false);
        axios
          .patch("http://localhost:3001/tasks/" + id, {
            text: value,
          })
          .then(({ data }) => {
            console.log(data);
            editTaskText(data.listId, data.id, data.text);
          });
        return;
      } else {
        setChangeInputValue(false);
        setToggleEdit(false);
        return;
      }
    }
    setChangeInputValue(value);
    setToggleEdit(id);
  };
  const handlerInputValue = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };
  const handlerAddTask = () => {
    setIsloading(true);
    if (inputValue) {
      const newTask = {
        listId: list.id,
        text: inputValue,
        completed: false,
      };
      axios
        .post("http://localhost:3001/tasks", newTask)
        .then(({ data }) => {
          setIsloading(true);
          onAddTask(list.id, data);
          handlerToggleAddForm();
        })
        .catch((error) => {
          alert("Не удалось добавить задание");
          console.log(error);
          setIsloading(false);
        })
        .finally(() => {
          setIsloading(false);
        });
    }
  };
  const handlerToggleAddForm = () => {
    setToggleAddForm(!toggleAddForm);
    setInputValue("");
  };
  const handlerEditTitle = () => {
    const newTitle = window.prompt("Новое название заголовка", list.title);
    if (newTitle && list.title !== newTitle) {
      editTitle(list.id, newTitle);
    }
  };
  const handlerToggleChekbox = (id, state) => {
    console.log(id, !state);
    axios
      .patch("http://localhost:3001/tasks/" + id, {
        completed: !state,
      })
      .then(() => {
        checkboxClick(id, !state);
      })
      .catch(() => {
        alert("Невозможно изменить");
      });
  };
  const handlerRemoveTask = (listId, id) => {
    if (window.confirm("Удалить задачу?")) {
      axios
        .delete("http://localhost:3001/tasks/" + id)
        .then(({ data }) => {
          removeTask(listId, id);
        })
        .catch((error) => {
          alert("Ошибка удаления");
        });
    }
  };
  return (
    <div className='tasks'>
      <h2 style={{ color: list.color.hex }} onClick={handlerEditTitle}>
        {list.title}
        <span>
          <svg
            width='12'
            height='12'
            viewBox='0 0 15 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M0 12.0504V14.5834C0 14.8167 0.183308 15 0.41661 15H2.9496C3.05792 15 3.16624 14.9583 3.24123 14.875L12.34 5.78458L9.21542 2.66001L0.124983 11.7504C0.0416611 11.8338 0 11.9337 0 12.0504ZM14.7563 3.36825C14.8336 3.29116 14.8949 3.1996 14.9367 3.0988C14.9785 2.99801 15 2.88995 15 2.78083C15 2.6717 14.9785 2.56365 14.9367 2.46285C14.8949 2.36205 14.8336 2.27049 14.7563 2.19341L12.8066 0.24367C12.7295 0.166428 12.638 0.105146 12.5372 0.0633343C12.4364 0.021522 12.3283 0 12.2192 0C12.1101 0 12.002 0.021522 11.9012 0.0633343C11.8004 0.105146 11.7088 0.166428 11.6318 0.24367L10.107 1.76846L13.2315 4.89304L14.7563 3.36825V3.36825Z'
              fill='#868585'
            />
          </svg>
        </span>
      </h2>
      <div className='tasks__outer'>
        {list.tasks && !list.tasks.length && !emptyHide && (
          <h3>Задачи отсутствуют </h3>
        )}
        {list.tasks &&
          list.tasks.map((obj) => (
            <div
              key={`task_${obj.id}_${obj.title}`}
              className='tasks__outer__item'>
              <div className='checkbox'>
                <input
                  type='checkbox'
                  id={`task-${obj.id}`}
                  checked={obj.completed}
                  onChange={() => handlerToggleChekbox(obj.id, obj.completed)}
                />
                <label htmlFor={`task-${obj.id}`}>
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 10 8'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </label>
              </div>
              <div className='tasks__outer__edit'>
                {toggleEdit === obj.id ? (
                  <div className='tasks__outer__edit__inner'>
                    <textarea
                      onChange={handlerChangeInputValue}
                      value={
                        changeInputValue !== false ? changeInputValue : obj.text
                      }
                      onKeyUp={(event) => {
                        if (event.key === "Enter") {
                          handlerToggleEdit(
                            obj.id,
                            changeInputValue,
                            true,
                            obj.text
                          );
                        }
                      }}
                    />
                    <svg
                      onClick={() =>
                        handlerToggleEdit(
                          obj.id,
                          changeInputValue,
                          true,
                          obj.text
                        )
                      }
                      x='0px'
                      y='0px'
                      width='31.879px'
                      height='31.879px'
                      viewBox='0 0 31.879 31.879'>
                      <path
                        d='M30.708,5.091c-1.511-1.511-4.146-1.511-5.656,0L11.877,18.265l-5.05-5.051c-1.513-1.513-4.146-1.511-5.657,0
				c-1.559,1.559-1.56,4.098,0,5.656l7.879,7.879c0.756,0.756,1.76,1.172,2.828,1.172c1.069,0,2.073-0.416,2.828-1.172l16.002-16
				c0.756-0.756,1.172-1.761,1.172-2.829C31.879,6.852,31.463,5.847,30.708,5.091z M29.293,9.335l-16.002,16
				c-0.756,0.756-2.072,0.756-2.828,0l-7.879-7.878c-0.779-0.78-0.779-2.049,0-2.829c0.378-0.378,0.88-0.586,1.415-0.586
				c0.534,0,1.036,0.208,1.414,0.586l5.757,5.757c0.391,0.392,1.023,0.392,1.414,0L26.463,6.506c0.756-0.756,2.074-0.756,2.83,0
				c0.377,0.377,0.586,0.88,0.586,1.414S29.67,8.957,29.293,9.335z'
                      />
                    </svg>
                    <svg
                      onClick={() => {
                        handlerToggleEdit(obj.id, obj.text, true, obj.text);
                      }}
                      width='25'
                      height='25'
                      viewBox='0 0 21 21'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M20.63 10.315C20.63 10.2335 20.6291 10.1523 20.6272 10.0712C20.4972 4.49574 15.9212 0 10.315 0C4.62737 0 0 4.62737 0 10.315C0 15.9721 4.57776 20.5802 10.2234 20.6296C10.2539 20.6299 10.2844 20.63 10.315 20.63C10.3456 20.63 10.3761 20.6299 10.4066 20.6296C16.0522 20.5802 20.63 15.9721 20.63 10.315ZM14.2303 13.1855C14.1879 13.0885 14.1265 13.0009 14.0497 12.928L11.4373 10.315L14.0497 7.70203C14.1922 7.55202 14.2705 7.35226 14.2679 7.14536C14.2652 6.93846 14.1819 6.74077 14.0355 6.59446C13.8892 6.44814 13.6915 6.36477 13.4846 6.36212C13.2777 6.35947 13.078 6.43775 12.928 6.58028L10.315 9.19275L7.70203 6.58028C7.55202 6.43775 7.35226 6.35947 7.14536 6.36212C6.93846 6.36477 6.74077 6.44814 6.59446 6.59446C6.44814 6.74077 6.36477 6.93846 6.36212 7.14536C6.35947 7.35226 6.43775 7.55202 6.58028 7.70203L9.19275 10.315L6.58028 12.928C6.43775 13.078 6.35947 13.2777 6.36212 13.4846C6.36477 13.6915 6.44814 13.8892 6.59446 14.0355C6.74077 14.1819 6.93846 14.2652 7.14536 14.2679C7.35226 14.2705 7.55202 14.1922 7.70203 14.0497L10.315 11.4373L12.928 14.0497C13.0009 14.1265 13.0885 14.1879 13.1855 14.2303C13.2826 14.2727 13.3872 14.2952 13.4931 14.2966C13.599 14.298 13.7041 14.2781 13.8022 14.2382C13.9003 14.1983 13.9894 14.1392 14.0643 14.0643C14.1392 13.9894 14.1983 13.9003 14.2382 13.8022C14.2781 13.7041 14.298 13.599 14.2966 13.4931C14.2953 13.3872 14.2727 13.2826 14.2303 13.1855Z'
                        fill='#ccc'
                      />
                    </svg>
                  </div>
                ) : (
                  <div className='tasks__outer__edit__inner'>
                    <p>{obj.text}</p>
                    <svg
                      onClick={() => handlerToggleEdit(obj.id, obj.text)}
                      width='15'
                      height='15'
                      viewBox='0 0 15 15'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M0 12.0504V14.5834C0 14.8167 0.183308 15 0.41661 15H2.9496C3.05792 15 3.16624 14.9583 3.24123 14.875L12.34 5.78458L9.21542 2.66001L0.124983 11.7504C0.0416611 11.8338 0 11.9337 0 12.0504ZM14.7563 3.36825C14.8336 3.29116 14.8949 3.1996 14.9367 3.0988C14.9785 2.99801 15 2.88995 15 2.78083C15 2.6717 14.9785 2.56365 14.9367 2.46285C14.8949 2.36205 14.8336 2.27049 14.7563 2.19341L12.8066 0.24367C12.7295 0.166428 12.638 0.105146 12.5372 0.0633343C12.4364 0.021522 12.3283 0 12.2192 0C12.1101 0 12.002 0.021522 11.9012 0.0633343C11.8004 0.105146 11.7088 0.166428 11.6318 0.24367L10.107 1.76846L13.2315 4.89304L14.7563 3.36825V3.36825Z'
                        fill='black'
                      />
                    </svg>
                    <svg
                      onClick={() => {
                        handlerRemoveTask(list.id, obj.id);
                      }}
                      width='25'
                      height='25'
                      viewBox='0 0 21 21'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M20.63 10.315C20.63 10.2335 20.6291 10.1523 20.6272 10.0712C20.4972 4.49574 15.9212 0 10.315 0C4.62737 0 0 4.62737 0 10.315C0 15.9721 4.57776 20.5802 10.2234 20.6296C10.2539 20.6299 10.2844 20.63 10.315 20.63C10.3456 20.63 10.3761 20.6299 10.4066 20.6296C16.0522 20.5802 20.63 15.9721 20.63 10.315ZM14.2303 13.1855C14.1879 13.0885 14.1265 13.0009 14.0497 12.928L11.4373 10.315L14.0497 7.70203C14.1922 7.55202 14.2705 7.35226 14.2679 7.14536C14.2652 6.93846 14.1819 6.74077 14.0355 6.59446C13.8892 6.44814 13.6915 6.36477 13.4846 6.36212C13.2777 6.35947 13.078 6.43775 12.928 6.58028L10.315 9.19275L7.70203 6.58028C7.55202 6.43775 7.35226 6.35947 7.14536 6.36212C6.93846 6.36477 6.74077 6.44814 6.59446 6.59446C6.44814 6.74077 6.36477 6.93846 6.36212 7.14536C6.35947 7.35226 6.43775 7.55202 6.58028 7.70203L9.19275 10.315L6.58028 12.928C6.43775 13.078 6.35947 13.2777 6.36212 13.4846C6.36477 13.6915 6.44814 13.8892 6.59446 14.0355C6.74077 14.1819 6.93846 14.2652 7.14536 14.2679C7.35226 14.2705 7.55202 14.1922 7.70203 14.0497L10.315 11.4373L12.928 14.0497C13.0009 14.1265 13.0885 14.1879 13.1855 14.2303C13.2826 14.2727 13.3872 14.2952 13.4931 14.2966C13.599 14.298 13.7041 14.2781 13.8022 14.2382C13.9003 14.1983 13.9894 14.1392 14.0643 14.0643C14.1392 13.9894 14.1983 13.9003 14.2382 13.8022C14.2781 13.7041 14.298 13.599 14.2966 13.4931C14.2953 13.3872 14.2727 13.2826 14.2303 13.1855Z'
                        fill='#ccc'
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div className='tasks__outer__form'>
          {!toggleAddForm ? (
            <div
              onClick={handlerToggleAddForm}
              className='tasks__outer__form__add'>
              <i>
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
              </i>

              <span>Новая задача</span>
            </div>
          ) : (
            <div className='tasks__outer__form__input'>
              <textarea value={inputValue} onChange={handlerInputValue} />
              <div className='tasks__outer__form__buttons'>
                <button
                  disabled={isLoading}
                  className='add'
                  onClick={handlerAddTask}>
                  {isLoading ? "Добавление..." : "Добавить"}
                </button>
                <button onClick={handlerToggleAddForm} className='cancel'>
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
