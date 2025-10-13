export default function AddingAndRemovingToFromArrays() {
  const numberArray1 = [1, 2, 3, 4, 5];
  const stringArray1 = ['string1', 'string2'];
  const todoArray = [<li key="0">Buy milk</li>, <li key="1">Feed the pets</li>];

  numberArray1.push(6); 
  stringArray1.push('string3');

  numberArray1.splice(2, 1);
  stringArray1.splice(1, 1);

  const stringArray2 = stringArray1.slice(1);
  const stringArray3 = stringArray1.slice(0, 1);

  const stringArray4 = stringArray1.slice(0, 1);

  const stringArray5 = stringArray1.slice(1);

  return (
    <div id="wd-adding-removing-from-arrays">
      <h4>Add/remove to/from arrays</h4>
      numberArray1 = {numberArray1} <br />
      stringArray1 = {stringArray1} <br />
      todoArray = {todoArray} <br />
      stringArray2 = {stringArray2} <br />
      stringArray3 = {stringArray3} <br />
      stringArray4 = {stringArray4} <br />
      stringArray5 = {stringArray5} <hr />
    </div>
  );
}