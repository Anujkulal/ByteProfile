import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EducationSchema, EducationValues } from "@/lib/resumeSchema";
import { ResumeEditorFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

const EducationForm = ({
  resumeData,
  setResumeData,
}: ResumeEditorFormProps) => {
  const form = useForm<EducationValues>({
    resolver: zodResolver(EducationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setResumeData({
        ...resumeData,
        educations: values.educations?.filter((edu) => edu != undefined) || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setResumeData]);

  // allows to dynamically add and remove educations
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDrag = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // check if the dragged item is not the same as the over item (drop and drop is not on the same position)
      const oldIndex = fields.findIndex((fields) => fields.id === active.id);
      const newIndex = fields.findIndex((fields) => fields.id === over.id);
      move(oldIndex, newIndex); // move the item to the new position //telling the react-hook-form that we are moving the item
      return arrayMove(fields, oldIndex, newIndex); // return the new array with the moved item //telling the dnd-kit that we are moving the item
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Educational Information</h2>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {/*
           * This is the main part of the form where we use react-hook-form to manage the form state
           * and dnd-kit to allow drag and drop functionality for the experience items
           * restrictToVerticalAxis is used to restrict the dragging to vertical axis only
           * closestCenter is used to detect the closest item to the dragged item
           * sensors are used to detect the drag and drop events
           */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDrag}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <EducationItem
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                  id={field.id}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  institution: "",
                  degree: "",
                  fieldOfStudy: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              {" "}
              <PlusCircle /> Add education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

interface EducationItemProps {
  form: UseFormReturn<EducationValues>;
  index: number;
  remove: (index: number) => void;
  id: string;
}

const EducationItem = ({ form, index, remove, id }: EducationItemProps) => {
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

  return (
    <div 
    className={cn("bg-background space-y-3 rounded-md border p-3", isDragging && "relative shadow-xl z-50 cursor-grab")}
          ref={setNodeRef}
          style={{transform: CSS.Transform.toString(transform), transition}}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Education {index + 1}</span>
        <div className="flex items-center gap-6">
          <Button
            variant={"destructive"}
            type="button"
            onClick={() => remove(index)}
          >
            {" "}
            <Trash2 />{" "}
          </Button>
          <GripHorizontal className="text-muted-foreground cursor-grab focus:outline-none"
            {...attributes}
            {...listeners}
          />
        </div>
      </div>
      <FormField
        control={form.control}
        name={`educations.${index}.institution`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institution</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.fieldOfStudy`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch / Course</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                {/* slice to get YYYY-MM-DD format (10 chars) and remove time */}
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`educations.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                {/* slice to get YYYY-MM-DD format (10 chars) and remove time */}
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default EducationForm;
