"use client"

import { Cloud, File, FileText, Plus } from "lucide-react";
import { PdfCard } from "../courses/pdfCards";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import { Header } from "./header";
import { ChatScreen } from "@/components/ChatScreen";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import Dropzone from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { PDFTYPE } from "@/types";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";

const delay = async(ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const UploadDropzone = ({fetchPdfData, setOpen} : {fetchPdfData: () => Promise<void>, setOpen: Dispatch<SetStateAction<boolean>>}) => {

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("pdfUploader");

  const startSimulatedProgrss = () => {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((preProgress) => {
          if(preProgress >= 95) {
            clearInterval(interval);
            return preProgress
          }
          return preProgress + 5
        })
      }, 500);

      return interval;
  }
  
  return <Dropzone multiple={false} onDrop={async(acceptedFile) => {
    setIsUploading(true);

    const progressInterval = startSimulatedProgrss();
    // handleFile Upload
    const uploadthingRes = await startUpload(acceptedFile);
    if(!uploadthingRes){
      toast.error("something went wrong, please try again later")
      return;
    }

    const [fileResponse] = uploadthingRes;
    const key = fileResponse.key;

    if(!key){
      toast.error("something went wrong, please try again later")
      return;
    }
    
    const data = new FormData();
    data.set('file', acceptedFile[0]);

    const res = await axios.post('/api/upload', data);
    console.log(res.data.thread_id, res.data.fileName, "res");
    // pass pdf url as well in future
    const res2 = await axios.post('/api/chat/pdf/newchat', { threadId: res.data.thread_id, name: res.data.fileName, key: key });
    console.log(res2.data);
    clearInterval(progressInterval);
    setUploadProgress(100)
    await fetchPdfData();
    
    setOpen(false);

  }}>
    { ({ getRootProps, getInputProps, acceptedFiles }) => (
      <div 
      {...getRootProps()}
      className="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
        <div className="flex items-center justify-center h-full w-full">
          <label 
          htmlFor='dropzone-file' 
          className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className=" flex flex-col items-center justify-center pt-5 pb-6">
              <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
              <p className="mb-2 text-sm text-zinc-700">
                <span className="font-semibold">Click to upload</span> {' '}
                or drag and drop
              </p>
              <p className="text-sm text-zinc-500">PDF</p>
            </div>

            {acceptedFiles && acceptedFiles[0] ? (
              <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                <div className="px-3 py-2 h-full grid place-items-center">
                  <File className="h-4 w-4 text-blue-500" />
                </div>
                <div className="px-3 py-2 h-full text-sm truncate">
                  {acceptedFiles[0].name}
                </div>
              </div>
            ) : null}

            {isUploading ? (
              <div className="w-full mt-4 max-w-xs mx-auto">
                <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200" />
              </div>
            ) : null}

          </label>
          <input {...getInputProps()} />
        </div>
      </div>
    )}
  </Dropzone>
}


const LearnPage = () => {
  const [selected, setSelected] = useState<PDFTYPE | null | undefined>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [pdfs, setPdfs] = useState<PDFTYPE[] | []>([]);
  const onClick = (id: number) => {
    setSelected(pdfs.find(pdf => pdf.id === id));
  }

  const fetchPdfData = async() => {
    const tid = toast.loading('loading data');
    const res = await axios.get('/api/chat/pdf');
    console.log(res.data, "fetchdata");
    if(res.data.success){
      setPdfs(res.data.data);
    }else{
      toast.error('failed loading data');
    }
    toast.dismiss(tid);
  }

  useEffect(() => {
    fetchPdfData();
  }, []);

  console.log(pdfs, "pdfs");

  return (
    selected ?
      <div className="flex flex-col h-full w-full">
        <Header title='Chat with PDF' />
        <div className="flex w-full h-full justify-between py-5">
          <div className="w-3/5 rounded-lg bg-slate-100 scrollbar-thin scrollbar-track-border ">
            <PDFViewer pdf_url={`https://utfs.io/f/${selected.key}`} />
          </div>
          <div className="w-[39%] rounded-lg relative">
            <ChatScreen isPdfChat={true} thread_Id={selected.threadId} />
          </div>
        </div>
      </div>

      :

      <div className="flex flex-col h-full w-full relative">
        <Header title='Select PDF' hideArrowBack={true} />
        <Button onClick={() => setOpen(true)} className="w-fit flex space-x-2 items-center">
          <span>Upload PDF</span>
          <Plus />
        </Button>
        <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
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
