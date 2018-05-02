const today = new Date();

export const dummyList = {
  id: '1vcszko2',
  title: 'Groceries - ' + today.getDate() + "/" + parseInt(today.getMonth()+1) +"/"+ today.getFullYear(),
  items: [
    {
      label: 'Bread',
      quantity: '1',
      isSelected: false
    },
    {
      label: 'Milk',
      quantity: '1',
      isSelected: false
    },
    {
      label: 'Chicken',
      quantity: '2',
      isSelected: false
    }
  ]
};
