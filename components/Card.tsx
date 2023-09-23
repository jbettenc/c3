interface CardProps {
  expanded?: boolean;
  header: JSX.Element;
  body: JSX.Element;
}

function Card(props: CardProps) {
  return (
    <>
      <div className="flex flex-col border border-gray-200 rounded-md">
        <div className={`py-4 px-6 ${props.expanded ? "bg-gray-50 border-b border-gray-300" : ""}`}>{props.header}</div>
        {props.expanded ? <div>{props.body}</div> : null}
      </div>
    </>
  );
}

export default Card;
