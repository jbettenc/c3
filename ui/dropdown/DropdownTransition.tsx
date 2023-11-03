import Transition from "@/ui/Transition";

interface DropdownTransitionProps {
  className?: string;
  show: boolean;
  children?: JSX.Element;
}

function DropdownTransition({ className, show, children }: DropdownTransitionProps) {
  return (
    <Transition
      className={className}
      show={show}
      appear={true}
      unmountOnExit={false}
      enter="transition ease-out duration-200 transform"
      enterStart="opacity-0 -translate-y-2"
      enterEnd="opacity-100 translate-y-0"
      leave="transition ease-out duration-200"
      leaveStart="opacity-100"
      leaveEnd="opacity-0"
    >
      {children}
    </Transition>
  );
}

export default DropdownTransition;
