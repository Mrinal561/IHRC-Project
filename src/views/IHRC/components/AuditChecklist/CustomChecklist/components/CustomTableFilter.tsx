import React, { useState, useRef, forwardRef } from 'react'
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import type { MouseEvent } from 'react'

// Define the form model type
type FormModel = {
  itemId: string
  itemCategory: string[]
  itemLocation: string[]
}

// Define the FilterForm component props
type FilterFormProps = {
  onSubmitComplete?: () => void
}

// Define the DrawerFooter component props
type DrawerFooterProps = {
  onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

// Define the FilterForm component
const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
  ({ onSubmitComplete }, ref) => {
    const handleSubmit = (values: FormModel) => {
      onSubmitComplete?.()
      console.log(values) // Replace with your filter logic
    }

    const initialValues: FormModel = {
      itemId: '',
      itemCategory: [],
      itemLocation: [],
    }

    return (
      <Formik
        enableReinitialize
        innerRef={ref}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors }) => (
          <Form>
            <FormContainer>
              <FormItem
                invalid={errors.itemId && touched.itemId}
                errorMessage={errors.itemId}
              >
                <h6 className="mb-4">Item ID</h6>
                <Field
                  type="text"
                  autoComplete="off"
                  name="itemId"
                  placeholder="Enter Item ID"
                  component={Input}
                  prefix={<HiOutlineSearch className="text-lg" />}
                />
              </FormItem>
              <FormItem
                invalid={errors.itemCategory && touched.itemCategory}
                errorMessage={errors.itemCategory as string}
              >
                <h6 className="mb-4">Item Category</h6>
                <Field name="itemCategory">
                  {({ field, form }: FieldProps) => (
                    <Checkbox.Group
                      vertical
                      value={values.itemCategory}
                      onChange={(options) =>
                        form.setFieldValue(field.name, options)
                      }
                    >
                      <Checkbox className="mb-3" name={field.name} value="Electronics">
                        Electronics
                      </Checkbox>
                      <Checkbox className="mb-3" name={field.name} value="Furniture">
                        Furniture
                      </Checkbox>
                      {/* Add more categories as needed */}
                    </Checkbox.Group>
                  )}
                </Field>
              </FormItem>
              <FormItem
                invalid={errors.itemLocation && touched.itemLocation}
                errorMessage={errors.itemLocation as string}
              >
                <h6 className="mb-4">Item Location</h6>
                <Field name="itemLocation">
                  {({ field, form }: FieldProps) => (
                    <Checkbox.Group
                      vertical
                      value={values.itemLocation}
                      onChange={(options) =>
                        form.setFieldValue(field.name, options)
                      }
                    >
                      <Checkbox className="mb-3" name={field.name} value="New York">
                        New York
                      </Checkbox>
                      <Checkbox className="mb-3" name={field.name} value="Los Angeles">
                        Los Angeles
                      </Checkbox>
                      {/* Add more locations as needed */}
                    </Checkbox.Group>
                  )}
                </Field>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    )
  }
)

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
  return (
    <div className="text-right w-full">
      <Button size="sm" className="mr-2" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm" variant="solid" onClick={onSaveClick}>
        Apply Filters
      </Button>
    </div>
  )
}

// Define the CustomTableFilter component
const CustomTableFilter: React.FC = () => {
  const formikRef = useRef<FormikProps<FormModel>>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const onDrawerClose = () => setIsOpen(false)

  const formSubmit = () => {
    formikRef.current?.submitForm()
  }

  return (
    <>
      <Button
        size="sm"
        className="block md:inline-block ltr:md:ml-2 rtl:md:mr-2 md:mb-0 mb-4"
        icon={<HiOutlineFilter />}
        onClick={openDrawer}
      >
        Filter
      </Button>
      <Drawer
        title="Custom Filters"
        isOpen={isOpen}
        footer={
          <DrawerFooter
            onCancel={onDrawerClose}
            onSaveClick={formSubmit}
          />
        }
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
      </Drawer>
    </>
  )
}

FilterForm.displayName = 'FilterForm'

export default CustomTableFilter