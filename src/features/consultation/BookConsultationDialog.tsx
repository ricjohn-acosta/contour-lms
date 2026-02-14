import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const BookConsultationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="size-4" />
          Book consultation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Book a consultation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Choose a tutor</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tutor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe (Maths)</SelectItem>
                <SelectItem value="jane-smith">Jane Smith (English)</SelectItem>
                <SelectItem value="mike-johnson">
                  Mike Johnson (Science)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Reason for consultation</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homework">Help with homework</SelectItem>
                <SelectItem value="assignment">
                  Help with an assignment
                </SelectItem>
                <SelectItem value="exam-prep">
                  Exam or test preparation
                </SelectItem>
                <SelectItem value="concept-clarity">
                  Understanding a concept
                </SelectItem>
                <SelectItem value="catch-up">
                  Catch up after missed classes
                </SelectItem>
                <SelectItem value="essay-feedback">
                  Essay or writing feedback
                </SelectItem>
                <SelectItem value="study-skills">
                  Study skills and revision
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="default" size="sm">
            Book consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
