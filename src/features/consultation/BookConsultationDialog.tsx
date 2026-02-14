"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookConsultation } from "@/services/consultation/consultation.mutations";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { useGetTutors } from "@/services/tutors/tutors.queries";
import { Tables } from "@/types/database.types";
import { Tutor } from "@/services/tutors/tutors.service";

type BookConsultationFormValues = {
  tutor_id: string;
  reason: string;
};

export const BookConsultationDialog = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const { mutate: createConsultation } = useBookConsultation();
  const { data: tutors, isLoading: isLoadingTutors } = useGetTutors();

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookConsultationFormValues>({
    defaultValues: { tutor_id: "", reason: "" },
    mode: "onBlur",
  });

  const onSubmit = (data: BookConsultationFormValues) => {
    createConsultation(
      {
        reason: data.reason,
        tutor_id: data.tutor_id,
        user_id: user.id,
      },
      {
        onSuccess: () => {
          toast.success("Consultation booked successfully");
          reset();
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to book consultation");
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      reset();
      clearErrors();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-400 hover:bg-blue-500" size="sm">
          <PlusIcon className="size-4" />
          Book consultation
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Book a consultation</DialogTitle>
        </DialogHeader>

        {isLoadingTutors ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tutor_id">Choose a tutor</Label>
              <Controller
                name="tutor_id"
                control={control}
                rules={{ required: "Please select a tutor" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={(open) => !open && field.onBlur()}
                  >
                    <SelectTrigger
                      id="tutor_id"
                      className="w-full"
                      aria-invalid={!!errors.tutor_id}
                    >
                      <SelectValue placeholder="Select a tutor" />
                    </SelectTrigger>
                    <SelectContent>
                      {tutors &&
                        tutors.map((tutor: Tutor) => (
                          <SelectItem key={tutor.id} value={tutor.id}>
                            {tutor.first_name} {tutor.last_name} (
                            {tutor.specialization})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tutor_id && (
                <p className="text-xs text-red-500">
                  {errors.tutor_id.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for consultation</Label>
              <Controller
                name="reason"
                control={control}
                rules={{ required: "Please select a reason" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={(open) => !open && field.onBlur()}
                  >
                    <SelectTrigger
                      id="reason"
                      className="w-full"
                      aria-invalid={!!errors.reason}
                    >
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Help with homework">
                        Help with homework
                      </SelectItem>
                      <SelectItem value="Help with an assignment">
                        Help with an assignment
                      </SelectItem>
                      <SelectItem value="Exam or test preparation">
                        Exam or test preparation
                      </SelectItem>
                      <SelectItem value="Understanding a concept">
                        Understanding a concept
                      </SelectItem>
                      <SelectItem value="Catch up after missed classes">
                        Catch up after missed classes
                      </SelectItem>
                      <SelectItem value="Essay or writing feedback">
                        Essay or writing feedback
                      </SelectItem>
                      <SelectItem value="Study skills and revision">
                        Study skills and revision
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reason && (
                <p className="text-xs text-red-500">{errors.reason.message}</p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="bg-blue-400 hover:bg-blue-500"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Book consultation"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
