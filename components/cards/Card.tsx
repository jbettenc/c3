interface CardProps {
  children: JSX.Element[] | JSX.Element;
  onClick?: (e: React.MouseEvent) => void;
}

function Card(props: CardProps) {
  const { children } = props;

  return (
    <div
      className={`overflow-hidden rounded-lg w-full h-[23.125rem] ${props.onClick ? "cursor-pointer" : ""}`}
      onClick={props.onClick}
    >
      {children}
    </div>
  );
}

export default Card;
