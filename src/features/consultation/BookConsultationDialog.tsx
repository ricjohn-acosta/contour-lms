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
import { CalendarIcon, Loader2Icon, PlusIcon } from "lucide-react";
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
import { Tutor } from "@/services/tutors/tutors.service";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format, isValid, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";

type BookConsultationFormValues = {
  tutor_id: string;
  reason: string;
  scheduled_at: Date;
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
    defaultValues: { tutor_id: "", reason: "", scheduled_at: undefined! },
    mode: "onBlur",
  });

  const onSubmit = (data: BookConsultationFormValues) => {
    createConsultation(
      {
        reason: data.reason,
        tutor_id: data.tutor_id,
        user_id: user.id,
        ...(data.scheduled_at && {
          scheduled_at: data.scheduled_at.toISOString(),
        }),
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

            <div className="grid gap-2">
              <Label htmlFor="scheduled_at">Consultation date & time</Label>
              <Controller
                name="scheduled_at"
                control={control}
                rules={{ required: "Please pick a date and time" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="scheduled_at"
                        variant="outline"
                        aria-invalid={!!errors.scheduled_at}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4 shrink-0" />
                        {field.value && isValid(field.value) ? (
                          format(field.value, "PPP 'at' p")
                        ) : (
                          <span>Pick date and time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex flex-col gap-3 p-3">
                        <Calendar
                          mode="single"
                          selected={
                            field.value && isValid(field.value)
                              ? field.value
                              : undefined
                          }
                          onSelect={(date) => {
                            if (!date) {
                              field.onChange(undefined);
                              return;
                            }
                            const existing =
                              field.value && isValid(field.value)
                                ? field.value
                                : undefined;
                            const hours = existing?.getHours() ?? 9;
                            const minutes = existing?.getMinutes() ?? 0;
                            field.onChange(
                              setMinutes(setHours(date, hours), minutes)
                            );
                          }}
                          initialFocus
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                        <div className="flex items-center gap-2 border-t border-input pt-3">
                          <Label
                            htmlFor="time"
                            className="shrink-0 text-sm font-medium"
                          >
                            Time
                          </Label>
                          <Input
                            id="time"
                            type="time"
                            className="w-full"
                            value={
                              field.value && isValid(field.value)
                                ? format(field.value, "HH:mm")
                                : "09:00"
                            }
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const base =
                                field.value && isValid(field.value)
                                  ? field.value
                                  : new Date();
                              field.onChange(
                                setMinutes(setHours(base, hours), minutes)
                              );
                            }}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.scheduled_at && (
                <p className="text-xs text-red-500">
                  {errors.scheduled_at.message}
                </p>
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
