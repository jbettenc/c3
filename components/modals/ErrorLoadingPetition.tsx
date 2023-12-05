import Button from "@/ui/forms/Button";
import { WarningIcon } from "../icons/WarningIcon";
import Link from "next/link";

interface ErrorLoadingPetitionProps {}

function ErrorLoadingPetition(props: ErrorLoadingPetitionProps) {
  return (
    <>
      <div className="flex flex-col p-8 gap-4">
        <WarningIcon className="mx-auto" />
        <div className="text-lg font-medium text-center">Error Loading Petition</div>
        <div className="text-sm text-center">
          We were unable to load details for this petition. If it was recently created or you believe this was in error,
          please wait a moment and refresh the page. Otherwise, please return home.
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between">
          <Link href="/" className="w-full sm:w-[48%]">
            <Button className="w-full" style="secondary" stopPropagation={false}>
              Return Home
            </Button>
          </Link>
          <Button
            className="w-full sm:w-[48%]"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>
    </>
  );
}

export default ErrorLoadingPetition;
