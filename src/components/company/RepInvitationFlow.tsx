"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  permission: z.enum(["full", "limited", "collection_only"]),
});

type FormValues = z.infer<typeof schema>;

export interface RepInvitationFlowProps {
  className?: string;
}

export default function RepInvitationFlow({ className }: RepInvitationFlowProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { permission: "limited" } });

  const onSubmit = async (values: FormValues) => {
    await fetch("/api/permissions/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={clsx("space-y-4", className)}>
      <h2 className="text-sm font-medium">Invite Rep</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="email"
            placeholder="Rep email"
            className={clsx(
              "w-full rounded-md border px-3 py-2 text-sm",
              errors.email ? "border-red-500" : "border-gray-300"
            )}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...register("permission")}
        >
          <option value="full">Full</option>
          <option value="limited">Limited</option>
          <option value="collection_only">Collection Only</option>
        </select>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Invite
        </button>
      </div>
    </form>
  );
} 