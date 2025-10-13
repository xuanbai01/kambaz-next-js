export default function SimpleArrays() {
  const functionScoped = 2;
  const blockScoped = 5;

  const numberArray1 = [1, 2, 3, 4, 5];
  const stringArray1 = ['string1', 'string2'];
  const htmlArray1 = [<li key="0">Buy milk</li>, <li key="1">Feed the pets</li>];
  const variableArray1 = [
    functionScoped, blockScoped,
    numberArray1, stringArray1
  ];

  return (
    <div id="wd-simple-arrays">
      <h4>Simple Arrays</h4>
      numberArray1 = {numberArray1} <br />
      stringArray1 = {stringArray1} <br />
      htmlArray1 = <ol>{htmlArray1}</ol>
      variableArray1 = {variableArray1} <hr />
    </div>
  );
}