import React from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { Button } from '@/components/ui/buttons'
import { ActionButtonsProps } from '@/types'

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onBack,
  onNext,
  nextLabel = 'Next',
  isNextDisabled = false,
  nextVariant = 'primary',
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmDisabled = false,
}) => {
  if (onBack && onNext) {
    return (
      <div className='flex justify-between mt-4'>
        <Button
          onClick={onBack}
          variant='text'
          icon={AiFillCaretLeft}
          iconPosition='left'
          className='flex items-center text-sm text-text-primary px-2 mt-2'
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          variant={nextVariant}
          className={`px-6 py-2`}
        >
          {nextLabel}
        </Button>
      </div>
    )
  }

  if (onCancel && onConfirm) {
    return (
      <div className='flex justify-between mt-4'>
        <Button onClick={onCancel} variant='secondary' className='px-6 py-2'>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={confirmDisabled}
          variant='primary'
          className='px-6 py-2'
        >
          {confirmText}
        </Button>
      </div>
    )
  }

  return (
    <div className='flex justify-end mt-4'>
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        variant={nextVariant}
        className='px-6 py-2'
      >
        {nextLabel}
      </Button>
    </div>
  )
}

export default ActionButtons
