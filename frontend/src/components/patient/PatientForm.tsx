import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const patientSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  uhid: z.string().min(4, 'UHID is required'),
  department: z.string().min(1, 'Department is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  days: z.number().min(0, 'Days must be positive'),
  diagnosis: z.string().min(5, 'Diagnosis must be descriptive').max(2000, 'Diagnosis cannot exceed 2000 characters'),
  status: z.enum(['CRITICAL', 'HIGH RISK', 'ISOLATION', 'STABLE']),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (data: PatientFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultDepartments = [
  'ICU',
  'CCU',
  'Emergency',
  'Neurology',
  'Cardiology',
  'General Ward'
];

export const PatientForm = ({ initialData, onSubmit, onCancel, isLoading }: PatientFormProps) => {
  const [departments, setDepartments] = useState<string[]>(
    initialData && !defaultDepartments.includes(initialData.department)
      ? [...defaultDepartments, initialData.department]
      : defaultDepartments
  );
  
  const [openDept, setOpenDept] = useState(false);
  const [deptSearch, setDeptSearch] = useState('');

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData || {
      patientName: '',
      uhid: '',
      department: 'ICU',
      admissionDate: new Date().toISOString().split('T')[0],
      days: 0,
      diagnosis: '',
      status: 'STABLE',
    },
  });

  const diagnosisLength = form.watch('diagnosis')?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uhid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UHID</FormLabel>
                <FormControl>
                  <Input placeholder="UHID-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Department</FormLabel>
                <Popover open={openDept} onOpenChange={setOpenDept}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? departments.find((dept) => dept === field.value)
                          : "Select department"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search department..." 
                        onValueChange={setDeptSearch}
                        value={deptSearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="flex flex-col items-center justify-center p-4">
                            <span className="text-sm text-slate-500 mb-2">No department found.</span>
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="sm"
                              onClick={() => {
                                if (deptSearch.trim()) {
                                  setDepartments([...departments, deptSearch.trim()]);
                                  form.setValue('department', deptSearch.trim());
                                  setOpenDept(false);
                                  setDeptSearch('');
                                }
                              }}
                            >
                              Create "{deptSearch}"
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {departments.map((dept) => (
                            <CommandItem
                              value={dept}
                              key={dept}
                              onSelect={() => {
                                form.setValue("department", dept)
                                setOpenDept(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  dept === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {dept}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="admissionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admission Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days Admitted</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alert Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CRITICAL">CRITICAL</SelectItem>
                    <SelectItem value="HIGH RISK">HIGH RISK</SelectItem>
                    <SelectItem value="ISOLATION">ISOLATION</SelectItem>
                    <SelectItem value="STABLE">STABLE</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed diagnosis, clinical notes, and observations..." 
                  className="resize-y min-h-[150px]" 
                  maxLength={2000}
                  {...field} 
                />
              </FormControl>
              <div className="flex justify-end mt-1">
                <span className={cn("text-xs", diagnosisLength > 1900 ? "text-red-500 font-medium" : "text-slate-500")}>
                  {diagnosisLength} / 2000 Characters
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-brand hover:bg-[#9a151c] text-white">
            {isLoading ? 'Saving...' : initialData ? 'Update Patient' : 'Save Patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
