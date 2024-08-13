"use client";

import { Cloud, File, FileText, Plus } from "lucide-react";
import { PdfCard } from "../courses/pdfCards";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import { Header } from "./header";
import { ChatScreen } from "@/components/ChatScreen";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Dropzone from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { DEMOPDFTYPE, PDFTYPE } from "@/types";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { DemoPdfCard } from "../courses/demoPdfCards";

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const UploadDropzone = ({
  fetchPdfData,
  setOpen,
}: {
  fetchPdfData: () => Promise<void>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("pdfUploader");

  const startSimulatedProgrss = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((preProgress) => {
        if (preProgress >= 95) {
          clearInterval(interval);
          return preProgress;
        }
        return preProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

       try {
        const progressInterval = startSimulatedProgrss();
        // handleFile Upload
        const uploadthingRes = await startUpload(acceptedFile);
        if (!uploadthingRes) {
          toast.error("something went wrong, please try again later");
          return;
        }

        const [fileResponse] = uploadthingRes;
        const key = fileResponse.key;

        if (!key) {
          toast.error("something went wrong, please try again later");
          return;
        }

        const data = new FormData();
        data.set("file", acceptedFile[0]);

        const res = await axios.post("/api/upload", data);
        console.log(res.data.thread_id, res.data.fileName, "res");
        // pass pdf url as well in future
        const res2 = await axios.post("/api/chat/pdf/newchat", {
          threadId: res.data.thread_id,
          name: res.data.fileName,
          key: key,
        });
        console.log(res2.data);
        clearInterval(progressInterval);
        setUploadProgress(100);
        toast.success("Upload successful")
        await fetchPdfData();

        setOpen(false);
       } catch (error) {
        console.error("something went wrong: ", error);
        toast.error("something went wrong");
       }finally{
        setIsUploading(false);
       }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-lg border border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className=" flex flex-col items-center justify-center pb-6 pt-5">
                <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-sm text-zinc-500">PDF</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              ) : null}
            </label>
            <input {...getInputProps()} />
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const dataPdfLinks: DEMOPDFTYPE[] = [
  {
    id: 5,
    name: "Electricity",
    key: "605e211b-4291-4f35-8304-9e92c8107117-rlnq9b.pdf",
  },
  {
    id: 7,
    name: "How do Organisms Reproduce",
    key: "11478608-0e22-47d1-a309-82abd41f4bdb-pjv2jb.pdf",
  },
  {
    id: 8,
    name: "Magnetic Effects of Electric Current",
    key: "b7750360-139f-4ae2-9fdc-c7461a888d1c-kqpdut.pdf",
  },
  {
    id: 9,
    name: "Control and Coordination",
    key: "dc1be191-bb5f-46c6-9c7e-c8da8d8e3afb-pd16c9.pdf",
  },
  {
    id: 10,
    name: "Our Environment",
    key: "2ae99598-6f32-4e22-ae75-f29ec0b8d415-zhr11b.pdf",
  },
  {
    id: 11,
    name: "Cost Accounting in Government",
    key: "ea7ef057-ce1a-4a2f-9a71-4fdf90598664-xwat0s.pdf",
  },
  {
    id: 12,
    name: "Introduction to Micro Economics",
    key: "6906ef0a-7c01-453b-9262-b0dbce7db857-p3xzlp.pdf",
  },
  {
    id: 13,
    name: "Understanding Company Law.pdf",
    key: "7931be1d-8110-41db-9b57-43e9fcef3234-vg3vvn.pdf",
  },
];

const LearnPage = () => {
  const [selected, setSelected] = useState<PDFTYPE | null | undefined>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [pdfs, setPdfs] = useState<PDFTYPE[] | []>([]);
  const [pdfLinks, setPdfLinks] = useState<DEMOPDFTYPE[] | []>(dataPdfLinks);
  const [newUdpateId, setNewUpdateId] = useState<null | number>(null);
  const onClick = (id: number) => {
    setSelected(pdfs.find((pdf) => pdf.id === id));
  };

  const addDemoPdf = async (key: string, path: string) => {
    const tid = toast.loading('uploading pdf...')
    console.log(path, "filePath", "ANDD", key);

    const response = await fetch(`/pdf/${path}.pdf`);
    if (!response.ok) {
      console.log("ERROR at res", response);
      toast.dismiss(tid);
      toast.error("something went wrong");
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const blob = await response.blob();

    const data = new FormData();
    data.append("file", blob, `${path}.pdf`);

    const res = await axios.post("/api/upload/demo-pdf", data);

    console.log(res.data.thread_id, res.data.fileName, res, "UploadRes");
    // pass pdf url as well in future
    const res2 = await axios.post("/api/chat/pdf/newchat", {
      threadId: res.data.thread_id,
      name: res.data.fileName,
      key: key,
    });
    
    await fetchPdfData();
    toast.dismiss(tid);
    setNewUpdateId(res2.data.message[0].id)
  };

  const fetchPdfData = async () => {
    const tid = toast.loading("loading data");
    const res = await axios.get("/api/chat/pdf");
    console.log(res.data, "fetchdata");
    if (res.data.success) {
      setPdfs([...res.data.data]);
    } else {
      toast.error("failed loading data");
    }
    toast.dismiss(tid);
  };

  useEffect(() => {
    setPdfLinks((prev) => 
      prev.filter(item => !pdfs.find(pdf => pdf.key === item.key))
    )
    if(newUdpateId){
      onClick(newUdpateId);
    }
  }, [pdfs, newUdpateId]);

  useEffect(() => {
    fetchPdfData();
  }, []);

  console.log(selected, "pdfs");

  return selected ? (
    <div className="flex h-full w-full flex-col">
      <Header title="Chat with PDF" setSelected={setSelected}  />
      <div className="flex h-full w-full justify-between py-5">
        <div className="w-3/5 rounded-lg bg-slate-100 scrollbar-thin scrollbar-track-border ">
          <PDFViewer pdf_url={`https://utfs.io/f/${selected.key}`} />
        </div>
        <div className="relative w-[39%] rounded-lg">
          <ChatScreen isPdfChat={true} thread_Id={selected.threadId} />
        </div>
      </div>
    </div>
  ) : (
    <div className="relative flex h-full w-full flex-col">
      <Header title="Select PDF" hideArrowBack={true} />
      <Button
        onClick={() => setOpen(true)}
        className="flex w-fit items-center space-x-2"
      >
        <span>Upload PDF</span>
        <Plus />
      </Button>
      <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
        {pdfLinks.map((pdf) => (
          <DemoPdfCard
            key={pdf.id}
            pdfKey={pdf.key}
            title={pdf.name}
            ImageIcon={FileText}
            id={pdf.id}
            onClick={addDemoPdf}
          />
        ))}
        {pdfs.map((pdf) => (
          <PdfCard
            key={pdf.id}
            id={pdf.id}
            title={pdf.name}
            ImageIcon={FileText}
            onClick={onClick}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <UploadDropzone fetchPdfData={fetchPdfData} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearnPage;
