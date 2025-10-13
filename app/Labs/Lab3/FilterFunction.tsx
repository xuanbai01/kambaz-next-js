export default function FilterFunction() {
  const numberArray1 = [1, 2, 4, 5, 6];
  const numberArray2 = numberArray1.filter((a) => a > 3);
  const numberArray3 = numberArray1.filter((a) => a % 2 === 0);
  const numberArray4 = numberArray1.filter((a) => a % 2 !== 0);

  return (
    <div id="wd-filter-function">
      <h4>Filter Function</h4>
      numberArray1 = {numberArray1} <br />
      numberArray2 = {numberArray2} <br />
      numberArray3 = {numberArray3} <br />
      numberArray4 = {numberArray4} <hr />
    </div>
  );
}