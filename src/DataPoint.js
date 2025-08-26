export default function DataPoint(props) {
  return (
    <circle key={props.i} cx={props.cx} cy={props.cy} r="5" data={props.data} onClick={()=>{props.click(props.data)}}/>
  );
}