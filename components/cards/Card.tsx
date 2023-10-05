interface CardProps {
  children: JSX.Element[] | JSX.Element;
  onClick?: (e: React.MouseEvent) => void;
}

function Card(props: CardProps) {
  const { children } = props;

  return (
    <div className="overflow-hidden rounded-lg w-[17.5rem] h-[23.125rem] cursor-pointer" onClick={props.onClick}>
      {children}
    </div>
  );
}

export default Card;
