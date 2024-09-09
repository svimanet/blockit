const list = '123'.split('');

const thing = list.some((item) => {
  console.log(item);
  console.log('after');
  return list.some((item) => {
    if (item === '2') {
      console.log('found');
      return true;
    }
  });
});
console.log(thing);