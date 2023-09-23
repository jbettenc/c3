interface CustomProps {
  children: JSX.Element | JSX.Element[];
}

function Custom(props: CustomProps) {
  const { children } = props;

  return children;
}

export default Custom;
