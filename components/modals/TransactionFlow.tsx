import SuccessIcon from "../../assets/success.svg";
import AlertIcon from "../../assets/alert.svg";
import Image from "next/image";
import Button from "@/ui/forms/Button";

interface TransactionFlowProps {
  loading?: boolean;
  success?: boolean;
  title?: string;
  subtitle?: string;
  closeButtonCallback?: (e: React.MouseEvent) => void;
  closeButtonText?: string;
  okButtonCallback?: (e: React.MouseEvent) => void;
  okButtonText?: string;
  customBody?: JSX.Element;
}

function TransactionFlow(props: TransactionFlowProps) {
  const {
    loading,
    title,
    subtitle,
    success,
    closeButtonCallback,
    closeButtonText,
    okButtonCallback,
    okButtonText,
    customBody
  } = props;
  if (loading) {
    return (
      <div className="flex flex-col p-8">
        <div role="status" className="mx-auto">
          <svg
            className="inline w-24 h-24 text-gray-200 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#C9AEFB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#6C66E9"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
        {title ? (
          <div className="mt-4 text-center text-2xl font-poppins font-bold opacity-80">{title ?? "Processing..."}</div>
        ) : null}
        {subtitle ? (
          <div className="text-center text-sm	font-poppins font-semibold opacity-50 mt-2">
            {subtitle ?? "Transaction pending..."}
          </div>
        ) : null}
      </div>
    );
  } else if (success) {
    return (
      <div className="flex flex-col p-8">
        <div role="status" className="mx-auto">
          <Image className="w-24 h-24 mb-4" src={SuccessIcon} alt="Success" />
          <span className="sr-only">Success</span>
        </div>
        <div className="text-center text-2xl font-poppins font-bold opacity-80">{title ?? "Success"}</div>
        {subtitle ? (
          <div className="text-center text-sm font-poppins font-semibold opacity-50 mt-2">{subtitle}</div>
        ) : null}
        {customBody ? customBody : null}
        {closeButtonCallback ? (
          <div className="mx-auto mt-4">
            <Button className="w-full md:w-auto md:px-16 py-3" onClick={closeButtonCallback} customSizing={true}>
              {closeButtonText ?? "Close"}
            </Button>
          </div>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col p-8">
        <div role="status" className="mx-auto">
          <Image className="w-24 h-24 mb-4" src={AlertIcon} alt="Alert" />
          <span className="sr-only">Error</span>
        </div>
        <div className="text-center text-2xl font-poppins font-bold opacity-80 leading-6">{title ?? "Error"}</div>
        {subtitle ? (
          <div className="text-center text-sm	font-poppins font-semibold opacity-50 mt-2">{subtitle}</div>
        ) : null}
        {closeButtonCallback || okButtonCallback ? (
          <div className="w-full mt-4 gap-4 flex flex-col-reverse md:flex-row">
            {closeButtonCallback ? (
              <Button
                className={`w-full${
                  !okButtonCallback ? " md:w-auto md:px-16 mx-auto" : ""
                } py-3 text-blue-300 border-blue-300`}
                style="secondary"
                onClick={closeButtonCallback}
                customSizing={true}
              >
                {closeButtonText ?? "Close"}
              </Button>
            ) : null}
            {okButtonCallback ? (
              <Button
                className={`w-full ${!closeButtonCallback ? " md:w-auto md:px-16 mx-auto" : ""} py-3`}
                onClick={okButtonCallback}
                customSizing={true}
              >
                {okButtonText ?? "Ok"}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default TransactionFlow;
