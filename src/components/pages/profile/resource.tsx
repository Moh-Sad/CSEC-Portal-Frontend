"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

const resourceSchema = z.object({
  resources: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      link: z.string()
        .url("Please enter a valid URL (https://example.com)")
        .refine(
          (value) => {
            try {
              const url = new URL(value);
              return /\.(com|org|net|co|io|gov|edu|me|info|biz|xyz|[a-z]{2,})$/i.test(url.hostname);
            } catch {
              return false;
            }
          },
          {
            message: "URL must have a valid domain extension (.com, .org, etc.)"
          }
        )
    })
  )
});

interface ResourcesProps {
  formData: {
    resources: { name: string; link: string }[]
  }
  handleChange: (field: string, value: File | null) => void
  handleResourceChange: (index: number, field: string, value: string) => void
  addResource: () => void
  onSave?: () => void
  onCancel?: () => void
}

export default function Resources({ 
  formData, 
  handleResourceChange, 
  addResource,
  onSave,
  onCancel
}: ResourcesProps) {
  const { formState: { errors }, trigger, setValue } = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues: { resources: formData.resources }
  });

  useEffect(() => {
    setValue("resources", formData.resources);
  }, [formData.resources, setValue]);

  const handleLinkChange = async (index: number, value: string) => {
    handleResourceChange(index, "link", value);
    await trigger(`resources.${index}.link`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resources</h3>

        {formData.resources.map((resource, index) => (
          <div key={index} className="flex flex-col gap-4 md:flex-row ">
            <div className="flex-1">
              <div className="space-y-2">
                <Label htmlFor={`resourceName-${index}`}>Resource Name</Label>
                <Input
                  id={`resourceName-${index}`}
                  value={resource.name}
                  onChange={(e) => handleResourceChange(index, "name", e.target.value)}
                  placeholder="Resource Name"
                  className="border border-gray-300 rounded-[8px] h-10"
                />
              </div>
              {errors.resources?.[index]?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.resources[index]?.name?.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <Label htmlFor={`resourceLink-${index}`}>Resource Link</Label>
                <Input
                  id={`resourceLink-${index}`}
                  value={resource.link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="https://example.com"
                  className="border border-gray-300 rounded-[8px] h-10"
                />
              </div>
              {errors.resources?.[index]?.link && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.resources[index]?.link?.message}
                </p>
              )}
            </div>
            <div className="flex items-end">
            {index === formData.resources.length - 1 && (
              <Button 
                type="button" 
                onClick={addResource} 
                className="flex items-center gap-2 h-10 px-4 py-2 rounded-lg bg-[#003087] hover:bg-[#003081]/90 text-white mb-[2px]"
              >
                Add
              </Button>
            )}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            className="h-10 px-4 py-2 rounded-lg border border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={async () => {
              const isValid = await trigger();
              if (isValid && onSave) onSave();
            }}
            className="h-10 px-4 py-2 rounded-lg bg-[#003087] hover:bg-[#003081]/90 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}