import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { DayPicker, CaptionProps } from 'react-day-picker'; // Import CaptionProps
import { format } from 'date-fns'; // Import format
import { ja } from 'date-fns/locale'; // Import Japanese locale

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Define extended props interface for our custom caption
interface CustomCaptionProps extends CaptionProps {
  goToMonth: (date: Date) => void;
  previousMonth: Date | undefined;
  nextMonth: Date | undefined;
}

// Custom Caption component for year/month dropdowns
function CustomCaption(props: CustomCaptionProps) {
  const { displayMonth } = props;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i); // Years from current down to 1990
  const months = Array.from({ length: 12 }, (_, i) => i); // 0 to 11

  const handleYearChange = (value: string) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(parseInt(value, 10));
    props.goToMonth(newDate); // Use goToMonth from props
  };

  const handleMonthChange = (value: string) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(parseInt(value, 10));
     props.goToMonth(newDate); // Use goToMonth from props
  };

  return (
    <div className="flex justify-between items-center px-2 py-1.5">
       <div className="flex items-center gap-1">
         <Select
           value={displayMonth.getFullYear().toString()}
           onValueChange={handleYearChange}
         >
           <SelectTrigger className="h-7 text-xs focus:ring-0 border-none shadow-none font-medium pr-1">
             <SelectValue placeholder="年" />
           </SelectTrigger>
           <SelectContent>
             {years.map((year) => (
               <SelectItem key={year} value={year.toString()} className="text-xs">
                 {year}年
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
         <Select
           value={displayMonth.getMonth().toString()}
           onValueChange={handleMonthChange}
         >
           <SelectTrigger className="h-7 text-xs focus:ring-0 border-none shadow-none font-medium pr-1">
             <SelectValue placeholder="月" />
           </SelectTrigger>
           <SelectContent>
             {months.map((month) => (
               <SelectItem key={month} value={month.toString()} className="text-xs">
                 {format(new Date(0, month), 'MMMM', { locale: ja })} {/* Display Japanese month name */}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
       </div>
       <div className="space-x-1 flex items-center">
         <button
           onClick={() => props.previousMonth && props.goToMonth(props.previousMonth)} // Use goToMonth
           disabled={!props.previousMonth}
           className={cn(
             buttonVariants({ variant: 'outline' }),
             'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
           )}
         >
           <ChevronLeftIcon className="h-4 w-4" />
         </button>
         <button
           onClick={() => props.nextMonth && props.goToMonth(props.nextMonth)} // Use goToMonth
           disabled={!props.nextMonth}
           className={cn(
             buttonVariants({ variant: 'outline' }),
             'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
           )}
         >
           <ChevronRightIcon className="h-4 w-4" />
         </button>
       </div>
    </div>
  );
}


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        // caption: 'flex justify-center pt-1 relative items-center', // Remove default caption style
        // caption_label: 'text-sm font-medium', // Remove default caption label style
        // nav: 'space-x-1 flex items-center', // Remove default nav style
        // nav_button: cn( // Remove default nav button style
        //   buttonVariants({ variant: 'outline' }),
        //   'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        // ),
        // nav_button_previous: 'absolute left-1', // Remove default nav button style
        // nav_button_next: 'absolute right-1', // Remove default nav button style
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        // IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />, // Use caption component instead
        // IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />, // Use caption component instead
        Caption: CustomCaption as React.ComponentType<CaptionProps>, // Type assertion to make TypeScript happy
      }}
      locale={ja} // Set default locale to Japanese
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
