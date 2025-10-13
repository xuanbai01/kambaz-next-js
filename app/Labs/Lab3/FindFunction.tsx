export default function FindFunction() {
  const numberArray1 = [1, 2, 3, 4, 5];
  const stringArray1 = ['string1', 'string2', 'string3'];

  const fourString = stringArray1.find((a) => a === 'string3');
  const four = numberArray1.find((a) => a === 4);
  const four2 = numberArray1.find((a) => a > 3);

  return (
    <div id="wd-find-function">
      <h4>Find Function</h4>
      four = {four} <br />
      four2 = {four2} <br />
      fourString = {fourString} <hr />
    </div>
  );
}