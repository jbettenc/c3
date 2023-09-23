import { useDropzone } from "react-dropzone";
import Button from "../ui/forms/Button";
import UploadIcon from "../,./../assets/upload.svg";
import Image from "next/image";

interface FileDropzoneProps {
  importState?: File[];
  handleImportState: (state: File[]) => void;
}

function FileDropzone(props: FileDropzoneProps) {
  const { importState, handleImportState } = props;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [".png"], "image/jpeg": [".jpg,", ".jpeg"] },
    maxFiles: 5,
    onDrop: async (acceptedFiles: File[], fileRejections, event) => {
      handleImportState(importState ? importState.concat(acceptedFiles).slice(0, 5) : acceptedFiles);
    }
  });

  return (
    <>
      <div className="mt-4 w-full">
        <div
          {...getRootProps()}
          className={`w-full rounded-lg focus:outline-none flex flex-col justify-center ${
            isDragActive && "bg-gray-800"
          } `}
        >
          <input {...getInputProps()} />
          {importState && importState.length > 0 ? (
            <div className="flex flex-wrap mx-4 gap-2 mb-4">
              {importState.map((file) => (
                <div className="">
                  <img className="w-full h-auto" src={URL.createObjectURL(file)} alt="Image" />
                </div>
              ))}
              <div className="flex flex-col border border-gray-100 border-dashed rounded-md px-2">
                <div className="mt-2 select-none mx-auto">Drag and drop a file here</div>
                <span className="mx-auto m-2">
                  <Button stopPropagation={false}>Upload</Button>
                </span>
              </div>
            </div>
          ) : null}
          {!importState || importState.length === 0 ? (
            <>
              <div className="mx-auto mt-4">
                <Image src={UploadIcon} alt="Upload" />
              </div>
              <div className="mt-4 select-none mx-auto">Drag and drop a file here</div>
              <span className="mx-auto mt-4 mb-8">
                <Button stopPropagation={false}>Upload</Button>
              </span>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default FileDropzone;
