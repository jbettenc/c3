import Button from "@/ui/forms/Button";

interface ConfirmViewProps {
  title?: string;
  subtitle?: string;
  yesButtonText?: string;
  yesButtonCallback?: () => void;
  noButtonText?: string;
  noButtonCallback?: () => void;
}

function ConfirmView(props: ConfirmViewProps) {
  const { title, subtitle, yesButtonText, yesButtonCallback, noButtonText, noButtonCallback } = props;

  return (
    <div className="flex flex-col p-8">
      <div className="text-center text-2xl font-poppins font-bold opacity-80 leading-6">{title ?? "Error"}</div>
      {subtitle ? (
        <div className="text-center text-sm	font-poppins font-semibold opacity-50 mt-2">{subtitle}</div>
      ) : null}
      {noButtonCallback || yesButtonCallback ? (
        <div className="w-full mt-4 gap-4 flex flex-col md:flex-row">
          {yesButtonCallback ? (
            <Button
              className={`w-full ${!noButtonCallback ? " md:w-auto md:px-16 mx-auto" : ""} py-3`}
              onClick={yesButtonCallback}
              customSizing={true}
            >
              {yesButtonText ?? "Yes"}
            </Button>
          ) : null}
          {noButtonCallback ? (
            <Button
              className={`w-full${
                !yesButtonCallback ? " md:w-auto md:px-16 mx-auto" : ""
              } py-3 text-blue-300 border-blue-300`}
              style="secondary"
              onClick={noButtonCallback}
              customSizing={true}
            >
              {noButtonText ?? "No"}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default ConfirmView;
