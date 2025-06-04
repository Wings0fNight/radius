import React from "react";
import {Sheet, SheetTrigger, SheetContent,SheetHeader, SheetFooter, SheetTitle, SheetDescription,} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Pencil } from "lucide-react";

export const TableSheetMenu = ({ 
  triggerChildren,
  menuItems,
  initialData,
  onSubmit,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(initialData || {});
  const [isDeleteConfirmation, setIsDeleteConfirmation] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      const processedData = {...initialData};
      menuItems.forEach(item =>{
        if (item.type === 'code' && processedData[item.name]) {
          processedData[item.name] = processedData[item.name].replace(/\\n/g, '\n');
        }
      });
      setFormData(processedData);
    };
    // console.log(initialData);        // DEBUG LOG
  }, [initialData, menuItems]);

  React.useEffect(() => {
    if (!isOpen) {
      setIsDeleteConfirmation(false);
    }
  }, [isOpen]);

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value ? 'True' : 'False'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    setIsOpen(false);
  };

  const handleDeleteConfirmation = () => {
    setIsDeleteConfirmation(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteConfirmation(false);
  };
  const handleConfirmDelete = () => {
    onDelete?.(initialData);
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{triggerChildren}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        {isDeleteConfirmation ? (
          <div className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>Вы уверены, что хотите удалить <span className="font-bold text-ring">{triggerChildren}</span>?</SheetTitle>
              <SheetDescription>
                Это действие не может быть отменено.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="remove"
                onClick={handleConfirmDelete}
              >
                Да, удалить
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
              >
                Отмена
              </Button>
            </SheetFooter>
          </div>
        ) : ( 
          <>
            <SheetHeader>
                <SheetTitle>Edit <span className="font-bold text-ring">{triggerChildren}</span></SheetTitle>
                <SheetDescription></SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="m-2 relative h-screen">
              <div className="space-y-4 mt-2">
                {menuItems.map((field, index) => (
                  <div key={index} className="grid gap-2">
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                          value={formData[field.name] || field.currentValue || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          className="block w-full p-2 border rounded-md"
                          required={field.required}
                      >
                          <option value="">Select {field.label}</option>
                          {field.content?.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                          ))}
                      </select>
                    ) : field.type === 'switch' ? (
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={formData.enabled === 'True'}
                          onCheckedChange={(checked) => handleSwitchChange(field.name, checked)}
                        />
                        <label className="text-sm font-medium">
                          {formData.enabled === 'True' ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    ) : field.type === 'button' ? (
                      <Button
                          type="button"
                          variant="default"
                          onClick={() => {
                            field.onClick?.(initialData);
                            setIsOpen(false);
                          }}
                          className="w-full"
                      >
                          {field.descr}
                      </Button>
                    ) : field.type === 'code' ? (
                      <Textarea 
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className="block w-full p-2 border rounded-md"
                        spellCheck="false"
                      />
                    ) : (
                      <input
                          type={field.type || 'text'}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          className="block border-0 border-b-2 appearance-none border-border focus:border-primary focus:outline-none focus:ring-0 peer"
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={field.disabled}
                      />
                    )}
                  </div>
                ))}
              </div>
              <SheetFooter className="mt-6 gap-2 w-full absolute bottom-0">
                <Button type="submit" variant="accept" className="flex-1">
                  <Pencil className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="remove"
                  className="flex-1"
                  onClick={handleDeleteConfirmation}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </SheetFooter>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};