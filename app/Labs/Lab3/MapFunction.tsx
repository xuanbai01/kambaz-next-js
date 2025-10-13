export default function MapFunction() {
  const numberArray1 = [1, 2, 3, 4, 5, 6];
  const square = (a: number) => a * a;
  const squares = numberArray1.map(square);
  const cubes = numberArray1.map(a => a * a * a);

  return (
    <div id="wd-map-function">
      <h4>Map Function</h4>
      squares = {squares} <br />
      cubes = {cubes} <br />
      Square of 4 = {square(4)} <hr />
      
      <h4>Map Function in JSX</h4>
      <ul>
        {numberArray1.map((number) => (
          <li key={number}>{square(number)}</li>
        ))}
      </ul> <hr />
    </div>
  );
}