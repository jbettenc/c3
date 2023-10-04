import { useDropzone } from "react-dropzone";
import Button from "../ui/forms/Button";
import UploadIcon from "../,./../assets/upload.svg";
import { UploadIcon as UploadIconComponent } from "./icons/UploadIcon";
import Image from "next/image";
import { CloseIcon } from "./icons/CloseIcon";

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
            <div className="flex flex-wrap mx-4 gap-2 mb-4 rounded-lg bg-transparent">
              <div className="flex flex-col border border-gray-100 border-dashed rounded-md px-2 text-gray-500">
                <div className="my-auto flex flex-col">
                  <UploadIconComponent className="mx-auto" />
                  <div className="mt-2 select-none mx-auto px-2">
                    <span className="text-primary-700 font-medium cursor-pointer">Click to upload</span> or drag and
                    drop
                  </div>
                  <div className="select-none mx-auto px-2">SVG, PNG, JPG or GIF</div>
                </div>
              </div>
              {importState.map((file, idx) => (
                <div className="relative" key={`importState-${idx}`}>
                  <div
                    className={`overflow-hidden relative w-36 h-36 rounded-lg flex border border-gray-300`}
                    // style={props.style}
                  >
                    <img className="w-full h-auto my-auto" src={URL.createObjectURL(file)} alt="Image" />
                  </div>
                  <div
                    className={`absolute bg-red-100 w-4 h-4 rounded-full flex items-center justify-center -right-2 -top-2 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const tmpImportState = [...importState];
                      tmpImportState.splice(idx, 1);
                      handleImportState(tmpImportState);
                    }}
                  >
                    <CloseIcon className="w-2 h-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {!importState || importState.length === 0 ? (
            <>
              <div className="mx-auto mt-12">
                <Image src={UploadIcon} alt="Upload" />
              </div>
              <div className="mt-4 select-none mx-auto font-medium font-gray-600">
                Drag & drop files or <span className="text-primary-900 font-medium cursor-pointer">Browse</span>
              </div>
              <div className="select-none mx-auto px-2 text-gray-400 mb-16">SVG, PNG, JPG or GIF</div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default FileDropzone;
