"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExitModal } from "@/store/use-exit-modal";
import { Input } from "../ui/input";
import { toast } from "sonner";
import axios from "axios";

type chatFolderType = {
  userId: string;
  name: string;
  id: number;
  createdAt: Date | null;
};

export const AddFolderModal = ({
  addChatFolderModal,
  setAddChatFolderModal,
  setChatFolders,
}: {
  addChatFolderModal: boolean;
  setAddChatFolderModal: Dispatch<SetStateAction<boolean>>;
  setChatFolders: Dispatch<SetStateAction<chatFolderType[]>>;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [folderName, setFolderName] = useState("");

  const addFolder = async () => {
    if (!folderName) {
      toast.error("Enter name to continue");
      return;
    } else {
      const res = await axios.post("/api/chat/pdf/folders", {
        name: folderName,
      });
      if (res.data.success) {
        setChatFolders((pre) => [res.data.data[0], ...pre]);
        toast.success("folder added");
        setAddChatFolderModal(false);
      }
    }
  };

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    <Dialog open={addChatFolderModal} onOpenChange={setAddChatFolderModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Add New Folder
          </DialogTitle>

          <DialogDescription className="text-center text-base">
            <Input onChange={(e) => setFolderName(e.target.value)} />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mb-4">
          <div className="flex w-full flex-row-reverse space-x-2">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={addFolder}
            >
              save
            </Button>

            <Button
              variant="dangerOutline"
              className="w-full"
              size="lg"
              onClick={() => {
                setAddChatFolderModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
