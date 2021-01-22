import React from "react";
import Badge from "./Badge";
function AddButtonList({ badges, onAddCategory, isLoading }) {
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const [badgeActive, setBadgeActive] = React.useState(1);
  const handlerChangeTextArea = (event) => {
    setTextAreaValue(event.target.value);
  };
  const handleOnAddCategory = () => {
    if (!textAreaValue) {
      alert("Введите название списка");
      return;
    }
    const newObj = {
      title: textAreaValue,
      colorId: badgeActive,
      color: {
        hex: badges.find((color) => color.id === badgeActive).hex,
      },
      tasks: [],
    };
    onAddCategory(newObj);
    setTextAreaValue("");
    setBadgeActive(1);
  };

  const onBadgeClick = (index) => {
    setBadgeActive(index);
  };
  React.useEffect(() => {
    if (badges.length) {
      setBadgeActive(badges[0].id);
    }
  }, []);
  return (
    <div className='add_list'>
      <div className='add_list__popup'>
        <textarea
          type='text'
          onChange={handlerChangeTextArea}
          value={textAreaValue}
          placeholder='Название списка...'
        />
        <div className='add_list__colors'>
          {badges.map((obj) => (
            <Badge
              key={`${obj.hex}_${obj.id}`}
              onClick={onBadgeClick}
              className={badgeActive === obj.id ? "active" : ""}
              color={obj.hex}
              id={obj.id}
            />
          ))}
        </div>
        <button onClick={handleOnAddCategory} className='add_list__button__add'>
          {isLoading ? "Добавление..." : "Добавить"}
        </button>
      </div>
    </div>
  );
}

export default AddButtonList;
